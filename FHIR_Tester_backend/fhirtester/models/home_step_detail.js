/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('home_step_detail', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    detail_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    detail_status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    step_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'home_task_steps',
        key: 'id'
      }
    },
    http_request: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    http_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    request_resource: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    response_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resource_name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'home_step_detail'
  });
};
