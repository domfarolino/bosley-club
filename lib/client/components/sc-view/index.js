export class SCView extends HTMLElement {
  constructor() {
    super(); // ALWAYS
    console.log('SCView constructor()');
  }

  get route() {
    return this.getAttribute('route') || null;
  }

  connectedCallback() {
    console.log('SCView connectedCallback()');
    this._view = null;
    this._isRemote = (this.getAttribute('remote') !== null);
  }

  _loadView(url) {
    if (this._view) return;

    console.log(`SCView _loadView() with ${url}`);
    const xhr = new XMLHttpRequest();

    xhr.onload = evt => {
      const asyncDoc = evt.target.response;
      const asyncView = asyncDoc.querySelector('sc-view.visible');

      console.log(asyncView);

      this._view = new DocumentFragment();

      Array.from(asyncView.children).forEach(node => {
        console.log(node);
        this._view.appendChild(node);
      });

      this.appendChild(this._view);
    };

    xhr.responseType = 'document';
    xhr.open('GET', url);
    xhr.send();
  }

  in(data) {
    if (this._isRemote && !this._view) {
      this._loadView(data[0]);
    }

    console.log('Calling in on', this, 'with', data);
    return new Promise((resolve, reject) => {
      const onTransitionEnd = () => {
        this.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };

      this.classList.add('visible');
      this.addEventListener('transitionend', onTransitionEnd);
    });
  }

  out(data) {
    console.log('Calling out on', this, 'with', data);
    return new Promise((resolve, reject) => {
      const onTransitionEnd = () => {
        this.removeEventListener('transitionend', onTransitionEnd);
        console.log('Resolving now');
        resolve();
      };

      this.classList.remove('visible');
      this.addEventListener('transitionend', onTransitionEnd);
    });
  }

  update(data) {
    console.log('Oddly enough, we\'re updating');
    return Promise.resolve();
  }

  disconnectedCallback() {

  }
}
