// TODO: Figure out how this import even works. Do not try installing! Breaks activitiy retry
// eslint-disable-next-line import/no-extraneous-dependencies
import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from '../activities';
import { Loan, Application, Result } from '../types';
import { PropertyRequiredError, ValidationError } from '../errors';
import { createUdnOrderActivityFactory } from '../activities/createUdnOrderActivity';
import { createUdnOrderDbSaveActivityFactory } from '../activities/createUdnOrderDbSaveActivity';
import { getEncompassLoanFactory } from '../activities/getEncompassLoanActivity';
import { runWorkflow } from '../helpers/runWorkflow';

const { getEncompassLoan } = proxyActivities<ReturnType<typeof getEncompassLoanFactory>>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumAttempts: 5,
  },
});

const { dbLoanUpsertActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumAttempts: 5,
  },
});

const { createUdnOrderActivity } = proxyActivities<ReturnType<typeof createUdnOrderActivityFactory>>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumAttempts: 5,
  },
});

const { createUdnOrderDbSaveActivity } = proxyActivities<ReturnType<typeof createUdnOrderDbSaveActivityFactory>>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumAttempts: 5,
  },
});

const processApplication = async (loan: Loan, application: Application): Promise<Result<Application>> => {
  const resultApplication = await createUdnOrderActivity(loan, application);
  await createUdnOrderDbSaveActivity(resultApplication);
  return {
    message: 'UDN Created',
    result: resultApplication,
  };
};

async function createUdnOrders(loanId: string): Promise<Result<Application>[]> {
  if (!loanId) {
    throw new ValidationError('createUdnOrders workflow requires loanId arg');
  }
  // Get the loan from Encompass
  const encompassLoan = await getEncompassLoan(loanId);
  if (!encompassLoan) {
    throw new Error('getEncompassLoanActivity did not return loan');
  }

  // Get the loan from the DB.  If it doesn't exists, it will be created and returned
  const loan = await dbLoanUpsertActivity(encompassLoan);
  if (!loan) {
    throw new Error('Something went wrong during dbLoanUpsertActivity');
  }

  const { applications } = loan;
  if (!applications) {
    throw new PropertyRequiredError('loan.applications');
  }

  // Builds up an array of processApplication promises and fires them off
  return Promise.all(applications.map((application) => processApplication(loan, application)));
}

/** A workflow that simply calls an activity */
export async function createUdnOrdersWorkflow(loanId: string): Promise<unknown> {
  return await runWorkflow(createUdnOrders(loanId));
}
