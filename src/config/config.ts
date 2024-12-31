import dotenv from 'dotenv';

dotenv.config();

let config:any = {};

config.PORT = process.env.PORT || 3001;
config.ENVIORNMENT = process.env.ENVIORNMENT || 'DEV';
config.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '12345AQWERT';
config.JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN || '24h';
config.JWT_ISSUER = process.env.JWT_ISSUER || 'Ashish-App';
config.MONGODB_URL = process.env.MONGODB_URL || '';
config.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || 'http://localhost:9200';
config.ELASTIC_SEARCH_USERNAME = process.env.ELASTIC_SEARCH_USERNAME || 'elastic';
config.ELASTIC_SEARCH_PASSWORD = process.env.ELASTIC_SEARCH_PASSWORD || 'mgOlwGvlejlWRABZpbDW';

export default config;