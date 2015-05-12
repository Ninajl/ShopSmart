class GoogleFetcherController < ApplicationController

  def index
    @google = GoogleFetcher.new
    @google_response = @google.google_search
    @google_products = @google_response['results']

  end



end
