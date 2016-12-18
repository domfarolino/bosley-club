export class SCView extends HTMLElement {
  constructor() {
    super();
  }

  get route() {
    return this.getAttribute('route') || null;
  }

  connectedCallback() {
    console.log('SCView connectedCallback()');
    this._view = null;
    this._isRemote = (this.getAttribute('remote') !== null);
  }

  _hideSpinner() {
    console.log('SCView _hideSpinner()');
    this.classList.add('loaded');
    this.classList.remove('pending');
  }

  _showSpinner() {
    console.log('SCView _showSpinner()');
    this.classList.add('pending');
  }

  _loadView(url) {
    console.log(`SCView _loadView() with ${url}`);

    const spinnerTimeout = setTimeout(this._showSpinner.bind(this), 500);

    const xhr = new XMLHttpRequest();

    xhr.onload = evt => {
      this._view = new DocumentFragment();
      const asyncDoc = evt.target.response;
      const asyncView = asyncDoc.querySelector('sc-view.visible');

      Array.from(asyncView.children).forEach(node => {
        this._view.appendChild(node);
      });

      this._hideSpinner();
      this.appendChild(this._view);
      clearTimeout(spinnerTimeout);
    };

    xhr.responseType = 'document';
    xhr.open('GET', `${url}?partial`);
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
        console.log(`Out with ${data} resolving now`);
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
