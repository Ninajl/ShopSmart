$(document).ready(function(){
  $('#results').hide();
  $('nav').hide();

  $('#home_search').on('click', function(e){
    $('.loading-gif').show();
    $('#myModal').show();
    // e.preventDefault();
  });

});
