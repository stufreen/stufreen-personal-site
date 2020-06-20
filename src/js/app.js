const loadMoreButton = document.getElementById('load-more-button');
const projectPanels = document.getElementsByClassName('work-focus-item');
const loadProjectButtons = document.getElementsByClassName('load-project-link');
const contactForm = document.getElementById('contact-form');
const successOverlay = document.getElementById('success-overlay');
const successMessage = document.getElementById('success-message');
const successMessageCloser = document.getElementById('success-message-closer');
const scrollRevealEls = document.getElementsByClassName('scroll-reveal');

const handleLoadProject = (el) => {
  el.addEventListener('click', () => {
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
  e.preventDefault();

  const formData = new FormData(contactForm);

  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  fetch('https://t7o3lghlab.execute-api.us-east-1.amazonaws.com/prod/contact', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(formObject),
  })
    .then(() => {
      successMessage.classList.add('show');
      successOverlay.classList.add('show');
      contactForm.reset();
    })
    .catch(console.error);
};

function revealElement(el) {
  const delay = parseInt(el.dataset.srDelay) || 0;
  setTimeout(() => {
    el.classList.add('show');
  }, delay);
}

function initializeSwiper(idName) {
  const swiperElement = document.getElementById(idName);
  new Swiper(swiperElement, {
    scrollbar: '.swiper-scrollbar',
    direction: 'vertical',
    slidesPerView: 4,
    paginationClickable: true,
    spaceBetween: 0,
    mousewheelControl: true,
    freeMode: true,
  });
}

function scrollToElement(target) {
  // Get the current scroll position
  const startScrollY = window.scrollY;
  // Calculate the scroll position at the end of the page
  const endScrollY = Math.min(
    target.offsetTop - 20,
    document.body.scrollHeight - window.innerHeight
  );
  // Calculate the total distance to scroll
  const distance = endScrollY - startScrollY;

  animol.ease(
    (progress) => {
      const scrollY = startScrollY + progress * distance;
      console.log(scrollY);
      window.scrollTo(0, scrollY);
    },
    1000,
    animol.Easing.easeInOutCubic
  );
}

function initializeSmoothScroll() {
  const smoothScrollLinks = document.getElementsByClassName('smooth-scroll');
  Array.prototype.forEach.call(smoothScrollLinks, (el) => {
    const target = el.getAttribute('href');
    el.addEventListener('click', (e) => {
      if (target.charAt(0) === '#') {
        e.preventDefault();
        const targetId = target.substring(1);
        const targetEl = document.getElementById(targetId);
        scrollToElement(targetEl);
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
  loadMoreButton.addEventListener('click', () => {
    visibleIndex++;
    sortedPanels[visibleIndex].classList.add('mobile-show');
    if (visibleIndex === sortedPanels.length - 1) {
      loadMoreButton.classList.add('hide');
    }
  });
}

function initializeScrollReveal() {
  const options = {
    threshold: 0.4,
    rootMargin: '0px',
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
      }
    });
  }, options);
  Array.prototype.forEach.call(scrollRevealEls, (el) => {
    observer.observe(el);
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
