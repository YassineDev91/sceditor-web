import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { exec } from 'node:child_process'
import { CARGO_TOML } from './templates/ink-cargo-toml.js'

function runCommand(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(Object.assign(error, { stdout, stderr }))
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

export async function compile(code) {
  const dir = await mkdtemp(path.join(tmpdir(), 'ink-verify-'))
  try {
    await writeFile(path.join(dir, 'Cargo.toml'), CARGO_TOML)
    await writeFile(path.join(dir, 'lib.rs'), code)
    await runCommand('cargo contract build --manifest-path Cargo.toml', { cwd: dir })
    return { success: true, errors: null }
  } catch (error) {
    return { success: false, errors: error.stderr || error.message }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}
