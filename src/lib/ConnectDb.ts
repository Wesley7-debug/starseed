import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

export default async function connectDb() {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'issa' });
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
