import { Result } from '../types';

export async function runActivity<T>(activity: Promise<T>): Promise<Result<T>> {
  try {
    const result = await activity;
    return {
      result,
    };
  } catch (error) {
    return {
      error,
    };
  }
}
