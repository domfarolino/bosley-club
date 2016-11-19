export class BosleyRoot extends HTMLElement {
  constructor() {
    super(); // ALWAYS
    console.log('BosleyRoot constructor()');
  }

  connectedCallback() {
    console.log('BosleyRoot connectedCallback()');

    this.innerHTML = `
      <style>
        ${require("css-loader!./template.css")}
      </style>
      ${require("html-loader!./template.html")}
    `;

    const router = document.querySelector('sc-router');

    function onClick(e) {
      e.preventDefault();
      router.go(e.target.href);
    }

    for (let link of document.querySelectorAll('nav a')) {
      console.log('Attaching listener');
      link.addEventListener('click', onClick);
    }
  }
}
