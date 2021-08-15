import fs from 'fs'

export const waitAsync = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const waitForAsync = async (
  cb,
  maxWaitMs = 5000,
) => {
  let waitedMs = 0
  let returned

  do {
    const start = +new Date()
    returned = await waitHandler()
    waitedMs += (+new Date()) - start
  } while (returned == null)

  return returned

  async function waitHandler () {
    try {
      if (await cb()) {
        return true
      } else if (waitedMs > maxWaitMs) {
        return false
      }
    } catch (e) {
      console.error('[waitFor] error:')
      console.error(e.stack)
      return false
    }
  }
}

export function syncReaddirSortTime (dir) {
  return (
    fs.readdirSync(dir)
      .map(name => ({
        name,
        time: fs.statSync(`${dir}/${name}`).mtime.getTime(),
      }))
      .sort((a, b) => (a.time - b.time))
      .map(f => f.name)
  )
}
