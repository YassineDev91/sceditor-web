import { exec } from 'node:child_process'

export function runCommand(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 300_000, maxBuffer: 10 * 1024 * 1024, ...options }, (error, stdout, stderr) => {
      if (error) {
        reject(Object.assign(error, { stdout, stderr }))
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}
