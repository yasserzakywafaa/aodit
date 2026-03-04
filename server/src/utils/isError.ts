// Global type guard function
const isError = (error: any): error is Error => {
  return error instanceof Error;
};

export default isError;
