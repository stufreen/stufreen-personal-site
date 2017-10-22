angular.module('stufreen', [])

.directive('smoothScroll', [function() {
  return {
    link: function($scope, $element, $attributes){
      var target = $attributes.href;
      $element.on('click', function(e){
        if(target.charAt(0) == '#'){
          e.preventDefault();
          TweenLite.to(window, 1.2, {scrollTo:{y:target, offsetY:30}, ease: Power2.easeInOut});
        }
      });
    }
  };
}])

.directive('loadProject', ['$http', function($http) {
  return {
    link: function($scope, $element, $attributes){
      var target = $attributes.href;
      $element.on('click', function(e){
        var path = $attributes.href;

        // Go fetch the target page, and replace our work-focus with that one
        $http.get(path)
          .then(function( response ) {
            var oldWorkFocus = document.getElementById('work-focus');
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.data, 'text/html');
            var newWorkFocus = doc.getElementById('work-focus');
            oldWorkFocus.replaceWith(newWorkFocus);
          });

        // Don't follow the link (prevent default link behaviour)
        e.preventDefault();
      });
    }
  };
}])

.directive('loadMoreWork', ['$http', '$compile', function($http, $compile) {
  return {
    link: function($scope, $element, $attributes){
      var target = $attributes.href;
      var container = $element.parent();
      $element.on('click', function(e){
        var path = $attributes.href;

        // Go fetch the target page
        $http.get(path)
          .then(function( response ) {
            // Parse the response
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.data, 'text/html');

            // Prepend the work focus from that page
            var newWorkFocus = doc.getElementById('work-focus');
            container.append(newWorkFocus);

            // Replace more work with the more-work from that page
            $element.remove();
            var newShowMore = doc.getElementById('show-more');
            if( newShowMore !== null){
              container.append(newShowMore);
              $compile(newShowMore)($scope);
            }
          });

        // Don't follow the link (prevent default link behaviour)
        e.preventDefault();
      });
    }
  };
}])

.directive('initializeSwiper', [function() {
  return {
    link: function($scope, $element, $attributes){
      var swiper0 = new Swiper($element[0], {
        scrollbar: '.swiper-scrollbar',
        direction: 'vertical',
        slidesPerView: 4,
        paginationClickable: true,
        spaceBetween: 0,
        mousewheelControl: true,
        freeMode: true
      });
    }
  };
}])

.directive('initializeScrollReveal', [function() {
  return {
    link: function($scope, $element, $attributes){
      //Creates scrollReveal instance
      var srconfig = {
          mobile: true
      };
      window.sr = new scrollReveal(srconfig);
    }
  };
}])

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