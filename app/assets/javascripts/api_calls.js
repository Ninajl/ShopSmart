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
  var pagination = '&paginationInput.entriesPerPage=40';

  var url = slug+appName+opName+serviceVer+rest+keywords+pagination;
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
      if(buyItNow == "true" ) {
        var emptyString = "";
        emptyString = product[0].itemId;
        var buyItNowPrice = product[0].listingInfo[0].buyItNowPrice[0].__value__;
        var productImage = product[0].galleryURL[0];
        $('#ebay').append('<p id="'+ emptyString +'">'+title+' </p>');
        $('#ebay p#' + emptyString).append('<span>'+ '$' + buyItNowPrice+'</span>');
        $('#ebay p#' + emptyString).prepend('<img src="' + productImage + '">' );
        console.log("product: ");
        console.log(product);
        // console.log("buyItNow: ");
        // console.log(buyItNowPrice);

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
