import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exec } from 'node:child_process'

vi.mock('node:child_process', () => ({ exec: vi.fn() }))
vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises')
  return {
    ...actual,
    mkdtemp: vi.fn(async () => '/tmp/ink-verify-fake'),
    writeFile: vi.fn(async () => {}),
    rm: vi.fn(async () => {}),
  }
})

const { compile } = await import('./ink.js')
const { writeFile, rm } = await import('node:fs/promises')

describe('ink adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reports success when cargo contract build exits cleanly', async () => {
    exec.mockImplementation((command, options, callback) => {
      callback(null, 'Compiling contract v0.1.0\nBuild completed', '')
    })
    const result = await compile('#[ink::contract] mod contract { }')
    expect(result.success).toBe(true)
    expect(result.errors).toBeNull()
  })

  it('reports failure with stderr when cargo contract build fails', async () => {
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
    expect(rm).toHaveBeenCalledWith('/tmp/ink-verify-fake', { recursive: true, force: true })
  })

  it('writes the generated code and scaffolded Cargo.toml before compiling', async () => {
    exec.mockImplementation((command, options, callback) => {
      callback(null, 'ok', '')
    })
    await compile('#[ink::contract] mod contract { }')
    const writtenPaths = writeFile.mock.calls.map((call) => call[0])
    expect(writtenPaths.some((p) => p.endsWith('Cargo.toml'))).toBe(true)
    expect(writtenPaths.some((p) => p.endsWith('lib.rs'))).toBe(true)
  })

  it('runs cargo contract build scoped to the scaffolded directory', async () => {
    exec.mockImplementation((command, options, callback) => {
      expect(command).toContain('cargo contract build')
      expect(options.cwd).toBe('/tmp/ink-verify-fake')
      callback(null, 'ok', '')
    })
    await compile('#[ink::contract] mod contract { }')
  })
})
