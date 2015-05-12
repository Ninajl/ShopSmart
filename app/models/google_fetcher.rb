require 'semantics3'

class GoogleFetcher

  def initialize
    @request = Semantics3::Products.new(ENV['GOOGLE_API_KEY'], ENV['GOOGLE_API_SECRET'])
  end

  def google_search(product)
    @request.products_field('search', product)
    @productsHash = @request.get_products()
  end

end
