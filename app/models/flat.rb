class Flat < ApplicationRecord
    belongs_to :user
    has_many_attached :images

    geocoded_by :address
    after_validation :geocode

    enum category: { entire_place: 0, private_room: 1 }
end
