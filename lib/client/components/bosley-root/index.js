import { BosleyHeader } from '../bosley-header';

export class BosleyRoot extends HTMLElement {
  constructor() {
    super(); // ALWAYS
    console.log('BosleyRoot constructor()');
  }

  connectedCallback() {
    console.log('BosleyRoot connectedCallback()');
    const shadow = this.attachShadow({mode: 'open'});

    shadow.innerHTML = `
      <style>
        :host {
          font-family: inherit;
        }
      </style>
      <bosley-header>
    `;
  }
}

if ('customElements' in window) {
  customElements.define('bosley-header', BosleyHeader);
}
