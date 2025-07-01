import { Sequelize } from 'sequelize';
import { config } from './index';

const sequelize = new Sequelize(config.database.url, {
  dialect: 'postgres',
  logging: config.nodeEnv === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      ca:config.database.caCertificate
    }
  },
});

export default sequelize;
