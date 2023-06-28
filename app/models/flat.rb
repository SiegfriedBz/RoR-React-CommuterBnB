class Flat < ApplicationRecord
    belongs_to :user
    has_many_attached :images
    has_many :favorites
    has_many :favorited_by, through: :favorites, source: :user

    geocoded_by :address_to_geocode
    after_validation :geocode

    enum category: { entire_place: 0, private_room: 1 }

    private

    def address_to_geocode
        [street, city, country].compact.join(', ')
    end
end
