class WelcomeController < ApplicationController

  def index
    
  end

  def amazon_query
      @amazon = AmazonFetcher.new
      @response = @amazon.amazon_search(params[:id])
      @amazon_products = @response['ItemSearchResponse']['Items']['Item']
      @sorted_amazon = @amazon_products.sort_by {|amount| amount['OfferSummary']['LowestNewPrice']['Amount'].to_i }

      render json: @sorted_amazon
  end

  def google_query
    @google = GoogleFetcher.new
    @google_response = @google.google_search(params[:id])
    @google_products = @google_response['results']
    @sorted_google = @google_products.sort_by {|price| price['price'].to_i}

    render json: @sorted_google
  end

end
