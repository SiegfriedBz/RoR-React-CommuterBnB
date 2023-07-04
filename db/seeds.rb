# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

filenames = {
  greece_a: ['greece_a01.jpg', 'greece_a02.jpg', 'greece_a03.jpg', 'greece_a04.jpg', 'greece_a05.jpg'],
  greece_b: ['greece_b01.jpg', 'greece_b02.jpg', 'greece_b03.jpg', 'greece_b04.jpg', 'greece_b05.jpg'],
  greece_c: ['greece_c01.jpg', 'greece_c02.jpg', 'greece_c03.jpg', 'greece_c04.jpg', 'greece_c05.jpg'],
  greece_d: ['greece_d01.jpg', 'greece_d02.jpg', 'greece_d03.jpg', 'greece_d04.jpg', 'greece_d05.jpg']
}

def attach_images(flat, filenames)
  filenames.each do |filename|
    image_path = Rails.root.join('db', 'images', filename)

    flat.images.attach(
      io: File.open(image_path),
      filename: filename,
      content_type: 'application/jpg',
      identify: false
    )
  end
end

# db/seeds.rb
puts '===================='
puts 'Start seeding...'


# flat1
flat1 = Flat.new(
  title: 'Cosy Flat in Valletta',
  description: 'Awesome flat in Valletta',
  street: '',
  city: "Valletta",
  country: "Malta",
  price_per_night_in_cents: 75000,
  category: :entire_place
)
attach_images(flat1, filenames[:greece_a])


# flat2
flat2 = Flat.new(
  title: 'Cosy Room in Heraklion',
  description: 'Awesome room in Heraklion',
  street: '',
  city: "Heraklion",
  country: "Greece",
  price_per_night_in_cents: 20000,
  category: :private_room
)
attach_images(flat2, filenames[:greece_b])


# flat3
flat3 = Flat.new(
  title: 'Cosy Flat in Mylos',
  description: 'Awesome flat in Mylos',
  street: '',
  city: "Mylos",
  country: "Greece",
  price_per_night_in_cents: 10000,
  category: :entire_place
)
attach_images(flat3, filenames[:greece_a])


# flat4
flat4 = Flat.new(
  title: 'Cosy Room in Mykonos',
  description: 'Awesome room in Mykonos',
  street: '',
  city: "Mykonos",
  country: "Greece",
  price_per_night_in_cents: 20000,
  category: :private_room
)
attach_images(flat4, filenames[:greece_b])


# flat5
flat5 = Flat.new(
  title: 'Cosy Flat in Paros',
  description: 'Awesome flat in Paros',
  street: '',
  city: "Paros",
  country: "Greece",
  price_per_night_in_cents: 10000,
  category: :entire_place
)
attach_images(flat5, filenames[:greece_c])


# flat6
flat6 = Flat.new(
  title: 'Cosy Room in Samos',
  description: 'Awesome room in Samos',
  street: '',
  city: "Samos",
  country: "Greece",
  price_per_night_in_cents: 20000,
  category: :private_room
)
attach_images(flat6, filenames[:greece_d])


# flat7
flat7 = Flat.new(
  title: 'Cosy Flat in Rhodes',
  description: 'Awesome flat in Rhodes',
  street: '',
  city: "Rhodes",
  country: "Greece",
  price_per_night_in_cents: 10000,
  category: :entire_place
)
attach_images(flat7, filenames[:greece_c])


# flat8
flat8 = Flat.new(
  title: 'Cosy Room in Zakynthos',
  description: 'Awesome room in Zakynthos',
  street: '',
  city: "Zakynthos",
  country: "Greece",
  price_per_night_in_cents: 20000,
  category: :private_room
)
attach_images(flat8, filenames[:greece_d])

# flat9
flat9 = Flat.new(
  title: 'Cosy Room in Kalambaka',
  description: 'Awesome room in Kalambaka',
  street: '',
  city: "Kalambaka",
  country: "Greece",
  price_per_night_in_cents: 20000,
  category: :private_room
)
attach_images(flat9, filenames[:greece_d])

# flat10
flat10 = Flat.new(
  title: 'Cosy Flat in Piraeus',
  description: 'Awesome flat in Piraeus',
  street: '',
  city: "Rhodes",
  country: "Greece",
  price_per_night_in_cents: 10000,
  category: :entire_place
)
attach_images(flat10, filenames[:greece_c])

