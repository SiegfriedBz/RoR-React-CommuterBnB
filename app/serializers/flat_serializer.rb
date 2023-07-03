class FlatSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attribute :flat_id, &:id

  attributes :title, :description, :street, :city, :country, :longitude, :latitude, :price_per_night_in_cents, :available, :category

  attribute :owner do |flat|
    UserSerializer.new(flat.user).serializable_hash[:data][:attributes]
  end

  attribute :future_booked_dates do |flat|
    flat.future_booked_dates_for_flat
  end

  attribute :reviews do |flat|
    flat.flat_reviews
      .order(updated_at: :desc)
      .map do |review| 
      ReviewSerializer.new(review).serializable_hash[:data][:attributes]
    end
  end

  attribute :average_rating do |flat|
    rating_sum = flat.flat_reviews.map do |review| 
      review.rating
    end.sum
    
    if rating_sum > 0
      rating_sum / flat.flat_reviews.count
    else
      5
    end
  end

  attribute :images do |flat|
    flat.images.present? ? flat.images.map { |image| image.blob.url } : []
  end
end
