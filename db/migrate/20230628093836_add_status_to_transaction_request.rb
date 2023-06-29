class AddStatusToTransactionRequest < ActiveRecord::Migration[7.0]
  def change
    add_column :transaction_requests, :status, :integer, default: 0
  end
end
