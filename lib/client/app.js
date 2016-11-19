/**
 * App.js
 */

import { BosleyRoot } from './components/bosley-root';
import { BosleyHeader } from './components/bosley-header';
import { SCRouter } from './components/sc-router';
import { SCView } from './components/sc-view';

if (!('customElements' in window)) {
  console.warn('Custom elements are not supported in your browser');
  const elementsNotSupported = document.createElement('h1');
  elementsNotSupported.innerText = 'Custom Elements are not supported in your browser';
  document.body.appendChild(elementsNotSupported);
} else {
  customElements.define('bosley-root', BosleyRoot);
  customElements.define('bosley-header', BosleyHeader);
  customElements.define('sc-view', SCView);
  customElements.define('sc-router', SCRouter);
}
