export class SCRouter extends HTMLElement {
  constructor() {
    super(); // ALWAYS
    this._routes = new Map();
    console.log('SCRouter constructor()');
  }

  _onChanged() {
    const path = window.location.pathname;
    const routes = Array.from(this._routes.keys());
    const route = routes.find(r => r.test(path));
    const data = route.exec(path);

    if (!route) {
      console.warn('Could not find a matching route for', path);
      return;
    }

    // Found a matching route - time to activate views

    // Figure out the new view
    this._newView = this._routes.get(route);

    let outViewPromise = Promise.resolve();

    // If we're still animating a view, sorry we're ignoring your click request
    if (this._animating) {
      return Promise.resolve();
    }

    // Set animating to true becuse no matter what we do
    // in the below if branch, we're going to be animating
    // some new view
    this._animating = true;

    // If there is a current view
    if (this._currentView) {
      // If the new view is equal to the current view
      if (this._newView === this._currentView) {
        // Simply update the current view, no need for in()/out()
        this._animating = false;
        return this._currentView.update(data);
      }

      // If our newView is different than our current view
      // Start kicking the currentView out
      outViewPromise = this._currentView.out(data);
    }

    return outViewPromise.then(() => {
      this._animating = false;
      this._currentView = this._newView; // TODO: dig into this more
      return this._newView.in(data);
    }).then(() => {
      console.log('Done!');
    });

  }

  go(url) {
    window.history.pushState(null, null, url);
    return this._onChanged();
  }

  _createRoute(route, view) {
    if (this._routes.has(route)) {
      console.warn(`Route already exists: ${route}`);
    } else {
      console.info('Adding routes hell yeah', route, view);
      this._routes.set(route, view);
    }
  }

  _clearRoutes() {
    this._routes.clear();
  }

  _createRoutes() {
    document.querySelectorAll('sc-view').forEach(view => {
      if (view.route) {
        console.log(new RegExp(view.route, 'i'));
        this._createRoute(new RegExp(view.route, 'i'), view);
      }
    });
  }

  connectedCallback() {
    console.log('SCRouter connectedCallback()');

    this._onChanged = this._onChanged.bind(this);
    window.addEventListener('popstate', this._onChanged);
    this._createRoutes();
    this._onChanged();
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._onChanged);
  }
}
