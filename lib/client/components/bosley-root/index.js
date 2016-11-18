export class BosleyRoot extends HTMLElement {
  constructor() {
    super(); // ALWAYS
    console.log('constructor()');
  }

  connectedCallback() {
    console.log('connectedCallback()');
    const shadow = this.attachShadow({mode: 'open'});

    shadow.innerHTML = `
      <h2>
        Raspberry Pi 3 <b>external</b> website
      </h2>
      <p>
        We got some good stuff going on here.
      </p>
      <p><a href="https://domfarolino.com">Dom Farolino</a>
        <b>#iot #bosley #pi</b>
      </p>
    `;
  }
}
