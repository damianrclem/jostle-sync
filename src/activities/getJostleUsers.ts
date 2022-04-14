import csv from 'csvtojson';
import { JostleUser } from '../types';

export const getJostleUsers = async (): Promise<Array<JostleUser>> => {
  const users = await csv().fromFile('./jostleUsers.csv')
  return users as Array<JostleUser>
}