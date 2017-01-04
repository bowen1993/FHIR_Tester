/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('home_server', {
    server_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    server_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    server_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'home_server'
  });
};
