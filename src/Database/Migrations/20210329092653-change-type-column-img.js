'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Articles', 'img', { type: Sequelize.TEXT })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Articles', 'img', { type: Sequelize.STRING(255) })
    ]);
  }
};
