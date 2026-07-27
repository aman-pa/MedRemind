import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';

const port = process.env.PORT || 5000;

async function startServer() {
	const mongoUri = process.env.MONGODB_URI;

	if (!mongoUri) {
		throw new Error('MONGODB_URI is not defined. Check backend/.env');
	}

	await connectDB();

	app.listen(port, () => {
		console.log(`MedRemind backend running on port ${port}`);
	});
}

startServer().catch((error) => {
	console.error('Failed to start backend:', error.message);
	process.exit(1);
});
