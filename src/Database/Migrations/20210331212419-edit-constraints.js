'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.removeConstraint('Promotions', 'Promotions_article_id_fkey'),
        queryInterface.removeConstraint('Promotions', 'Promotions_qrcode_id_fkey'),
        queryInterface.addConstraint('Promotions',
            {
              name: 'Promotions_article_id_fkey',
              fields: ['article_id'],
              type: 'foreign key',
              onDelete: 'cascade',
              references: {
                table: 'Articles',
                field: 'id'
              }
            }),
        queryInterface.addConstraint('Promotions', {
          name: 'Promotions_qrcode_id_fkey',
          fields: ['qrcode_id'],
          type: 'foreign key',
          onDelete: 'cascade',
          references: {
            table: 'Qrcodes',
            field: 'id'
          }
        }),
        queryInterface.removeConstraint('User_Promotions', 'User_Promotions_promotion_id_fkey'),
        queryInterface.removeConstraint('User_Promotions', 'User_Promotions_user_id_fkey'),
        queryInterface.addConstraint('User_Promotions', {
          name: 'User_Promotions_promotion_id_fkey',
          fields: ['promotion_id'],
          type: 'foreign key',
          onDelete: 'cascade',
          references: {
            table: 'Promotions',
            field: 'id'
          }
        }),
        queryInterface.addConstraint('User_Promotions', {
          name: 'User_Promotions_user_id_fkey',
          fields: ['user_id'],
          type: 'foreign key',
          onDelete: 'cascade',
          references: {
            table: 'Users',
            field: 'id'
          }
        })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.removeConstraint('Promotions', 'Promotions_article_id_fkey'),
        queryInterface.removeConstraint('Promotions', 'Promotions_qrcode_id_fkey'),
        queryInterface.addConstraint('Promotions',
            {
              name: 'Promotions_article_id_fkey',
              fields: ['article_id'],
              type: 'foreign key',
              references: {
                table: 'Articles',
                field: 'id'
              }
            }),
        queryInterface.addConstraint('Promotions', {
          name: 'Promotions_qrcode_id_fkey',
          fields: ['qrcode_id'],
          type: 'foreign key',
          references: {
            table: 'Qrcodes',
            field: 'id'
          }
        }),
        queryInterface.removeConstraint('User_Promotions', 'User_Promotions_promotion_id_fkey'),
        queryInterface.removeConstraint('User_Promotions', 'User_Promotions_user_id_fkey'),
        queryInterface.addConstraint('User_Promotions', {
          name: 'User_Promotions_promotion_id_fkey',
          fields: ['promotion_id'],
          type: 'foreign key',
          references: {
            table: 'Promotions',
            field: 'id'
          }
        }),
        queryInterface.addConstraint('User_Promotions', {
          name: 'User_Promotions_user_id_fkey',
          fields: ['user_id'],
          type: 'foreign key',
          references: {
            table: 'Users',
            field: 'id'
          }
        })
    ])
  }
};
