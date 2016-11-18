/**
 * App.js
 */

import { BosleyRoot } from './components/bosley-root';

if ('customElements' in window) {
  customElements.define('bosley-root', BosleyRoot);
}
