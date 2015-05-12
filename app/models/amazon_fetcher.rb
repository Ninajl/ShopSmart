class AmazonFetcher

  def initialize
    @request = Vacuum.new

    @request.configure(
      aws_access_key_id: ENV['AMAZON_ACCESS_KEY_ID'],
      aws_secret_access_key: ENV['AMAZON_SECRET_ACCESS_KEY'],
      associate_tag: 'shopsmart0cd-20'
    )
  end

  def amazon_search
    @response = @request.item_search(
    query: {
      'Keywords' => 'Boots',
      'SearchIndex' => 'All',
      'MerchantID' => 'Amazon',
      'ResponseGroup' => 'Offers, ItemAttributes, Images',
      'Availability' => 'Available'
    }
    )

    @response.to_h

  end



end
