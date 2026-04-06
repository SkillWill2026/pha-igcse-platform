import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import { config as dotenvConfig } from 'dotenv'

// The system environment has ANTHROPIC_API_KEY="" which Next.js cannot override.
// Force-load .env.local so our key wins regardless of the OS environment.
dotenvConfig({ path: path.resolve(process.cwd(), '.env.local'), override: true })

/** Server-only — call inside request handlers, never at module level */
export function createAnthropicClient() {
  const apiKey = process.env['ANTHROPIC_API_KEY']
  return new Anthropic({ apiKey })
}
