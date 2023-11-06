import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";

/**
 * Log a warning and show a toast!
 */
export const errorLoggingMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) { /* empty */ }

  return next(action);
};
