$(function(){
  searchEbay("boots");
});

function searchEbay(keyword){
  $('#ebay-loading').show();
  var slug = 'http://svcs.ebay.com/services/search/FindingService/v1';
  var appName = '?SECURITY-APPNAME=gSchoold0-5756-496d-acbc-afe9beb3e7e';
  var opName = '&OPERATION-NAME=findItemsByKeywords';
  var serviceVer = '&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON';
  //var callback = '&callback=_cb_findItemsByKeywords';
  var rest = '&REST-PAYLOAD';
  var keywords = '&keywords='+encodeURIComponent(keyword);
  var pagination = '&paginationInput.entriesPerPage=20';

  var url = slug+appName+opName+serviceVer+rest+keywords+pagination;
  console.log(url);
  $.ajax({
    url: url,
    method: "GET",
    dataType: 'jsonp'
  }).done(function(data){
    $('#ebay-loading').hide();
    var products = data.findItemsByKeywordsResponse[0].searchResult[0].item;

    $(products).each(function(){
      var product = $(this);
      var title = product[0].title;
      var buyItNow = product[0].listingInfo[0].buyItNowAvailable;
      console.log(buyItNow);
      if(buyItNow == "true" ) {
        $('#ebay').append('<p>'+title+'</p>');
        console.log(product);

      }
    });
    //console.log(data.findItemsByKeywordsResponse[0].searchResult[0].item);
  }).error(function(xhr, ajaxOptions, thrownError){
    console.log(xhr.status);
    console.log(thrownError);
  });
}



/*


http://svcs.ebay.com/services/search/FindingService/v1
?SECURITY-APPNAME=gSchoold0-5756-496d-acbc-afe9beb3e7e
&OPERATION-NAME=findItemsByKeywords
&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON
&callback=_cb_findItemsByKeywords
&REST-PAYLOAD
&keywords=brown+boots
&paginationInput.entriesPerPage=20




*/
