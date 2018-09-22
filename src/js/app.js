const loadMoreButton = document.getElementById('load-more-button');
const projectPanels = document.getElementsByClassName('work-focus-item');
const loadProjectButtons = document.getElementsByClassName('load-project-link');
const contactForm = document.getElementById('contact-form');
const successOverlay = document.getElementById('success-overlay');
const successMessage = document.getElementById('success-message');
const successMessageCloser = document.getElementById('success-message-closer');

const handleLoadProject = (el) => {
  el.addEventListener('click', (e) => {
    // Hide all of the project panels that don't match the project key
    Array.prototype.forEach.call(projectPanels, (projectPanel) => {
      if (projectPanel.dataset.projectKey === el.dataset.projectKey) {
        projectPanel.classList.add('desktop-show');
      } else {
        projectPanel.classList.remove('desktop-show');
      }
    });
  });
};

const handleFormSubmit = (e) => {
  console.log(e);
  e.preventDefault();

  const formData = new FormData(contactForm);

  fetch('https://mailthis.to/stufreen@gmail.com', {
    method: "POST",
    mode: "cors",
    body: formData,
  }).then((res) => {
    console.log(res);
    successMessage.classList.add('show');
    successOverlay.classList.add('show');
    contactForm.reset();
  });
};

function initializeSwiper(idName) {
  const swiperElement = document.getElementById(idName);
  new Swiper(swiperElement, {
    scrollbar: '.swiper-scrollbar',
    direction: 'vertical',
    slidesPerView: 4,
    paginationClickable: true,
    spaceBetween: 0,
    mousewheelControl: true,
    freeMode: true
  });
}

function initializeSmoothScroll() {
  const smoothScrollLinks = document.getElementsByClassName('smooth-scroll');
  Array.prototype.forEach.call(smoothScrollLinks, (el) => {
    const target = el.getAttribute('href');
    el.addEventListener('click', (e) => {
      if (target.charAt(0) === '#') {
        e.preventDefault();
        TweenLite.to(
          window,
          1.2, 
          { scrollTo: { y: target, offsetY: 30 }, ease: Power2.easeInOut }
        );
      }
    });
  });
}

function initializeLoadProjectButtons() {
  Array.prototype.forEach.call(loadProjectButtons, handleLoadProject);
}

function initializeLoadMoreButton() {
  const sortedPanels = Array.from(projectPanels).sort();
  let visibleIndex = 0;
  loadMoreButton.addEventListener('click', (e) => {
    visibleIndex++;
    sortedPanels[visibleIndex].classList.add('mobile-show');
    if (visibleIndex === sortedPanels.length - 1) {
      loadMoreButton.classList.add('hide');
    }
  });
}

function initializeScrollReveal() {
  window.sr = new scrollReveal({
    mobile: true
  });
}

function initializeContactForm() {
  contactForm.addEventListener('submit', handleFormSubmit);
  successMessageCloser.addEventListener('click', () => {
    successMessage.classList.remove('show');
    successOverlay.classList.remove('show');
  });
}

(function () {
  initializeSwiper('work-swiper');
  initializeSmoothScroll();
  initializeScrollReveal();
  initializeLoadProjectButtons();
  initializeLoadMoreButton();
  initializeContactForm();
})();
