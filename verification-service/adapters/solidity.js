import solc from 'solc'

export async function compile(code) {
  const input = {
    language: 'Solidity',
    sources: { 'Contract.sol': { content: code } },
    settings: { outputSelection: { '*': { '*': ['*'] } } },
  }
  const output = JSON.parse(solc.compile(JSON.stringify(input)))
  const errors = (output.errors || []).filter((e) => e.severity === 'error')

  if (errors.length > 0) {
    return { success: false, errors: errors.map((e) => e.formattedMessage).join('\n') }
  }

  return { success: true, errors: null }
}
