import { Writable } from 'stream';

export interface CleanupProcess {
  kill: () => void
}

export interface LaunchProcess {
  command: string
  args: Array<string>
  cleanup: boolean
  loggingStream?: Writable
  overrideProcessCleanup?: CleanupProcess // don't just kill ChildProcess, do something else
}