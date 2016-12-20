/**
 * App.js
 */

import { Router } from './modules/Router';
import { View } from './modules/View';

class App {
  constructor() {
    this._bootstrapRouter();
    this._registerServiceWorker();
  }

  _registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      console.warn('About to load the service worker yay');
    }
  }

  _bootstrapRouter() {
    const router = new Router();

    // Click handler for li elements in navigation list
    function onClick(evt) {
      router.go(evt.target.firstChild.href);
    }

    for (let link of document.querySelectorAll('.header .header-content nav li')) {
      console.log('Attaching listener');

      // Plain old li click listener
      link.addEventListener('click', onClick);

      /**
       * If the user clicks a link inside a list item
       * that link will be the `.target` of the event
       * passed into the onClick function - however we
       * always want to call onClick with the list item
       * as the event target so we can get its firstChild's
       * href
       */
      link.firstChild.addEventListener('click', evt => {
        evt.preventDefault();
        evt.stopPropagation(); // prevents us from triggering li click again on bubble stage
        link.click();
      });
    }
  }
}

new App();
