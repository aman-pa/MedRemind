import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`MedRemind backend running on port ${port}`);
});

connectDB().catch((error) => {
	console.error('Failed to connect DB:', error.message);
});
