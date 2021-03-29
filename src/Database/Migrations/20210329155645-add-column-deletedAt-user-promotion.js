'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('User_Promotions', 'deletedAt', { type: Sequelize.DATE, defaultValue: null })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('User_Promotions', 'deletedAt')
    ])
  }
};
