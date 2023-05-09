import 'colors'
import inputConfig from '../config'

/**
 * null value is required
 * @type {Required<IUserConfig>}
 */
const defaultValues = {
  /**
  * required
  */
  altvPath: null,
  connectUrl: '127.0.0.1:7788',
  skipAltvUpdate: true,
  restartOnGameCrash: true,
  restartOnDisconnect: false,
  closeAltvOnExitScript: false,
  skipProcessConfirmation: true,
}

export const config = readConfig(inputConfig)
log('readed config:')
log(config)

/**
 *
 * @returns {Required<IUserConfig>}}
 */
function readConfig (inputConfig) {
  const outputConfig = {}

  for (const key in inputConfig) {
    const value = inputConfig[key]
    const valueType = typeof value
    const defaultValue = defaultValues[key]
    const defaultValueType = typeof defaultValue

    if (value != null) {
      if (defaultValue === undefined) {
        fail(`unexpected config key: ${key}`)
      }
      if (valueType !== defaultValueType && defaultValue !== null) {
        fail(`config key: ${key} type: ${valueType} but required: ${defaultValueType}`)
      }
      outputConfig[key] = value
    } else {
      if (defaultValue !== null) {
        outputConfig[key] = defaultValue
      } else {
        fail(`missed required config key: ${key}`)
      }
    }
  }

  return outputConfig
}

function fail (info) {
  logError(info)
  process.exit(1)
}

function logError (info) {
  console.error('[config-reader]', info.red)
}

function log (info) {
  console.error('[config-reader]'.blue, info)
}
