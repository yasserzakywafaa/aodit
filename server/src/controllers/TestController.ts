import { NextFunction, Request, Response } from "express";

export const testHello = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const name = request.query.name;
  try {
    console.log("ℹ️  Testing Hello route. Name:>>>", name);

    response.status(200).json({
      results: `Hi, I'm ${name}, a Senior Front-end Developer 🙋🏻‍♂️ `,
    });
  } catch (error) {
    console.error("❌ Failed to get the Test response!", {
      error,
    });
    next(error);
  }
};

const TestController = {
  testHello,
};

export default TestController;
