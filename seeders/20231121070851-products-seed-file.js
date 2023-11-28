'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        id: 1,
        name: '薯條',
        description: '好吃',
        price: 135,
        image: '/faker/white-fries.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: '洋蔥圈',
        description: '很脆',
        price: 200,
        image: '/faker/Onion-rings.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: '薯辦',
        description: '超級好吃',
        price: 100,
        image: '/faker/Potato-Wedges.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: '網狀薯條',
        description: '超級好吃的',
        price: 150,
        image: '/faker/Waffle-Fries.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: '調味薯條',
        description: '鹹香',
        price: 150,
        image: '/faker/fries.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: '單色起司',
        description: '濃厚起司',
        price: 200,
        image: '/faker/Shredded-Cheese.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
