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
        :host {
          font-family: inherit;
          display:block;
          width: 100%;
          height: 60px;
        }

        .header {
          padding: 20px;
          margin: 0px 0px 10px 0px;
          background: #00897B;
        }

        .header-title {
          font-color: 24px;
          color: white;
          margin: 5px;
        }
      </style>

      <div class="header">
        <h1 class="header-title">Bosley Club</h1>
      </div>
    `;
  }
}