# flat11
flat11 = Flat.new(
  title: 'Cosy Room in Alexandroupoli',
  description: 'Awesome room in Alexandroupoli',
  street: '',
  city: "Alexandroupoli",
  country: "Greece",
  price_per_night_in_cents: 20000,
  category: :private_room
)
attach_images(flat11, filenames[:greece_d])

# flat12
flat12 = Flat.new(
  title: 'Cosy Flat in Serres',
  description: 'Awesome flat in Serres',
  street: '',
  city: "Serres",
  country: "Greece",
  price_per_night_in_cents: 10000,
  category: :entire_place
)
attach_images(flat12, filenames[:greece_c])

# flat13
flat13 = Flat.new(
  title: 'Cosy Room in 	Kalamata',
  description: 'Awesome room in Kalamata',
  street: '',
  city: "Kalamata",
  country: "Greece",
  price_per_night_in_cents: 20000,
  category: :private_room
)
attach_images(flat13, filenames[:greece_b])

# flat14
flat14 = Flat.new(
  title: 'Cosy Flat in Volos',
  description: 'Awesome flat in Volos',
  street: '',
  city: "Volos",
  country: "Greece",
  price_per_night_in_cents: 10000,
  category: :entire_place
)
attach_images(flat14, filenames[:greece_a])

# flat15
flat15 = Flat.new(
  title: 'Cosy Room in Patras',
  description: 'Awesome room in Patras',
  street: '',
  city: "Patras",
  country: "Greece",
  price_per_night_in_cents: 20000,
  category: :private_room
)
attach_images(flat15, filenames[:greece_b])

# flat16
flat16 = Flat.new(
  title: 'Cosy Flat in Thessaloniki',
  description: 'Awesome flat in Thessaloniki',
  street: '',
  city: "Thessaloniki",
  country: "Greece",
  price_per_night_in_cents: 75000,
  category: :entire_place
)
attach_images(flat16, filenames[:greece_a])


###
# Create Users
puts 'Creating Users with flats...'
user01 = User.create(
  email: 'user01@example.com',
  password: 'password', 
  description: Faker::Hipster.sentence,
  role: :user,
  flats: [flat1, flat2, flat3, flat4],
)

user02 = User.create(
  email: 'user02@example.com',
  password: 'password', 
  description: Faker::Hipster.sentence,
  role: :user,
  flats: [flat5, flat6, flat7, flat8],
)

user03 = User.create(
  email: 'user03@example.com',
  password: 'password', 
  description: Faker::Hipster.sentence,
  role: :user,
  flats: [flat9, flat10, flat11, flat12],
)

user04 = User.create(
  email: 'user04@example.com',
  password: 'password', 
  description: Faker::Hipster.sentence,
  flats: [flat13, flat14, flat15, flat16],
)

# admin = User.create(
#   email: 'admin@example.com',
#   password: 'password',
#   role: :admin
# )
# attach_image(admin, filename[:greece_b][0])


# Print Flat Attributes
def print_flat_attributes(flat)
  puts "  Flat #{flat.id}:"
  puts "   Owner id: #{flat.user_id}"
  puts "   Title: #{flat.title}"
  puts "   Description: #{flat.description}"
  puts "   Street: #{flat.street}"
  puts "   City: #{flat.city}"
  puts "   Country: #{flat.country}"
  puts "   Latitude: #{flat.latitude}"
  puts "   Longitude: #{flat.longitude}"
  puts "   Price per Night in cents: #{flat.price_per_night_in_cents}"
  puts "   Category: #{flat.category}"
  puts '---'
end

# Print User Attributes
def print_user_attributes(user)
  puts "User id #{user.id}:"
  puts " Email: #{user.email}"
  puts " Description: #{user.description}"
  puts " Role: #{user.role}"

  if user.flats.present?
    puts " Flats:"
    user.flats.each do |flat|
      print_flat_attributes(flat)
    end
  end
  puts '---'
end

users = [user01, user02, user03]
users.each do |user|
    print_user_attributes(user)
end

# puts "Admin: User id#{admin.id}:"
# puts "  Email: #{admin.email}"
# puts "  Role: #{admin.role}"
# puts '---'

puts 'Seed data created successfully!'
puts '===================='
