require 'semantics3'

class GoogleFetcher

  def initialize
    @request = Semantics3::Products.new(ENV['GOOGLE_API_KEY'], ENV['GOOGLE_API_SECRET'])
  end

  def google_search(search_word)
    @request.products_field('search', search_word)
    @productsHash = @request.get_products
  end

end
