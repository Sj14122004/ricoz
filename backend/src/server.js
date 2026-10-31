import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

connectDB()
  .then(() => app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`)))
  .catch((err) => {
    console.error('Could not start server:', err.message);
    process.exit(1);
  });
