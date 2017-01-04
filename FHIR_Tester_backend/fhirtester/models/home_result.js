/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('home_result', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true
    },
    task_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'home_task',
        key: 'task_id'
      }
    }
  }, {
    tableName: 'home_result'
  });
};
