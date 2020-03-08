class HomePage extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.makeDom();
    const self = this;
    this.shadowRoot.querySelector('#account-id')
      .innerHTML = AuthService.myInfo.accountId;
    this.shadowRoot.querySelector('#sign-out')
      .addEventListener('click', () => self.signOut());
  }

  makeDom() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const tpl = document.getElementById('home-page');
    const elementRef = tpl.content.cloneNode(true);
    shadowRoot.appendChild(elementRef);
    shadowRoot.componentInstance = this;
  }

  signOut() {
    const isSignOut = confirm('登出?');
    if (isSignOut) {
      AuthService.signOut();
      location.assign('#sign-in');
    }
  }
}

customElements.define('home-page', HomePage);
