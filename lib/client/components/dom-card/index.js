export class DomCard extends HTMLElement {
  constructor() {
    super(); // ALWAYS
    console.log('DomCard constructor()');
  }

  connectedCallback() {
    console.log('DomCard connectedCallback()');

    const shadow = this.attachShadow({mode: 'open'});

    shadow.innerHTML = `
      <style>
        ${require("css-loader!./template.css")}
      </style>

      ${require("html-loader!./template.html")}
    `;
  }
}
