/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account_user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usrlevel: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'account_user'
  });
};
