class WelcomeController < ApplicationController

  def index
  end

  def amazon_query
      @amazon = AmazonFetcher.new
      @response = @amazon.amazon_search(params[:id])
      @amazon_products = @response['ItemSearchResponse']['Items']['Item']

      render json: @amazon_products
  end

  def google_query
    @google = GoogleFetcher.new
    @google_response = @google.google_search(params[:id])
    @google_products = @google_response['results']

    render json: @google_products
  end

end
