'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Promotions', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      article_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Articles',
          key: 'id'
        }
      },
      qrcode_id: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'Qrcodes',
          key: 'id'
        }
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      percentageReduction: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Promotions');
  }
};
