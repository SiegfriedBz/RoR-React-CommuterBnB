class AddTransactionRequestInReviews < ActiveRecord::Migration[7.0]
  def change
    add_reference :reviews, :transaction_request, null: false, foreign_key: true
  end
end