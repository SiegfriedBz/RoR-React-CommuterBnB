class Payment < ApplicationRecord
    belongs_to :transaction_request
    belongs_to :payer, class_name: 'User'
    belongs_to :payee, class_name: 'User'
  
    validates :amount_in_cents, numericality: { greater_than: 0 }
    validates :status, inclusion: { in: [0, 1, 2, 3, 4] } 
  
    enum status: { pending: 0, initiated: 1, completed: 2, failed: 3, cancelled: 4 }
end
