import * as express from "express";
import HttpStatus from "http-status-codes";

import { logFunctionException } from "./logFunctionException";

export const logHandlerException = async <T>(
  fn: () => T,
  name: string,
  res: express.Response
) => {
  const result = await logFunctionException(fn, name);

  if (result === null) {
    return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return result;
};
