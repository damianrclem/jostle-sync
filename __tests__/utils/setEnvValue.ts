export const setEnvValue = (key: string, value: string): (() => void) => {
  // grab existing value so we can reset later
  const existingValue = process.env[key];
  process.env[key] = value;

  // create cleanup function
  return () => {
    process.env[key] = existingValue;
  };
};
