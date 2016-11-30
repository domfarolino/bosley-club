/**
 * App.js
 */

import { BosleyHeader } from './components/bosley-header';
import { SCRouter } from './components/sc-router';
import { SCView } from './components/sc-view';
import { DomCard } from './components/dom-card';

class App {
  constructor() {
    // Get the user a proper top-level error if customElements are not supported
    if (!('customElements' in window)) {
      console.warn('Custom elements are not supported in your browser');
      const elementsNotSupported = document.createElement('h1');
      elementsNotSupported.innerText = 'Custom Elements are not supported in your browser';
      document.body.appendChild(elementsNotSupported);
    }

    if ('customElements' in window) {
      customElements.define('bosley-header', BosleyHeader);
      customElements.define('sc-view', SCView);
      customElements.define('sc-router', SCRouter);
      customElements.define('dom-card', DomCard);

      this._bootstrapRouter();
    }
  }

  _bootstrapRouter() {
    const router = document.querySelector('sc-router');

    function onClick(e) {
      e.preventDefault();
      router.go(e.target.href);
    }

    for (let link of document.querySelectorAll('bosley-header nav a')) {
      console.log('Attaching listener');
      link.addEventListener('click', onClick);
    }
  }
}

new App();
