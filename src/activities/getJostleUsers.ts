import csv from 'csvtojson';

export const getJostleUsers = async () => {
  const users = await csv().fromFile('./jostleUsers.csv')
  console.log(users)
}