/**
 * App.js
 */

import { BosleyRoot } from './components/bosley-root';

if (!('customElements' in window)) {
  console.warn('Custom elements are not supported in your browser');
  const elementsNotSupported = document.createElement('h1');
  elementsNotSupported.innerText = 'Custom Elements are not supported in your browser';
  document.body.appendChild(elementsNotSupported);
} else {
  customElements.define('bosley-root', BosleyRoot);
}
