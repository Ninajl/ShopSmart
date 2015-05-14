
$(function(){
  $('#home_search').click(function(e){
    e.preventDefault();
    var search_params = $('#search_field').val();
    console.log(search_params);

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
      $('#myModal').hide();
      $('.modal-backdrop').css("display", "none");
      $('.jumbotron').slideUp(1000);
      $('.brand-container').fadeIn("slow");
      $('#results').fadeIn("slow");
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
        $('#amazon p#' + amazon_id).append('<p class="price">' + amazon_price +'</p>');
        $('#amazon p#' + amazon_id).append('<img src="' + amazon_image + '">' );
        $('#amazon p:not(:nth-child(2))').hide();

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
        $('#google p#' + google_id).append('<p class="price">' + '$' + google_price +'</p>');
        $('#google p#' + google_id).append('<img src="' + google_image + '">' );
        $('#google p:not(:nth-child(2))').hide();
        // p:nth-child(2)
      });

      // EBAY API APPEND
     var ebay_products = ebay[0].findItemsByKeywordsResponse[0].searchResult[0].item;

     console.log(ebay_products);
     var ebayProductsObj = {};
        $(ebay_products).each(function(){
          var ebay_product = $(this);

          var ebay_buyItNow = ebay_product[0].listingInfo[0].buyItNowAvailable;

          if(ebay_buyItNow == "true" ) {

            var ebay_id = "";
            var ebay_title = ebay_product[0].title[0];
            var buyItNowPrice = ebay_product[0].listingInfo[0].buyItNowPrice[0].__value__;
            var ebay_image = ebay_product[0].galleryURL[0];
            var ebay_url = ebay_product[0].viewItemURL[0];

            ebay_id = ebay_product[0].itemId;
            ebayProductsObj[ebay_id] = [buyItNowPrice, ebay_title, ebay_image, ebay_url];
           //  $('#ebay').append('<p id="'+ ebay_id +'">' + '<a href='+ ebay_url + '>' + ebay_title + '</a>' +  ' </p>');
           //  $('#ebay p#' + ebay_id).append('<p class="price">'+ '$' + parseFloat(buyItNowPrice).toFixed(2) +'</p>');
           //  $('#ebay p#' + ebay_id).append('<img src="' + ebay_image + '">' );
           $('#ebay p:not(:nth-child(2))').hide();

         }
         console.log(ebayProductsObj);
       });

      // var all_ebay_products = ebay[0].findItemsByKeywordsResponse[0].searchResult[0].item;
      // var ebay_products = [];
      // var sorted_prices = [];
      //
      //    $(all_ebay_products).each(function(){
      //      var ebay_product = $(this);
      //      var ebay_title = ebay_product[0].title;
      //      var ebay_buyItNow = ebay_product[0].listingInfo[0].buyItNowAvailable;
      //     // var test = price_sort.sort(function(a, b){return a-b});
      //      if(ebay_buyItNow == "true") {
      //        ebay_products.push(ebay_product);
      //     }
      //   })
      //
      //   $(ebay_products).each(function(){
      //     var ebay_product = $(this);
      //     var buyItNowPrice = ebay_product[0].listingInfo[0].buyItNowPrice[0].__value__;
      //
      //
      //   })


        //    var ebay_id = "";
        //    ebay_id = ebay_product[0].itemId;
        //    var buyItNowPrice = ebay_product[0].listingInfo[0].buyItNowPrice[0].__value__;
        //    var prices = ebay_product.buyItNowPrice;
        //
        //   //  price_array.push(buyItNowPrice);
        //   //  price_array.sort(function(a, b){return a-b});
        //    var ebay_image = ebay_product[0].galleryURL[0];
        //    var ebay_url = ebay_product[0].viewItemURL[0];
        //    $('#ebay').append('<p id="'+ ebay_id +'">' + '<a href='+ ebay_url + '>' + ebay_title + '</a>' +  ' </p>');
        //    //   $('#ebay p#' + ebay_id).append('<span>'+ '$' + parseFloat(buyItNowPrice).toFixed(2) +'</span>');
        //    $('#ebay p#' + ebay_id).prepend('<img src="' + ebay_image + '">' );

        // $(price_array).each(function(){
        //   var ebay_id = "";
        //   ebay_id = ebay_product[0].itemId;
        // })
  //
    });
  });
});
