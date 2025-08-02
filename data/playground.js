use('final-project');

// Insert a few documents into the usermanagement collection.
db.getCollection('user').insertMany([
  {
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    password: 'password123'
  },
  {
    firstname: 'Jane',
    lastname: 'Smith',
    username: 'janesmith',
    password: 'securepass'
  },
  {
    firstname: 'Emily',
    lastname: 'Brown',
    username: 'emilyb',
    password: 'mypassword'
  }
]);

// Insert a few documents into the groceries collection.
db.getCollection('groceries').insertMany([
  {
    name: 'Milk',
    quantity: 2,
    price: 3.50
  },
  {
    name: 'Bread',
    quantity: 1,
    price: 2.00
  },
  {
    name: 'Eggs',
    quantity: 12,
    price: 4.25
  }
]);

// Insert a few documents into the clothes collection.
db.getCollection('clothes').insertMany([
  {
    name: 'T-Shirt',
    size: 'M',
    price: 15.99
  },
  {
    name: 'Jeans',
    size: 'L',
    price: 45.50
  },
  {
    name: 'Jacket',
    size: 'S',
    price: 89.00
  }
]);

// Insert a few documents into the electronics collection.
db.getCollection('electronics').insertMany([
  {
    name: 'Smartphone',
    brand: 'Samsung',
    price: 699.99
  },
  {
    name: 'Laptop',
    brand: 'Dell',
    price: 1200.00
  },
  {
    name: 'Headphones',
    brand: 'Sony',
    price: 199.99
  }
]);

// Find all users in the usermanagement collection.
const users = db.getCollection('user').find().toArray();
console.log('Users inserted:', users);

// Find all groceries in the groceries collection.
const groceries = db.getCollection('groceries').find().toArray();
console.log('Groceries inserted:', groceries);

// Find all clothes in the clothes collection.
const clothes = db.getCollection('clothes').find().toArray();
console.log('Clothes inserted:', clothes);

// Find all electronics in the electronics collection.
const electronics = db.getCollection('electronics').find().toArray();
console.log('Electronics inserted:', electronics);
