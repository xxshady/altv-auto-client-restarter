interface IUserConfig {
  altvPath: string,
  connectUrl?: string,
  skipAltvUpdate?: boolean,
  restartGameDelay?: number,
  restartOnGameCrash?: boolean,
  restartOnGameCrashDelay?: number
  closeAltvOnExitScript?: boolean,
}