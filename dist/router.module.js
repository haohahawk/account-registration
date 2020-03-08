const RouterModule = (() => {

  return {
    forRoot(routes, routerOutlet) {
      this.routes = routes;
      this.routerOutlet = routerOutlet;
    },
    bootstrap() {
      const self = this;
      resumeComponent(self);
      window.addEventListener('hashchange', e => {
        resumeComponent(self);
      });
    }
  };

  function resumeComponent(m) {
    const routes = m.routes;
    const routerOutlet = m.routerOutlet;
    const { origin, pathname, href } = location;
    const baseUrl = origin + pathname;
    const hashKey = '#';
    const routeHrefMatches = href.match(new RegExp(`^${baseUrl}${hashKey}*([^?]*)[?]*(.)*$`));
    const routePath = routeHrefMatches[1];

    let lastChild = routerOutlet.lastChild;
    while (routerOutlet.lastChild) {
      routerOutlet.removeChild(lastChild);
      lastChild = routerOutlet.lastChild;
    }

    const route = findRoute(routes, routePath);
    if (route) {
      const activatedRoute = { path: route.path };
      const canActivate = !Array.isArray(route.canActivate)
        || route.canActivate.every(g => g.canActivate(activatedRoute));

      if (route.component && canActivate) {
        routerOutlet.appendChild(new route.component());
      }
    }
  }

  function findRoute(routes, path) {
    const route = routes.find(r => r.path === path);
    if (route && route.redirectTo) {
      path = route.redirectTo;
      return findRoute(routes, path);
    }
    return route;
  }
})();