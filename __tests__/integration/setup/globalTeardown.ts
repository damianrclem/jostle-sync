/* eslint-disable vars-on-top, no-var */
import { CleanupProcess } from './types';

declare global {
  var RM_PROCESS_CLEANUP: Array<CleanupProcess>;
}

export default () => {
  // loop on process's started in `globalStartup.ts` and kill them
  global.RM_PROCESS_CLEANUP.forEach((cp) => {
    cp.kill();
  });
};