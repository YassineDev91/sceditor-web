import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { exec } from 'node:child_process'
import { ANCHOR_TOML, PROGRAM_CARGO_TOML } from './templates/solana-anchor-toml.js'

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
  const dir = await mkdtemp(path.join(tmpdir(), 'solana-verify-'))
  try {
    const programDir = path.join(dir, 'programs', 'contract')
    const srcDir = path.join(programDir, 'src')
    await mkdir(srcDir, { recursive: true })
    await writeFile(path.join(dir, 'Anchor.toml'), ANCHOR_TOML)
    await writeFile(path.join(programDir, 'Cargo.toml'), PROGRAM_CARGO_TOML)
    await writeFile(path.join(srcDir, 'lib.rs'), code)
    await runCommand('anchor build', { cwd: dir })
    return { success: true, errors: null }
  } catch (error) {
    return { success: false, errors: error.stderr || error.message }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}
