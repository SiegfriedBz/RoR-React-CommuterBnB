class CreatePayments < ActiveRecord::Migration[7.0]
  def change
    create_table :payments do |t|
      t.references :transaction_request, null: false, foreign_key: true
      t.references :payer, null: false, foreign_key: { to_table: :users }
      t.references :payee, null: false, foreign_key: { to_table: :users }
      t.integer :amount_in_cents, default: 0
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
