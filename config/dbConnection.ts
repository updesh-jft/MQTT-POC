import mongoose from 'mongoose';
const DB_CONFIG = {
    host: '127.0.0.1',
    port: 27017,
    dbName: 'mqtt'
};

const dbConnection = {
    dbConnect() {
        mongoose.connect(`mongodb://${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.dbName}`);
    }
}

export default dbConnection;