/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('home_task_steps', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    step_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    additional_file: {
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
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'home_task_steps'
  });
};
