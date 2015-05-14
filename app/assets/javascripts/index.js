$(document).ready(function(){
  $('#results').hide();
  $('nav').hide();

  $('#home_search').on('click', function(e){
    $('.loading-gif').show();
    $('#myModal').show();
    $('#amazon').empty();
    $('#google').empty();
    $('#ebay').empty();

      e.preventDefault();
  });

});
