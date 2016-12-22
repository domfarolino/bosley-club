export class View {
  constructor(element) {
    this._element = element; // the element this instance controls
    this._view = null;
    this._isLoading = false;
    this._isRemote = (this._element.getAttribute('remote') !== null);
  }

  get route() {
    return this._element.getAttribute('route') || null;
  }

  _hideSpinner() {
    console.log('SCView _hideSpinner()');
    this._element.classList.add('loaded');
    this._element.classList.remove('pending');
  }

  _showSpinner() {
    console.log('SCView _showSpinner()');
    this._element.classList.add('pending');
  }

  /**
   * This function can be used to load a class instance's
   * asynchronous view. To avoid double-loading a view, we
   * must ensure that the view is not loading and that the
   * remote data (this._view) associated with this instance
   * has not been loaded yet.
   */
  _loadView(url) {
    console.log(`SCView _loadView() with ${url}`);
    if (!this._isRemote || this._isLoading || this._view) {
      return;
    }

    const spinnerTimeout = setTimeout(this._showSpinner.bind(this), 500);

    const xhr = new XMLHttpRequest();

    xhr.onload = evt => {
      this._view = new DocumentFragment();
      const asyncDoc = evt.target.response;
      const asyncView = asyncDoc.querySelector('div[view].visible');

      Array.from(asyncView.children).forEach(node => {
        this._view.appendChild(node);
      });

      this._hideSpinner();
      this._element.appendChild(this._view);
      clearTimeout(spinnerTimeout);
    };

    xhr.responseType = 'document';
    xhr.open('GET', `${url}?partial`);
    xhr.send();
    this._isLoading = true;
  }

  /**
   * This function can be used to transition-in some instance
   * of this class. Before we trigger the actual transition we
   * check to see if the current view is remote, not in the middle
   * of loading an asynchronous
   */
  in(data) {
    if (this._isRemote && !this._isLoading && !this._view) {
      this._loadView(data[0]);
    }

    console.log('Calling in with', data);
    return new Promise((resolve, reject) => {
      const onTransitionEnd = () => {
        this._element.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };

      this._element.classList.add('visible');
      this._element.addEventListener('transitionend', onTransitionEnd);
    });
  }

  out(data) {
    console.log('Calling out with', data);
    return new Promise((resolve, reject) => {
      const onTransitionEnd = () => {
        this._element.removeEventListener('transitionend', onTransitionEnd);
        console.log(`Out with ${data} resolving now`);
        resolve();
      };

      this._element.classList.remove('visible');
      this._element.addEventListener('transitionend', onTransitionEnd);
    });
  }

  update(data) {
    console.log('Oddly enough, we\'re updating');
    return Promise.resolve();
  }
}
