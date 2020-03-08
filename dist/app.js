const ROUTE_CONFIG = [{
  path: '',
  redirectTo: 'home'
}, {
  path: 'home',
  component: HomePage,
  canActivate: [AuthService],
}, {
  path: 'sign-in',
  component: SignInPage,
  canActivate: [AuthService],
}, {
  path: 'sign-up',
  component: SignUpPage,
  canActivate: [AuthService],
}];

RouterModule.forRoot(
  ROUTE_CONFIG, 
  document.querySelector('#router-outlet'),
);
RouterModule.bootstrap();