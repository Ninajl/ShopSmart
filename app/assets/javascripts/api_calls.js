// $(function(){
//   $('#home_search').click(function(e){
//     e.preventDefault();
//     var search_params = $('#search_field').val();
// //AmazonAPI Call
//     $.ajax({
//       url: '/welcome/amazon/'+ search_params,
//       method: 'GET'
//     }).done(function(data){
//       var wtvr = (data[0]['ItemAttributes']['Title']);
//       $('#amazon').append('<p>'+wtvr+'</p>');
//   });
// //GoogleAPI Call
//   $.ajax({
//     url: '/welcome/google/'+ search_params,
//     method: 'GET'
//   }).done(function(data){
//     $('#google').append('<p>'+data[0]['name']+'</p>');
//   });


$(function(){
  $('#home_search').click(function(e){
    e.preventDefault();
    var search_params = $('#search_field').val();

    var slug = 'http://svcs.ebay.com/services/search/FindingService/v1';
    var appName = '?SECURITY-APPNAME=gSchoold0-5756-496d-acbc-afe9beb3e7e';
    var opName = '&OPERATION-NAME=findItemsByKeywords';
    var serviceVer = '&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON';
    var rest = '&REST-PAYLOAD';
    var keywords = '&keywords='+encodeURIComponent(search_params);
    var pagination = '&paginationInput.entriesPerPage=10000';

    var url = slug+appName+opName+serviceVer+rest+keywords+pagination;

    $.when(
      $.getJSON('/welcome/amazon/'+ search_params),
      $.getJSON('/welcome/google/'+ search_params),
      $.ajax({
          url: url,
          method: "GET",
          dataType: 'jsonp'
        })
    ).done(function(amazon, google, ebay){
      // AMAZON API APPEND
      var amazon_products = amazon[0];
      $(amazon_products).each(function(){
        var amazon_product = $(this)[0];
        var amazon_title = amazon_product.ItemAttributes.Title;
        var amazon_id = '';
        amazon_id = amazon_product.ASIN;
        var amazon_url = amazon_product.DetailPageURL;
        var amazon_price = amazon_product.OfferSummary.LowestNewPrice.FormattedPrice;
        var amazon_image = amazon_product.SmallImage.URL;

        $('#amazon').append('<p id="'+ amazon_id +'">' + '<a href='+ amazon_url + '>' + amazon_title + '</a>' +  ' </p>');
        $('#amazon p#' + amazon_id).append('<span>' + amazon_price +'</span>');
        $('#amazon p#' + amazon_id).prepend('<img src="' + amazon_image + '">' );
      });

      // GOOGLE API APPEND
      var google_products = google[0];
      $(google_products).each(function(){

        var google_product = $(this)[0];
        var google_title = google_product.name;
        var google_price = google_product.price;
        var google_id = '';
        google_id = google_product.sem3_id;
        var google_image = google_product.images;
        var google_url = google_product.sitedetails[0].url;
        $('#google').append('<p id="'+ google_id +'">' + '<a href='+ google_url + '>' + google_title + '</a>' +  ' </p>');
        $('#google p#' + google_id).append('<span>' + '$' + google_price +'</span>');
        $('#google p#' + google_id).prepend('<img src="' + google_image + '">' );
      });

      // EBAY API APPEND

      //var ebay_products = ebay.findItemsByKeywordsResponse[0].searchResult[0].item;
      var ebay_products = ebay[0].findItemsByKeywordsResponse[0].searchResult[0].item;

      console.log(ebay_products);
         $(ebay_products).each(function(){
           var ebay_product = $(this);
           var ebay_title = ebay_product[0].title;
           var ebay_buyItNow = ebay_product[0].listingInfo[0].buyItNowAvailable;
           if(ebay_buyItNow == "true" ) {
             var ebay_id = "";
             ebay_id = ebay_product[0].itemId;
             var buyItNowPrice = ebay_product[0].listingInfo[0].buyItNowPrice[0].__value__;
             var ebay_image = ebay_product[0].galleryURL[0];
             var ebay_url = ebay_product[0].viewItemURL[0];
             $('#ebay').append('<p id="'+ ebay_id +'">' + '<a href='+ ebay_url + '>' + ebay_title + '</a>' +  ' </p>');
             $('#ebay p#' + ebay_id).append('<span>'+ '$' + parseFloat(buyItNowPrice).toFixed(2) +'</span>');
             $('#ebay p#' + ebay_id).prepend('<img src="' + ebay_image + '">' );
          }
        });




      // console.log(amazon);
      console.log(google);
      console.log(ebay);
    });
  });
});




// function searchEbay(keyword){
//   $('#ebay-loading').show();
//   var slug = 'http://svcs.ebay.com/services/search/FindingService/v1';
//   var appName = '?SECURITY-APPNAME=gSchoold0-5756-496d-acbc-afe9beb3e7e';
//   var opName = '&OPERATION-NAME=findItemsByKeywords';
//   var serviceVer = '&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON';
//   var rest = '&REST-PAYLOAD';
//   var keywords = '&keywords='+encodeURIComponent(keyword);
//   var pagination = '&paginationInput.entriesPerPage=10000';
//
//   var url = slug+appName+opName+serviceVer+rest+keywords+pagination;
//   $.ajax({
//     url: url,
//     method: "GET",
//     dataType: 'jsonp'
//   });
//  }



// function searchEbay(keyword){
//   $('#ebay-loading').show();
//   var slug = 'http://svcs.ebay.com/services/search/FindingService/v1';
//   var appName = '?SECURITY-APPNAME=gSchoold0-5756-496d-acbc-afe9beb3e7e';
//   var opName = '&OPERATION-NAME=findItemsByKeywords';
//   var serviceVer = '&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON';
//   var rest = '&REST-PAYLOAD';
//   var keywords = '&keywords='+encodeURIComponent(keyword);
//   var pagination = '&paginationInput.entriesPerPage=10000';
//
//   var url = slug+appName+opName+serviceVer+rest+keywords+pagination;
//   $.ajax({
//     url: url,
//     method: "GET",
//     dataType: 'jsonp'
 //  }).done(function(data){
 //    $('#ebay-loading').hide();
 //    var products = data.findItemsByKeywordsResponse[0].searchResult[0].item;
 //
 //    $(products).each(function(){
 //      var product = $(this);
 //      var title = product[0].title;
 //      var buyItNow = product[0].listingInfo[0].buyItNowAvailable;
 //      if(buyItNow == "true" ) {
 //        var emptyString = "";
 //        emptyString = product[0].itemId;
 //        var buyItNowPrice = product[0].listingInfo[0].buyItNowPrice[0].__value__;
 //        var productImage = product[0].galleryURL[0];
 //        var productUrl = product[0].viewItemURL[0];
 //        $('#ebay').append('<p id="'+ emptyString +'">' + '<a href='+ productUrl + '>' + title + '</a>' +  ' </p>');
 //        $('#ebay p#' + emptyString).append('<span>'+ '$' + parseFloat(buyItNowPrice).toFixed(2) +'</span>');
 //        $('#ebay p#' + emptyString).prepend('<img src="' + productImage + '">' );
 //     }
 //   });
 // });
 // }
