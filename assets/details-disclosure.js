class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.setupHover();
  }

  // 22 Yard: open the mega/dropdown on hover as well as on click.
  // Only on devices that actually hover (desktop with a fine pointer) — touch
  // devices keep the native click-to-toggle behaviour.
  setupHover() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    this.addEventListener('mouseenter', this.open.bind(this));
    this.addEventListener('mouseleave', this.close.bind(this));

    // While hover controls open/close, stop summary clicks from toggling the
    // panel shut underneath the cursor so hover and click behave the same.
    const summary = this.mainDetailsToggle.querySelector('summary');
    if (summary) {
      summary.addEventListener('click', (event) => {
        if (this.mainDetailsToggle.open) event.preventDefault();
      });
    }
  }

  open() {
    if (this.mainDetailsToggle.open) return;
    this.mainDetailsToggle.setAttribute('open', '');
    const summary = this.mainDetailsToggle.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', true);
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
