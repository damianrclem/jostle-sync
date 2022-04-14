import 'express-async-errors'
import express, { Response } from 'express'
import { expressErrorHandler } from '../helpers/expressErrorHandler'
import { getWorkflowClient } from '../temporal/client'
import { syncJostleUsersWorkflow } from '../workflows'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.post(('/sync'), async (_, res: Response) => {
  const client = getWorkflowClient();
  const workflowResponse = await client.start(syncJostleUsersWorkflow, {
    taskQueue: 'jostle-ad-sync',
    workflowId: `jostle-ad-sync-${Date.now()}`
  });
  
  res.status(200).send({
    workflowId: workflowResponse.workflowId,
  })
})

app.use(expressErrorHandler);

app.listen(port, () => {
  console.log(`Api listening at http://localhost:${port}`);
});