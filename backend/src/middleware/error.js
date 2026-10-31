import { env } from '../config/env.js';

export const notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });

export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err.name === 'CastError') { status = 400; message = 'Invalid id'; }
  if (err.code === 11000) { status = 409; message = 'That value is already in use'; }
  if (status === 500) console.error(err);
  if (status === 500 && env.isProd) message = 'Something went wrong';

  res.status(status).json({ success: false, message });
};
