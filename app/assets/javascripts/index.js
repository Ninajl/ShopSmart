$(document).ready(function(){
  $('#results_search').hide();
  $('#results').hide();

  $('#home_search').on('click', function(e){
    $('#home').hide();
    $('#results_search').show();
    $('#results').show();
  });

});
