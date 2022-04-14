import 'express-async-errors'
import express, { Request, Response } from 'express'
import { expressErrorHandler } from '../helpers/expressErrorHandler'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.post(('/sync'), async (req: Request, res: Response) => {
  res.status(200).send()
})

app.use(expressErrorHandler);

app.listen(port, () => {
  console.log(`Api listening at http://localhost:${port}`);
});