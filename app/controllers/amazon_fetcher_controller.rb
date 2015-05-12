class AmazonFetcherController < ApplicationController

  def index
    @amazon = AmazonFetcher.new
    @response = @amazon.amazon_search
    @products = @response['ItemSearchResponse']['Items']['Item']
  end

end
