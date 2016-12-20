import { View } from './View';

export class Router {
  constructor() {
    console.log('Router constructor');
    this._currentView = null;
    this._viewData = null;
    this._newView = null;
    this._animatingViewOut = false;
    this._routes = new Map();

    window.addEventListener('popstate', this._onChanged.bind(this));
    this._createRoutes();
    this._onChanged();
  }

  _onChanged() {
    console.log('SCRouter _onChanged()');
    const path = window.location.pathname;
    const routes = Array.from(this._routes.keys());
    const route = routes.find(r => r.test(path));
    this._viewData = route.exec(path);
    console.log(`_onChanged::data = ${this._viewData}`);

    let outViewPromise = Promise.resolve();

    if (!route) {
      console.warn('Could not find a matching route for', path);
      outViewPromise;
    }

    // Figure out the new view
    this._newView = this._routes.get(route);

    // If we're still animating a view, ignore your click request
    if (this._animatingViewOut) {
      console.log('Still animating - bouncing route request');
      return outViewPromise;
    }

    // Set animating to true because no matter what we
    // do below we're going to be animating some new view
    this._animatingViewOut = true;

    // If there is a current view
    if (this._currentView) {

      if (this._newView === this._currentView) {
        // Simply update the current view, no need for in()/out()
        this._animatingViewOut = false;
        return this._currentView.update(this._viewData);
      } else {
        // If newView is diff is different than our current view
        // Start kicking the currentView out
        outViewPromise = this._currentView.out(this._viewData);
      }

    }

    return outViewPromise.then(() => {
      this._animatingViewOut = false;
      this._currentView = this._newView;
      return this._newView.in(this._viewData);
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
    document.querySelectorAll('div[view]').forEach(view => {
      if (view.hasAttribute('route')) {
        console.log(new RegExp(view.getAttribute('route'), 'i'));
        this._createRoute(new RegExp(view.getAttribute('route'), 'i'), new View(view));
      }
    });
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this._onChanged);
  }
}
