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
  const loadProjectButtons = document.getElementsByClassName('load-project-link');
  const projectPanels = document.getElementsByClassName('work-focus-item');

  Array.prototype.forEach.call(loadProjectButtons, (el) => {
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
  });
}

function initializeLoadMoreButton() {
  // Mobile load more button
  const loadMoreButton = document.getElementById('load-more-button');
  const projectPanels = document.getElementsByClassName('work-focus-item');
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

(function () {
  initializeSwiper('work-swiper');
  initializeSmoothScroll();
  initializeScrollReveal();
  initializeLoadProjectButtons();
  initializeLoadMoreButton();
})();


/////
////
//
//
//
///

angular.module('stufreen', [])

.controller('ContactController', ['$scope', '$http', function($scope, $http){

  $scope.responses = {};
  $scope.successOverlayOpen = false;

  $scope.submitContactForm = function(valid){
    if(valid){
      $scope.contactFormSubmitting = true;
      $http({
        method : "POST",
        url : 'sendmail.php',
        data : {
          name: $scope.responses.name, 
          email: $scope.responses.email, 
          description: $scope.responses.description
        }
      }).then(function mySuccess(response) {
        if(response.data == 'true'){
          $scope.contactFormSubmitting = false;
          $scope.responses = {};
          $scope.contact_form.$setPristine();
          $scope.successOverlayOpen = true;
        }
        else{
          $scope.contactFormSubmitting = false;
          console.log(response.data);
        }
      }, function myError(response) {
        $scope.contactFormSubmitting = false;
        console.log(response.data);
      });
    }
  };

}]);