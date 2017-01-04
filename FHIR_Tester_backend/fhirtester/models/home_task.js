/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('home_task', {
    task_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false
    },
    task_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'account_user',
        key: 'username'
      }
    },
    target_server_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'home_server',
        key: 'server_id'
      }
    }
  }, {
    tableName: 'home_task'
  });
};
