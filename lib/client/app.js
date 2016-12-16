/**
 * App.js
 */

import { BosleyHeader } from './components/bosley-header';
import { SCRouter } from './components/sc-router';
import { SCView } from './components/sc-view';
import { DomCard } from './components/dom-card';

class App {
  constructor() {
    // Define custom elements
    this._bootstrapCustomElements();
    this._registerServiceWorker();
  }

  _registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      console.warn('About to load the service worker yay');
    }
  }

  _bootstrapCustomElements() {
    // Get the user a proper top-level error if customElements are not supported
    if ('customElements' in window) {
      customElements.define('bosley-header', BosleyHeader);
      customElements.define('sc-view', SCView);
      customElements.define('sc-router', SCRouter);
      customElements.define('dom-card', DomCard);

      this._bootstrapRouter();
    } else {
      const elementsNotSupported = document.createElement('h1');
      elementsNotSupported.innerText = 'Custom Elements are not supported in your browser';
      document.body.appendChild(elementsNotSupported);
    }
  }

  _bootstrapRouter() {
    const router = document.querySelector('sc-router');

    // Click handler for li elements in navigation list
    function onClick(evt) {
      router.go(evt.target.firstChild.href);
    }

    for (let link of document.querySelectorAll('bosley-header nav li')) {
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
