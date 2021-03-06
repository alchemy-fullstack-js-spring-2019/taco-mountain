const chance = require('chance').Chance();
const User = require('../../lib/models/User');
const Customer = require('../../lib/models/Customer');
const Food = require('../../lib/models/Food');
const Order = require('../../lib/models/Order');

function seedUsers(userCount = 20) {
  const users = [...Array(userCount)].map(() => ({
    name: chance.name(),
    password: 'password123',
    phone: chance.phone({ formatted: false }),
    role: 'customer'
  }));
  return User.create(users);
}

async function seedCustomers(customerCount = 20) {
  const users = await seedUsers();
  const customers = [...Array(customerCount)].map((_, i) => ({
    user: users[i]._id,
    rewards: chance.natural({ max: 50 })
  }));
  return Customer.create(customers);
}

function seedFood(foodCount = 5) {
  const food = ['appetizer', 'entree', 'drink'].map(type =>
    [...Array(foodCount)].map(() =>
      ({
        name: handleFoodType(type),
        price: chance.floating({ min: 2, max: 10, fixed: 2 }),
        type: type,
        unitCost: chance.floating({ min: 0.5, max: 2, fixed: 2 }),
        image: chance.avatar()
      }))
  ).flat();
  return Food.create(food);
}

function handleFoodType(type) {
  switch(type) {
    case 'appetizer':
      return `${chance.country({ full: true })} Nachos`;
    case 'entree':
      return `${chance.animal()} Tacos`;
    case 'drink':
      return `${chance.profession()} Margarita`;
  }
}

async function seedOrders(orderCount = 100) {
  const customers = await seedCustomers();
  const food = await seedFood();
  const orders = [...Array(orderCount)].map(() => {
    const foodOrder = [...Array(chance.natural({ min: 1, max: 6 }))].map(() => {
      const randomFood = chance.pickone(food);
      return {
        foodId: randomFood._id, name: randomFood.name, purchasePrice: randomFood.price
      };
    });

    return {
      customer: chance.pickone(customers)._id,
      food: foodOrder,
      get subtotal() {
        return this.food.reduce((acc, cur) => acc + cur.purchasePrice, 0);
      },
      tip: chance.integer({ min: 0, max: 5 }),
      get total() {
        return this.subtotal + this.tip;
      }
    };
  });
  return Order.create(orders);
}

module.exports = seedOrders;
