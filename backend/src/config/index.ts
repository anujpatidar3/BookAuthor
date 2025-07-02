import dotenv from 'dotenv';

dotenv.config();
if (!process.env.CA_CERTIFICATE) {
  throw new Error("Missing CA_CERTIFICATE in environment variables");
}
const caCert = Buffer.from(process.env.CA_CERTIFICATE, 'base64').toString('utf-8');

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/bookauthor_db',
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/bookauthor_metadata',
    caCertificate: caCert ? caCert : undefined,
  },
   // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL ? 
      process.env.FRONTEND_URL.split(',').map(url => url.trim()) : 
      'http://localhost:3000',
    credentials: true,
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requests per windowMs
  },
};
