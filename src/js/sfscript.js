$(document).ready(function(){
    
    //Function for menu links to smooth scroll to the desired anchor
    $('div.menu a').click(function(){
        var target = $(this).attr('href');
        target = target.substr(1);
        var $aTag = $("a[name='" + target + "']");
        var menuHeight = $('div.menu').height();
        
        $('html, body').animate({scrollTop: $aTag.offset().top /*- menuHeight*/}, 1000, "easeInOutQuad");
        return false;
    });
    
    // "More work" link in small layouts
    function registerMoreWorkListener( jqEl ){
        jqEl.click(function(){
            var path = $(this).attr('href');
            
            // Go fetch the target page
            $.get( path, function( data ) {

                // Append the work focus from that page
                var newWorkFocus = $(data).find('.work-focus');
                jqEl.before(newWorkFocus);

                // Replace the more work link
                var newMoreWorkLink = $(data).find('a.show-more');
                $('a.show-more').replaceWith(newMoreWorkLink);

                registerMoreWorkListener( $('a.show-more') );
            });
            
            // Don't follow the link (prevent default link behaviour)
            return false;
        });
    }
    registerMoreWorkListener( $('a.show-more') );

    // Replaces the highlighted work when a thumbnail is clicked
    $('a.nav-work').click(function(e){
        var path = $(this).attr('href');

        // Go fetch the target page, and replace our work-focus with that one
        $.get( path, function( data ) {
          var newWorkFocus = $(data).find('.work-focus');
          $('.work-focus').replaceWith(newWorkFocus);
        });

        // Don't follow the link (prevent default link behaviour)
        return false;
    }); 
    
    // Swiper for work section
    var swiper0 = new Swiper('.s0.swiper-container', {
        scrollbar: '.swiper-scrollbar',
        direction: 'vertical',
        slidesPerView: 4,
        paginationClickable: true,
        spaceBetween: 0,
        mousewheelControl: true,
        freeMode: true
    });

    //Creates scrollReveal instance
    var srconfig = {
        mobile: true
    }
    window.sr = new scrollReveal(srconfig);

    // Handle form submission
    $('#contact-form').submit(function(e){
        // Don't submit form
        e.preventDefault();
        var isError = false;

        // Validate name
        var nameVal = $('#name input').val();
        if(nameVal == '' || typeof nameVal === 'undefined'){
            $('#name').addClass('error');
            isError = true;
        }
        else{
            $('#name').removeClass('error');
        }

        // Validate email
        var emailVal = $('#email input').val();
        if( validateEmail(emailVal) == false || typeof emailVal === 'undefined'){
            $('#email').addClass('error');
            isError = true;
        }
        else{
            $('#email').removeClass('error');
        }

        // Validate description
        var descriptionVal = $('#description textarea').val();
        if(descriptionVal == '' || typeof descriptionVal === 'undefined'){
            $('#description').addClass('error');
            isError = true;
        }
        else{
            $('#description').removeClass('error');
        }

        // If everything is ok, submit the form via ajax
        if( !isError )
        {
            $.post( "sendmail.php", { name: nameVal, email: emailVal, description: descriptionVal } )
                .done(function( data ) {
                    $('div.success-overlay').css('display', 'block');
                    $('div.success-message').css('display', 'block');
                    $('div.success-overlay').delay(6000).fadeOut(2000);
                    $('div.success-message').delay(6000).fadeOut(2000);
                });
        }
    });

    //hide overlay if you click the black part or the okay link
    $('div.success-overlay').click(function(){
        $('div.success-overlay').stop(true);//stop automatic fade out
        $('div.success-message').stop(true);
        $('div.success-overlay').fadeOut('fast');
        $('div.success-message').fadeOut('fast');
    })
    
    $('div.success-message a').click(function(){
        $('div.success-overlay').stop(true);
        $('div.success-message').stop(true);
        $('div.success-overlay').fadeOut('fast');
        $('div.success-message').fadeOut('fast');
        return false;
    })
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}