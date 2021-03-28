'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.addColumn('User_Promotions', 'used', { type: Sequelize.BOOLEAN, defaultValue: false })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.removeColumn('User_Promotions', 'used')
    ]);
  }
};
