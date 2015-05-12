class WelcomeController < ApplicationController

  def index
    @amazon = AmazonFetcher.new
    @response = @amazon.amazon_search('lobster')
    @products = @response['ItemSearchResponse']['Items']['Item']

    @google = GoogleFetcher.new
    @google_response = @google.google_search('lobster')
    @google_products = @google_response['results']
  end

end
