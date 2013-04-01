// ON DOM READY - Bind pjax on links and fire domready method.
$(function(){
  $(document).pjax('a', '#main');
  MYSITE.domReady();
});

// ON PJAX READY - fire dom ready so stuff is bound right
$(document).on("pjax:end", function(){
  MYSITE.domReady();
});

// MYSITE Namespace: Change this to match your site (or don't, whatever.)
var MYSITE = {
  domReady : function(){ // Keep DOM Ready stuff here so we can trigger it from DOM ready or PJAX complete
    Mousetrap.bind('right', function() { $('#next').trigger('click'); });
    Mousetrap.bind('left', function() { $('#previous').trigger('click'); });
  }
}

