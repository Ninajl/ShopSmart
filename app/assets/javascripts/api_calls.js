$(function(){
  $('#home_search').on('click', function(e){
    e.preventDefault();
    var search_params = $('#search_field').val();
    getProducts.homeProducts(search_params);
  });
  $('#home_search2').on('click', function(e){
    e.preventDefault();
    var search_params = $('#search_field2').val();
    getProducts.resultsProducts(search_params);
  });
});

var getProducts = (function(){
  return {
    homeProducts: makeApiCallsFromHome,
    resultsProducts: makeApiCallsFromResults
  }

  function buildEbayURL(search_params){
    var slug = 'https://svcs.ebay.com/services/search/FindingService/v1';
    var appName = '?SECURITY-APPNAME=gSchoold0-5756-496d-acbc-afe9beb3e7e';
    var opName = '&OPERATION-NAME=findItemsByKeywords';
    var serviceVer = '&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON';
    var rest = '&REST-PAYLOAD';
    var keywords = '&keywords='+encodeURIComponent(search_params);
    var pagination = '&paginationInput.entriesPerPage=10000';

    var url = slug+appName+opName+serviceVer+rest+keywords+pagination;
    return url;
  }

  function makeApiCallsFromHome(search_params){
    $.when(
      $.getJSON('/welcome/amazon/'+ search_params),
      $.getJSON('/welcome/google/'+ search_params),
      $.ajax({
        url: buildEbayURL(search_params),
        method: "GET",
        dataType: 'jsonp'
      })
    ).done(function(amazon, google, ebay){
      transitionHide(search_params);
      buildAmazon(amazon);
      buildGoogle(google);
      buildEbay(ebay);
      styleLowestPrice();
    });
  }
  function makeApiCallsFromResults(search_params){
    transitionShow();
    $.when(
      $.getJSON('/welcome/amazon/'+ search_params),
      $.getJSON('/welcome/google/'+ search_params),
      $.ajax({
        url: buildEbayURL(search_params),
        method: "GET",
        dataType: 'jsonp'
      })
    ).done(function(amazon, google, ebay){
      transitionHide(search_params);
      buildAmazon(amazon);
      buildGoogle(google);
      buildEbay(ebay);
      styleLowestPrice();
    });
  }

  function buildAmazon(amazon){
    var amazon_products = amazon[0];
    $(amazon_products).each(function(){
      var amazon_product = $(this)[0];
      var amazon_title = amazon_product.ItemAttributes.Title;
      var amazon_id = '';
      amazon_id = amazon_product.ASIN;
      var amazon_url = amazon_product.DetailPageURL;
      var amazon_price = amazon_product.OfferSummary.LowestNewPrice.FormattedPrice;
      var amazon_image = amazon_product.LargeImage.URL;

      buildHTML("#amazon", amazon_id, amazon_url, amazon_image, amazon_title, amazon_price);
    });
  }

  function buildGoogle(google){
    var google_products = google[0];
    $(google_products).each(function(){
      var google_product = $(this)[0];
      var google_title = google_product.name;
      var google_price = '$'+ google_product.price;
      var google_id = '';
      google_id = google_product.sem3_id;
      var google_image = google_product.images;
      var google_url = google_product.sitedetails[0].url;

      buildHTML("#google", google_id, google_url, google_image, google_title, google_price);
    });
  }

  function buildEbay(ebay){
    var ebay_products = ebay[0].findItemsByKeywordsResponse[0].searchResult[0].item;

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
      }
    });

    var sortable = [];

    for (var product in ebayProductsObj)
    sortable.push([product, ebayProductsObj[product][0], ebayProductsObj[product][1], ebayProductsObj[product][2], ebayProductsObj[product][3]]);
    sortable.sort(function(a, b) {
      return a[1] - b[1]
    });

    $(sortable).each(function(){

      var ebay_product = $(this);
      var ebay_title = ebay_product[2];
      var ebay_buyItNow = ebay_product[1];
      var ebay_price = '$'+parseFloat(ebay_buyItNow).toFixed(2);
      var id = ebay_product[0];
      var ebayImage = ebay_product[3];
      var URL = ebay_product[4];
      ebay_products.push(ebay_product);

      buildHTML("#ebay", id, URL, ebayImage, ebay_title, ebay_price)
    });
  }

  function buildHTML(productHTMLID, product_id, product_url, product_image, product_title, product_price){
    $(productHTMLID).append('<p class="product-container" id="'+ product_id +'"><span class="price">' + product_price +  ' </span></p>');
    $(productHTMLID + ' p#' + product_id).append('<p><a href='+ product_url + '>' + product_title + '</a></p>');
    $(productHTMLID + ' p#' + product_id).append('<img src="' + product_image + '">' );
  }

  function transitionHide(search_params){
    $('.logo').show();
    $('#myModal').hide();
    $('.modal-backdrop').css("display", "none");
    $('.jumbotron').slideUp(1000);
    $('#results').fadeIn("slow");
    $('.brand-container').fadeIn(2000);
    $('#home').hide();
    $('.brand').append('<p class="search-bar"><span class="glyphicon glyphicon-search" data-toggle="modal" data-target="#myModal2"><span class="search-terms">'+search_params+'</span></span></p>');
  }

  function transitionShow(){
      $('#myModal2').hide();
      $('#myModal').show();
      $('#amazon').empty();
      $('#google').empty();
      $('#ebay').empty();
      $('.search-bar').empty();
  }

  function styleLowestPrice(){
    var amazon_price = $('#amazon .price')[0].innerHTML.replace("$", "");
    amazon_price = parseFloat(amazon_price);

    var google_price = $('#google .price')[0].innerHTML.replace("$", "");
    google_price = parseFloat(google_price);

    var ebay_price = $('#ebay .price')[0].innerHTML.replace("$", "");
    ebay_price = parseFloat(ebay_price);

    if((amazon_price < google_price) && (amazon_price < ebay_price)){
      $('#amazon .price').first().css("color", "green");
      $('#amazon p').first().css({"box-shadow": '0px 4px #d3d3d3, 0px 10px 55px rgba(0,0,0,1.0)', "border-radius": "64px",
      "border": "2px solid greenyellow"});
      $('#amazon img').first().css("border-bottom", "none");
    }
    if((google_price < amazon_price) && (google_price < ebay_price)){
      $('#google .price').first().css("color", "green");
      $('#google p').first().css({"box-shadow": '0px 4px #d3d3d3, 0px 10px 55px rgba(0,0,0,1.0)', "border-radius": "64px",
      "border": "2px solid greenyellow"});
      $('#google img').first().css("border-bottom", "none");
    }
    if((ebay_price < google_price) && (ebay_price < amazon_price)){
      $('#ebay .price').first().css("color", "green");
      $('#ebay p').first().css({"box-shadow": '0px 4px #d3d3d3, 0px 10px 55px rgba(0,0,0,1.0)', "border-radius": "64px",
      "border": "2px solid greenyellow"});
      $('#ebay img').first().css("border-bottom", "none");
    }
  }
})();
