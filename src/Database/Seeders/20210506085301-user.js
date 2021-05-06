'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'alan',
      email: 'alan@gmail.com',
      password:'1234',
      token:'f397cb36-c68b-4866-9f41-706f1c20a782',
      isAdmin: true
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
