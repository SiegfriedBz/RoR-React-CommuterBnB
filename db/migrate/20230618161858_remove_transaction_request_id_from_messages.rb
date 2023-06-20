class RemoveTransactionRequestIdFromMessages < ActiveRecord::Migration[7.0]
  def change
    remove_column :messages, :transaction_request_id, :bigint, null: false
  end
end
