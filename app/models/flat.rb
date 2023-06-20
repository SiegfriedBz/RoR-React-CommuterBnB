class Flat < ApplicationRecord
    belongs_to :user
    has_many_attached :images

    geocoded_by :address_to_geocode
    after_validation :geocode

    enum category: { entire_place: 0, private_room: 1 }

    def address_to_geocode
        [street, city, country].compact.join(', ')
    end
end
