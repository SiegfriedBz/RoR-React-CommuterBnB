class CreateFlats < ActiveRecord::Migration[7.0]
  def change
    create_table :flats do |t|
      t.references :user, foreign_key: true
      t.string :title
      t.text :description
      t.string :address
      t.float :longitude
      t.float :latitude
      t.integer :price_per_night_in_cents
      t.boolean :available, default: true
      t.integer :category, default: 0
      t.timestamps
    end
  end
end
