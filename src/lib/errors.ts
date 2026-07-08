/**
 * Next.js implements `redirect()` and `notFound()` by throwing a special
 * error carrying a `digest`. When we wrap server code in try/catch to handle
 * database failures gracefully, we must re-throw these control-flow errors so
 * Next.js can still perform the redirect / 404 as intended.
 */
export function isNextControlFlowError(error: unknown): boolean {
  const digest = (error as { digest?: unknown })?.digest
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") || digest === "NEXT_NOT_FOUND")
  )
}
