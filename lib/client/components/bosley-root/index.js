export class BosleyRoot extends HTMLElement {
  constructor() {
    super(); // ALWAYS
    console.log('BosleyRoot constructor()');
  }

  connectedCallback() {
    console.log('BosleyRoot connectedCallback()');

    this.innerHTML = `
      ${require("html-loader!./template.html")}
    `;
  }
}
