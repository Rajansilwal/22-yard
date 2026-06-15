if (!customElements.get('product-modal')) {
  customElements.define(
    'product-modal',
    class ProductModal extends ModalDialog {
      constructor() {
        super();
        
        // Keyboard navigation for slider
        this.addEventListener('keyup', (event) => {
          if (event.code === 'ArrowLeft') {
            const prevButton = this.querySelector('button[name="previous"]');
            if (prevButton && !prevButton.hasAttribute('disabled')) prevButton.click();
          } else if (event.code === 'ArrowRight') {
            const nextButton = this.querySelector('button[name="next"]');
            if (nextButton && !nextButton.hasAttribute('disabled')) nextButton.click();
          }
        });
      }

      hide() {
        super.hide();
      }

      show(opener) {
        super.show(opener);
        this.showActiveMedia();
        this.bindSliderEvents();
      }

      showActiveMedia() {
        this.querySelectorAll(
          `[data-media-id]:not([data-media-id="${this.openedBy.getAttribute('data-media-id')}"])`
        ).forEach((element) => {
          element.classList.remove('active');
        });
        const activeMedia = this.querySelector(`[data-media-id="${this.openedBy.getAttribute('data-media-id')}"]`);
        const activeMediaTemplate = activeMedia.querySelector('template');
        const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null;
        activeMedia.classList.add('active');
        
        const sliderComponent = this.querySelector('slider-component');
        if (sliderComponent && sliderComponent.slider) {
          const activeSlide = activeMedia.closest('.product-media-modal__item');
          if (activeSlide) {
            const paddingLeft = parseFloat(window.getComputedStyle(sliderComponent.slider).paddingLeft) || 0;
            sliderComponent.slider.scrollTo({ left: activeSlide.offsetLeft - paddingLeft });
          }
        } else {
          activeMedia.scrollIntoView();
        }

        const container = this.querySelector('[role="document"]');
        container.scrollLeft = (activeMedia.width - container.clientWidth) / 2;

        if (
          activeMedia.nodeName == 'DEFERRED-MEDIA' &&
          activeMediaContent &&
          activeMediaContent.querySelector('.js-youtube')
        )
          activeMedia.loadContent();
      }

      bindSliderEvents() {
        const sliderComponent = this.querySelector('slider-component');
        if (!sliderComponent || sliderComponent.dataset.eventsBound) return;
        sliderComponent.dataset.eventsBound = 'true';
        
        sliderComponent.addEventListener('slideChanged', (event) => {
          const currentSlide = event.detail.currentElement;
          if (!currentSlide) return;
          
          this.querySelectorAll('[data-media-id]').forEach((element) => {
            element.classList.remove('active');
          });
          
          const activeMedia = currentSlide.querySelector('[data-media-id]') || currentSlide;
          activeMedia.classList.add('active');
          
          const deferredMedia = activeMedia.querySelector('deferred-media') || (activeMedia.tagName === 'DEFERRED-MEDIA' ? activeMedia : null);
          if (deferredMedia) {
            window.pauseAllMedia();
            deferredMedia.loadContent(false);
          } else {
            window.pauseAllMedia();
          }
        });
      }
    }
  );
}
