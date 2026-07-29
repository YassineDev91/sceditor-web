import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exec } from 'node:child_process'
import path from 'node:path'

vi.mock('node:child_process', () => ({ exec: vi.fn() }))
vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises')
  return {
    ...actual,
    mkdtemp: vi.fn(async () => '/tmp/solana-verify-fake'),
    mkdir: vi.fn(async () => {}),
    writeFile: vi.fn(async () => {}),
    rm: vi.fn(async () => {}),
  }
})

const { compile } = await import('./solana.js')
const { mkdir, writeFile, rm } = await import('node:fs/promises')

describe('solana adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reports success when anchor build exits cleanly', async () => {
    exec.mockImplementation((command, options, callback) => {
      callback(null, 'Compiling contract v0.1.0\nBuild success', '')
    })
    const result = await compile('#[program] mod contract { }')
    expect(result.success).toBe(true)
    expect(result.errors).toBeNull()
  })

  it('reports failure with stderr when anchor build fails', async () => {
    exec.mockImplementation((command, options, callback) => {
      const error = new Error('Command failed')
      callback(error, '', 'error[E0433]: failed to resolve')
    })
    const result = await compile('not valid rust')
    expect(result.success).toBe(false)
    expect(result.errors).toContain('E0433')
  })

  it('always cleans up the temp directory, even on failure', async () => {
    exec.mockImplementation((command, options, callback) => {
      callback(new Error('fail'), '', 'boom')
    })
    await compile('bad code')
    expect(rm).toHaveBeenCalledWith('/tmp/solana-verify-fake', { recursive: true, force: true })
  })

  it('scaffolds the nested programs/contract/src directory before writing files', async () => {
    exec.mockImplementation((command, options, callback) => {
      callback(null, 'ok', '')
    })
    await compile('#[program] mod contract { }')
    expect(mkdir).toHaveBeenCalledWith(
      expect.stringContaining(path.join('programs', 'contract', 'src')),
      { recursive: true }
    )
    const writtenPaths = writeFile.mock.calls.map((call) => call[0])
    expect(writtenPaths.some((p) => p.endsWith('Anchor.toml'))).toBe(true)
    expect(writtenPaths.some((p) => p.endsWith('Cargo.toml'))).toBe(true)
    expect(writtenPaths.some((p) => p.endsWith('lib.rs'))).toBe(true)
  })

  it('runs anchor build scoped to the scaffolded workspace root', async () => {
    exec.mockImplementation((command, options, callback) => {
      expect(command).toContain('anchor build')
      expect(options.cwd).toBe('/tmp/solana-verify-fake')
      callback(null, 'ok', '')
    })
    await compile('#[program] mod contract { }')
  })
})
