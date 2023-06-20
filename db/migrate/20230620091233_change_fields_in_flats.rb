class ChangeFieldsInFlats < ActiveRecord::Migration[7.0]
  def change
    remove_column :flats, :address, :string
    add_column :flats, :street, :string
    add_column :flats, :city, :string, null: false
    add_column :flats, :country, :string, null: false
    change_column :flats, :price_per_night_in_cents, :integer, null: false
    change_column :flats, :title, :string, null: false
    change_column :flats, :description, :text, null: false
  end
end
