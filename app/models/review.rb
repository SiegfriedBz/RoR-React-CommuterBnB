class Review < ApplicationRecord
    belongs_to :reviewer, class_name: "User"
    belongs_to :transaction_request
    belongs_to :flat
    
    validates :rating, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }
    validates :content, presence: true
    validates :reviewer, presence: true
    validates :transaction_request, presence: true
    validates :flat, presence: true
end

