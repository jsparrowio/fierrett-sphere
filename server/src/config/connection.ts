import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://192.168.171.121:27017/');

export default mongoose.connection;
