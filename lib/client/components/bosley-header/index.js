export class BosleyHeader extends HTMLElement {
  constructor() {
    super(); // ALWAYS
    console.log('BosleyHeader constructor()');
  }

  connectedCallback() {
    console.log('BosleyHeader connectedCallback()');

    const shadow = this.attachShadow({mode: 'open'});

    shadow.innerHTML = `
      <style>
        ${require("css-loader!./template.css")}
      </style>

      ${require("html-loader!./template.html")}
    `;
  }
}

customElements.define('bosley-header', BosleyHeader);
