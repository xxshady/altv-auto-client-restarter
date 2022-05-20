interface IUserConfig {
  altvPath: string,
  connectUrl?: string,
  skipAltvUpdate?: boolean,
  restartGameDelay?: number,
  restartOnGameCrash?: boolean,
  restartOnDisconnect?: boolean
  restartOnGameCrashDelay?: number
  closeAltvOnExitScript?: boolean,
}