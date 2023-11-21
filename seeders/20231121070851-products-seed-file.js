'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        id: 1,
        name: '薯條',
        description: '好吃',
        price: 135,
        image: '/faker/直條薯條.jpg',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: '洋蔥圈',
        description: '很脆',
        price: 200,
        image: '/faker/洋蔥圈.jpg',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: '薯辦',
        description: '超級好吃',
        price: 100,
        image: '/faker/紅石薯瓣.jpg',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: '網狀',
        description: '超級好吃的',
        price: 150,
        image: '/faker/紅石網狀.jpg',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
