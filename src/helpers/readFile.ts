import fs from 'fs';
import util from 'util';

/**
 * Handy dandy utility to read files using async/await
 * @param path - path relative to the project root (must start with ./templates)
 * @returns - the contents of the file
 */
export const readFile = async (filePath: string): Promise<string> =>
  await util.promisify(fs.readFile)(filePath, 'utf8');
