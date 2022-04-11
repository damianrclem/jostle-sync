/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Context } from '@temporalio/activity';
import { v4 as uuid } from 'uuid';
import { putEncryptedObject, getClient } from './s3';

const generateCorrelationId = () => uuid();

const getCurrentWorkflowId = () => Context.current().info.workflowExecution.workflowId;

const getTimestamp = () => new Date().toISOString();

const getS3BaseUrl = () => `s3://${process.env.CREDIT_PLUS_S3_BUCKET}`;

const onRequestFulfilled = async (config: AxiosRequestConfig<any>) => {
  const correlationId = generateCorrelationId();
  const workflowId = getCurrentWorkflowId();

  const updatedConfig = {
    ...config,
    headers: {
      ...config.headers,
      'rm-correlation-id': correlationId,
    },
  };
  // Now, we log
  const objectKey = `logs/workflows/${workflowId}/${correlationId}-request`;
  console.log(
    'AXIOS REQUEST',
    JSON.stringify(
      {
        workflowId,
        timestamp: getTimestamp(),
        correlationId,
        requestUrl: config.url,
        requestBody: config.data ? `${getS3BaseUrl()}/${objectKey}` : null,
      },
      null,
      2,
    ),
  );
  // Now we save stuff
  if (config.data) {
    try {
      await putEncryptedObject(getClient(), {
        Bucket: process.env.CREDIT_PLUS_S3_BUCKET,
        Key: objectKey,
        Body: Buffer.from(typeof config.data === 'object' ? JSON.stringify(config.data) : config.data, 'utf8'),
        ContentType: 'text/plain',
      });
    } catch (error) {
      console.error('An error occurred saving request to S3');
      console.error(error);
    }
  }
  return updatedConfig;
};

const onRequestRejected = (error: any) => Promise.reject(error);

const onResponseFulfilled = async (response: AxiosResponse<any, any>) => {
  if (!response.config.headers || !response.config.headers['rm-correlation-id']) {
    console.error('Missing request correlation ID');
    return response;
  }
  // Just in case the rm-correlation-id header is missing, use a timestamp
  const correlationId = response.config.headers['rm-correlation-id'] ?? encodeURIComponent(getTimestamp());
  if (!correlationId) {
    console.error('Response missing request header rm-correlation-id. Using timestamp instead.');
  }
  const workflowId = getCurrentWorkflowId();
  // Now, we log
  const objectKey = `logs/workflows/${workflowId}/${correlationId}-response`;
  console.log(
    'AXIOS RESPONSE',
    JSON.stringify(
      {
        workflowId,
        timestamp: getTimestamp(),
        correlationId,
        requestUrl: response.config.url,
        responseBody: `${getS3BaseUrl()}/${objectKey}`,
      },
      null,
      2,
    ),
  );
  // Now we save stuff
  if (response.data) {
    try {
      await putEncryptedObject(getClient(), {
        Bucket: process.env.CREDIT_PLUS_S3_BUCKET,
        Key: objectKey,
        Body: Buffer.from(typeof response.data === 'object' ? JSON.stringify(response.data) : response.data, 'utf8'),
        ContentType: 'text/plain',
      });
    } catch (error) {
      console.error('An error occurred saving request to S3');
      console.error(error);
    }
  }
  return response;
};

const onResponseRejected = (error: any) => Promise.reject(error);

export const applyAxiosS3Logger = () => {
  axios.interceptors.request.use(onRequestFulfilled, onRequestRejected);
  axios.interceptors.response.use(onResponseFulfilled, onResponseRejected);
};
