class SignUpPage extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.makeDom();
    this.makeFormModel();
    this.bindDomEvent();
  }

  makeDom() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const tpl = document.getElementById('sign-up-page');
    const elementRef = tpl.content.cloneNode(true);
    shadowRoot.appendChild(elementRef);
    shadowRoot.componentInstance = this;
  }

  bindDomEvent() {
    const self = this;
    this.shadowRoot.querySelector('#sign-up')
      .addEventListener('click', () => self.signUp());
    Object.values(this.formGroup.controls)
      .forEach(c => c.controlDom.addEventListener('keyup', e => {
        if (e.keyCode === 13) self.signUp();
      }));
  }

  makeFormModel() {
    const shadowRoot = this.shadowRoot;
    const formGroup = new FormGroup({
      accountId: new FormControl({
        fieldDom: shadowRoot.querySelector('#account-id'),
        controlDom: shadowRoot.querySelector('#account-id input'),
        errorMsgDom: shadowRoot.querySelector('#account-id p'),
        validation: [
          Validator.required(),
          Validator.pattern(/^[a-z][\w\.-]*@\w+(\.\w+)+$/, 'email')
        ],
        validationMsg: {
          required: '必填',
          email: 'Email 格式有誤',
        },
      }),
      password: new FormControl({
        fieldDom: shadowRoot.querySelector('#password'),
        controlDom: shadowRoot.querySelector('#password input'),
        errorMsgDom: shadowRoot.querySelector('#password p'),
        validation: [
          Validator.required(),
          Validator.pattern(/^.{8}/, 'min8'),
          Validator.pattern(/\d/, 'includeNumber'),
          Validator.pattern(/[a-z]/, 'includeLowerCase'),
          Validator.pattern(/[A-Z]/, 'includeUpperCase'),
          Validator.pattern(/^[A-Za-z0-9]+$/, 'numOrEng'),
        ],
        validationMsg: {
          required: '必填',
          min8: '至少 8 個字',
          includeNumber: '須有數字',
          includeLowerCase: '須有小寫英文',
          includeUpperCase: '須有大寫英文',
          numOrEng: '限英文數字',
        },
      }),
      repeatPassword: new FormControl({
        fieldDom: shadowRoot.querySelector('#repeat-password'),
        controlDom: shadowRoot.querySelector('#repeat-password input'),
        errorMsgDom: shadowRoot.querySelector('#repeat-password p'),
        validation: [
          Validator.required(),
          Validator.makeValidator('matched', c => c.value === formGroup.controls.password.value)
        ],
        validationMsg: {
          required: '必填',
          matched: '密碼須相同'
        },
      }),
    });

    this.formGroup = formGroup;
  }

  signUp() {
    const formGroup = this.formGroup;
    formGroup.verifyAndUpdate();

    if (!formGroup.isValid) {
      return;
    }

    const { accountId, password } = this.formGroup.value;
    const payload = { accountId, password };

    AuthService.signUp(payload)
      .then(
        data => location.assign('#home'),
        err => alert('註冊失敗 ' + err.message)
      );
  }
}

customElements.define('sign-up-page', SignUpPage);
