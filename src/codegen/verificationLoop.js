export async function runVerificationLoop({ language, buildPrompt, buildFixPrompt, generate, verify, maxAttempts = 3 }) {
  const attempts = []
  let prompt = buildPrompt()

  for (let attemptNumber = 1; attemptNumber <= maxAttempts; attemptNumber++) {
    let code
    try {
      code = await generate(prompt)
    } catch (error) {
      return { success: false, code: null, attempts, finalError: `Code generation failed: ${error.message}` }
    }

    let verifyResult
    try {
      verifyResult = await verify(language, code)
    } catch (error) {
      return { success: false, code, attempts, finalError: `Verification failed: ${error.message}` }
    }

    attempts.push({ attempt: attemptNumber, code, success: verifyResult.success, errors: verifyResult.errors })

    if (verifyResult.success) {
      return { success: true, code, attempts, finalError: null }
    }

    prompt = buildFixPrompt(code, verifyResult.errors)
  }

  const last = attempts[attempts.length - 1]
  return { success: false, code: last.code, attempts, finalError: last.errors }
}
