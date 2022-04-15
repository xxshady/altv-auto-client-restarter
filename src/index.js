import { exec, spawn } from 'child_process'
import 'colors'
import readline from 'readline'
import { Tail } from 'tail'
import { config } from './config-reader'
import { syncReaddirSortTime, waitAsync, waitForAsync } from './utils'

const altGameCrashLogString = 'MINIDUMP.'
const altvPath = config.altvPath
const altvArgs = [
  config.connectUrl ? `-connecturl altv://connect/${config.connectUrl}` : null,
  config.skipAltvUpdate ? '-noupdate' : null,
]

startAltv()
startCommandsReader()

if (config.closeAltvOnExitScript) {
  process.on('SIGINT', async () => {
    await closeAltv()
    process.exit(1)
  })
}

async function programRestart (delay = config.restartGameDelay) {
  console.log(`restart with delay ${delay}...`.cyan)
  await closeAltv()
  await waitAsync(delay)
  startAltv()
}

function startAltv () {
  console.log('start altv...'.green)

  const args = altvArgs.filter(v => typeof v === 'string')
  console.log('spawn altv.exe args:', args)

  spawnAltv({
    args,
    onExit: config.restartOnGameCrash ? watchGameCrash : null,
  })
}

function spawnAltv (spawnProcessOptions) {
  console.log('spawn altv.exe...')
  spawnProcess(`${altvPath}\\altv.exe`, spawnProcessOptions)
}

function closeAltv () {
  console.log('close altv...'.green)

  return new Promise(resolve => {
    let processesToKill = 2

    const _resolve = resolve
    resolve = () => {
      processesToKill--
      if (processesToKill === 0) {
        _resolve()
      }
    }

    console.log('kill gta5 & altv...')

    exec('taskkill /im gta5.exe /t /f', (err, stdout, stderr) => {
      if (!err) return successKill('gta5')
      failKill('gta5')
    })

    exec('taskkill /im altv.exe /t /f', (err) => {
      if (!err) return successKill('altv')
      failKill('altv')
    })

    function successKill (info) {
      console.log('success kill:'.green, info)
      resolve()
    }

    function failKill (info) {
      // console.log('fail kill:'.red, info)
      resolve()
    }
  })
}

/**
 *
 * @param {string} path
 */
function spawnProcess (path, { args = [], onExit }) {
  const pathSplit = path.split('\\')
  const fileName = pathSplit[pathSplit.length - 1]
  const cwd = path.slice(0, path.lastIndexOf('\\'))

  // console.log('spawnProcess fileName:', fileName)
  // console.log('spawnProcess cwd:', cwd)

  const ps = spawn(fileName, args, { shell: true, cwd })

  // ps.stdout.on('data', (data) => {
  //   logProcess('stdout:', data.toString())
  // })

  ps.stderr.on('data', (data) => {
    logProcess('stderr:', data.toString())
  })

  ps.on('close', (code) => {
    if (code !== 0) {
      logProcess(`exited with code ${code}`)
    }

    onExit?.()
  })

  function logProcess (...args) {
    console.log(`[process:${fileName}]`, ...args)
  }
}

function isProcessRunning (name) {
  return new Promise(resolve => {
    exec('tasklist', (err, stdout, stderr) => {
      if (err) return // console.error('isProcessRunning', err)

      resolve(stdout.toLowerCase().indexOf(name.toLowerCase()) > -1)
    })
  })
}

async function watchGameCrash () {
  console.log('start wait for gta5.exe...')

  const result = await waitForAsync(() => isProcessRunning('gta5.exe'), 60_000)

  if (!result) return console.error('failed to wait gta5.exe')

  // console.log('gta5.exe launched, check altv client log...')

  const altvLogsPath = `${altvPath}\\logs`

  const files = syncReaddirSortTime(altvLogsPath)
  const logToWatch = getLastClientLogFileName()

  if (!logToWatch) {
    console.error(`[watchGameCrash] failed to find client log file in: ${altvLogsPath}`.red)
    return
  }

  // console.log('start watch last client log:', logToWatch)

  const clientLogWatcher = new Tail(`${altvLogsPath}\\${logToWatch}`)
    .on('line', (data) => {
      if (!data.includes(altGameCrashLogString)) return

      clientLogWatcher.unwatch()

      console.log('game crash detected -> restart game'.yellow)
      programRestart(config.restartOnGameCrashDelay)
    })

  function getLastClientLogFileName () {
    let fileName
    for (let i = (files.length - 1); i > 0; i--) {
      if (!files[i].startsWith('client')) continue
      fileName = files[i]
      break
    }
    return fileName
  }
}

function startCommandsReader () {
  const commandsReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  commandsReader.on('line', (line) => {
    let args = line.split(' ')
    const command = args[0]
    args = line.slice(1)

    switch (command) {
      case 're':
        programRestart()
        break
    }
  })
}
