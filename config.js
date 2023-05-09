// @ts-check
/**
 *
 * @type {IUserConfig}
 */
const config = {
  altvPath: 'C:/altv-clients/dev',
  connectUrl: '127.0.0.1:7788',
  skipAltvUpdate: false,
  restartOnGameCrash: true,
  /**
   * for delay uses {@link config.restartGameDelay}
   */
  restartOnDisconnect: true,
  /**
   * if you closes running script or presses ctrl+c its automatically closes altv and gta
   */
  closeAltvOnExitScript: true,

  skipProcessConfirmation: true,
}

export default config
