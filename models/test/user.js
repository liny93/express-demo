/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    num: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    sex: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    score: {
      type: "DOUBLE(4,0)",
      allowNull: true
    }
  }, {
    tableName: 'user'
  });
};
