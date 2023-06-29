class Payment < ApplicationRecord
    belongs_to :transaction_request
    belongs_to :payer, class_name: 'User'
    belongs_to :payee, class_name: 'User'
  
    # validates :amount_in_cents, numericality: { greater_than_or_equal_to: 0 }
    # validates :status, inclusion: { in: %i[pending initiated completed failed] }

    scope :payer_or_payee_for_user, -> (user_id) { where("payer_id = :user_id OR payee_id = :user_id", user_id: user_id) }
  
    enum status: { pending: 0, initiated: 1, completed: 2, failed: 3 }
end
