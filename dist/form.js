// examlpe: create a form, and bind input
// *.html
// <input type="text" id="first-name" />
// <input type="text" id="last-name" />
// <button type="button" onclick="resotre()">resotre</button>
// *.js
// const formGroup = new FormGroup({
//   firstName: new FormControl({ controlDom: document.querySelector('#first-name') }),
//   lastName: new FormControl({ controlDom: document.querySelector('#last-name') }),
// });
// function restore() {
//   formGroup.value = { firstName: 'yo', lastName: 'ho' };
//   console.log(formGroup.value);
//   console.log(formGroup.controls.firstName.value);
//   console.log(formGroup.controls.lastName.value);
// }

class FormGroup {
  get value() {
    const controls = this.controls;
    return Object.keys(controls)
      .reduce((value, key) => {
        value[key] = controls[key].value;
        return value;
      }, {});
  }
  set value(v) {
    const controls = this.controls;
    Object.keys(v)
      .forEach(key => {
        if (key in controls) {
          contorls[key].value = v[key];
        }
      });
  }

  get isValid() {
    return Object.values(this.controls)
      .reduce((isValid, control) => isValid && control.isValid, true);
  }

  constructor(controls) {
    this.controls = controls;
  }

  verifyAndUpdate() {
    Object.values(this.controls)
      .forEach(control => control.verifyAndUpdate());
  }
}

class FormControl {
  get value() { return this.controlDom.value }
  set value(v) { this.controlDom.value = v; }

  isValid = null;
  error = null;
  errorMsg = [];

  constructor({
    fieldDom = null,
    controlDom = null,
    errorMsgDom = null,
    validation = [],
    validationMsg = {}
  }) {
    if (!controlDom) throw new Error('controlDom is required');
    this.fieldDom = fieldDom;
    this.controlDom = controlDom;
    this.errorMsgDom = errorMsgDom;
    this.validation = validation;
    this.validationMsg = validationMsg;
  }

  verifyAndUpdate() {
    this.verify();
    this.updateDom();
  }

  verify() {
    const self = this;
    let error = {};
    if (this.validation.length) {
      error = this.validation
        .reduce((acc, v) => Object.assign(acc, v(self)), {});
    }
    this.error = !!Object.keys(error).length ? error : null;
    this.errorMsg = Object.keys(error)
      .map(errorKey => self.validationMsg[errorKey])
      .filter(msg => !!msg);
    this.isValid = !this.error;
  }

  updateDom() {
    const isValid = this.isValid;
    if (this.fieldDom) {
      this.fieldDom.classList.add(isValid ? 'valid' : 'invalid');
      this.fieldDom.classList.remove(isValid ? 'invalid' : 'valid');
    }
    if (this.errorMsgDom) {
      this.errorMsgDom.innerHTML = isValid ? '' : this.errorMsg.join('; ');
    }
  }
}

const Validator = (() => {
  const required = value => {
    let valid;
    if (value === null || value === undefined) {
      valid = false;
    } else if (Array.isArray(value) || typeof value === 'string') {
      valid = !!value.length;
    } else if (typeof value === 'boolean') {
      valid = true;
    } else if (typeof value === 'number') {
      valid = !isNaN(value) && isFinite(value);
    } else if (typeof value === 'object' && !!value) {
      valid = true;
    }
    return valid;
  };
  const makeValidator = (errorKey, isValidFn) => control => {
    return makeError(errorKey, isValidFn(control));
  };
  const makeError = (errorKey, isValid) => {
    return isValid ? null : { [errorKey]: true };
  };

  return {
    required() {
      return makeValidator('required', control => required(control.value))
    },
    pattern(regexp, errorKey = 'pattern') {
      return makeValidator(errorKey, control => {
        const v = control.value;
        return typeof v === 'string' && v ? regexp.test(v) : true;
      })
    },
    makeValidator: makeValidator,
  };
})();
