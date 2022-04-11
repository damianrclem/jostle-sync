import axios from 'axios';

export const createUdn = async (id: string) =>
  await axios.post(
    'http://localhost:3000/create',
    {
      detail: {
        loan: {
          id,
        },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

export const uploadUdn = async (id: string) =>
  await axios.post(
    'http://localhost:3000/upload',
    {
      detail: {
        loan: {
          id,
        },
        fields: {
          'CX.CP.MANUALUDNPULLFLAG': '1',
        },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
