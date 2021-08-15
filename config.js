// @ts-check
/**
 *
 * @type {IUserConfig}
 */
const config = {
  altvPath: 'C:\\Program Files\\altv-release-client',
  connectUrl: '127.0.0.1:7788',
  skipAltvUpdate: true,
  /**
   * this value is used when restarting the game for example with console "re" command
   * you may need to increase this if you are experiencing altv error "GTA V is already running.."
   */
  restartGameDelay: 700,

  restartOnGameCrash: false,
  /**
   * the same as `restartGameDelay` but for game crash (when crash occurs game needs more time to restart)
   */
  restartOnGameCrashDelay: 1500,
  /**
   * if you closes running script or presses ctrl+c its automatically closes altv and gta
   */
  closeAltvOnExitScript: false,
}

export default config
