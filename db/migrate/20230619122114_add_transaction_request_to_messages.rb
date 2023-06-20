class AddTransactionRequestToMessages < ActiveRecord::Migration[7.0]
  def change
    add_reference :messages, :transaction_request, foreign_key: true
  end
end
