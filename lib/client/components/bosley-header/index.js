export class BosleyHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});

    shadow.innerHTML = `
      <style>
        ${require("css-loader!./template.css")}
      </style>

      ${require("html-loader!./template.html")}
    `;
  }
}
