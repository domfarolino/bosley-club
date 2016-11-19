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
  }

  in(data) {
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
