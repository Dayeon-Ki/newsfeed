'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.addColumn('users', 'emailConfirm', {
    //     type: Sequelize.BOOLEAN,
    //     defaultValue: false, // 기본값은 미인증 상태
    // });
    await queryInterface.addColumn('users', 'randomNumber', {
      type: Sequelize.STRING,

  })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
