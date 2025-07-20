import mongoose from 'mongoose';

export default async function connectDb() {
  try {
    const dbUri = process.env.MONGODB_URI!;
    // console.log('Connecting to MongoDB with URI:', dbUri);

    if (mongoose.connection.readyState === 0) {

      await mongoose.connect(dbUri,{
       dbName: 'issa' 
      });

      console.log('Database connected successfully');
    } else {
      console.log('Database already connected');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }
}
