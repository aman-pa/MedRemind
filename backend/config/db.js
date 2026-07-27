import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		const mongoUri = process.env.MONGODB_URI;

		if (!mongoUri) {
			throw new Error('MONGODB_URI is not defined. Check backend/.env');
		}

		await mongoose.connect(mongoUri);
		console.log('Database connected successfully');
	} catch (error) {	
		console.error('Database connection failed:', error.message);
		process.exit(1);
	}
};

export default connectDB;