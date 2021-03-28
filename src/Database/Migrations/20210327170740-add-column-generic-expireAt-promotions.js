'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.addColumn('Promotions', 'generic', { type: Sequelize.BOOLEAN, defaultValue: false }),
        queryInterface.addColumn('Promotions', 'expireAt', { type: Sequelize.DATE, allowNull: true, defaultValue: null })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.removeColumn('Promotions', 'generic'),
        queryInterface.removeColumn('Promotions', 'expireAt')
    ])
  }
};
