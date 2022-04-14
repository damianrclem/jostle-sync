import 'express-async-errors'
import express from 'express'
import { expressErrorHandler } from '../helpers/expressErrorHandler'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.use(expressErrorHandler);

app.listen(port, () => {
  console.log(`Api listening at http://localhost:${port}`);
});