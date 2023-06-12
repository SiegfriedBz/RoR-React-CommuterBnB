class Flat < ApplicationRecord
    belongs_to :user

    enum category: { entire_place: 0, private_room: 1 }
end
