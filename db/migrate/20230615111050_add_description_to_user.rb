class AddDescriptionToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :description, :text, default: ""
  end
end
