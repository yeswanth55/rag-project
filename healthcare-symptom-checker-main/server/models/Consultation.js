const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Consultation = sequelize.define('Consultation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  analysis: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('analysis');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('analysis', JSON.stringify(value));
    }
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['low', 'moderate', 'high', 'emergency']]
    }
  }
}, {
  timestamps: true,
  tableName: 'consultations'
});

// Define associations
User.hasMany(Consultation, { foreignKey: 'userId', as: 'consultations' });
Consultation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Consultation;
