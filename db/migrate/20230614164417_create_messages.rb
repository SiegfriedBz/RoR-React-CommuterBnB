class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.string :content
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.references :transaction_request, null: false, foreign_key: true
      t.timestamps
    end
  end
end
