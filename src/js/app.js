angular.module('stufreen', [])

.directive('smoothScroll', [function() {
  return {
    link: function($scope, $element, $attributes){
      var target = $attributes.href;
      $element.on('click', function(e){
        if(target.charAt(0) == '#'){
          console.log(target);
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
            console.log(newWorkFocus);
            oldWorkFocus.replaceWith(newWorkFocus);
          });

        // Don't follow the link (prevent default link behaviour)
        e.preventDefault();
      });
    }
  };
}]);