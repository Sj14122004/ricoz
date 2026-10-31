import { ApiError } from '../utils/ApiError.js';

// validate(schema) -> parses req.body and replaces it with clean data.
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const msg = result.error.issues
      .map((i) => `${i.path.join('.') || 'body'}: ${i.message}`)
      .join(', ');
    return next(new ApiError(400, msg));
  }
  req.body = result.data;
  next();
};
