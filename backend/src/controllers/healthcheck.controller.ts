import { Request, Response } from "express";

export const healthCheck = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Server Health is alright ",
    });
  } catch (error: any) {
    return res.status(500).json({
      err: error.message,
    });
  }
};
