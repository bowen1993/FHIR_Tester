/* jshint indent: 2 */
var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account_user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false
    },
    password_digest: {
		  type: DataTypes.STRING,
		  validate: {
		  	notEmpty: true
		  }
	  },
    usrlevel: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'account_user',
    instanceMethods: {
      authenticate: function(value) {
        if (bcrypt.compareSync(value, this.password_digest))
          return this;
        else
          return false;
      }
    }
  });
};
