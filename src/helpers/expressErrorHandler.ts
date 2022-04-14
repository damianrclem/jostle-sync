import { NextFunction, Request, Response } from 'express';

// even though the next function is not called, you need to leave it here as its how express knows this is an error handling middleware.
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const expressErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.sendStatus(500);
};
