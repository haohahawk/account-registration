class SignInPage extends HTMLElement {

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
    const tpl = document.getElementById('sign-in-page');
    const elementRef = tpl.content.cloneNode(true);
    shadowRoot.appendChild(elementRef);
    shadowRoot.componentInstance = this;
  }

  bindDomEvent() {
    const self = this;
    this.shadowRoot.querySelector('#sign-in')
      .addEventListener('click', () => self.signIn());
    Object.values(this.formGroup.controls)
      .forEach(c => c.controlDom.addEventListener('keyup', e => {
        if (e.keyCode === 13) self.signIn();
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
          Validator.pattern(/^[\w.-]+@\w+(\.\w+)+$/, 'email')
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
          Validator.pattern(/\d/, 'mixedNumberAndUppercaseAndLowercase'),
          Validator.pattern(/[a-z]/, 'mixedNumberAndUppercaseAndLowercase'),
          Validator.pattern(/[A-Z]/, 'mixedNumberAndUppercaseAndLowercase'),
          Validator.pattern(/^[A-Za-z0-9]{8,20}$/, 'mixedNumberAndUppercaseAndLowercase'),
        ],
        validationMsg: {
          required: '必填',
          mixedNumberAndUppercaseAndLowercase: '請混用數字和大小寫英文 8 ~ 20 個字'
        },
      }),
    });

    this.formGroup = formGroup;
  }

  signIn() {
    const formGroup = this.formGroup;
    formGroup.verifyAndUpdate();

    if (!formGroup.isValid) {
      return;
    }

    const { accountId, password } = this.formGroup.value;
    const payload = { accountId, password };

    AuthService.signIn(payload)
      .then(
        data => location.assign('#home'),
        err => alert('登入失敗 ' + err.message)
      );
  }
}

customElements.define('sign-in-page', SignInPage);
