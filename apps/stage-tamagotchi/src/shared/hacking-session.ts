/**
 * Type definitions and data models for Hacking Mode integration.
 *
 * These interfaces define the core data structures used by HackingSessionService
 * and related components. They represent the canonical shape of the state machine,
 * activation parameters, and summary messages.
 *
 * Use when:
 * - Implementing HackingSessionService state management
 * - Defining internal service state and methods
 * - Working with summary messages from Code_Backend
 *
 * Expects:
 * - sessionId is ephemeral (UUID v4), never persisted to disk
 * - State transitions follow 4-state FSM: inactive → starting → active → failed
 * - All messages are tagged with sessionId for correlation and validation
 *
 * **Note:** For IPC payload types and Eventa contracts, see `shared/ipc/hackingSession.ts`
 */

/**
 * Hacking Session state machine values.
 *
 * - `inactive` — No Code_Process running, sessionId null
 * - `starting` — Process spawning, progressing through readiness tiers
 * - `active` — Fully operational, WebView mounted, WebSocket connected
 * - `failed` — Error occurred, teardown completed, retry available
 */
export type HackingSessionState = 'inactive' | 'starting' | 'active' | 'failed'

/**
 * Code mode selection for the Code module.
 */
export type CodeMode = 'spec' | 'vibe' | 'boss' | 'ask' | 'debug'

/**
 * Provider configuration for Code module.
 */
export interface ProviderConfig {
  /** Provider name (e.g., 'anthropic', 'openai', 'gemini') */
  name: string
  /** API key or authentication token */
  apiKey: string
  /** Optional custom API base URL */
  baseUrl?: string
  /** Model identifier (e.g., 'claude-3-5-sonnet-20241022') */
  model?: string
  /** Sampling temperature (0.0 - 1.0) */
  temperature?: number
  /** Maximum tokens to generate */
  maxTokens?: number
}

/**
 * Configuration parameters for activating Hacking Mode.
 */
export interface ActivationConfig {
  /** Code module operating mode */
  codeMode?: CodeMode
  /** LLM provider configuration mapped from AIRI settings */
  providerConfig?: ProviderConfig
}

/**
 * Process runtime information.
 */
export interface ProcessInfo {
  /** Process ID of the Code_Backend child process */
  pid: number
  /** Dynamically assigned port number for Code_Backend HTTP/WebSocket server */
  port: number
}

/**
 * Canonical state object owned by HackingSessionService representing
 * the current integration state of the Code module within AIRI.
 */
export interface HackingSessionStatePayload {
  /** Unique session identifier (UUID v4). Null when inactive or after teardown. */
  sessionId: string | null
  /** Current state in the finite state machine */
  state: HackingSessionState
  /** Code_Process runtime information. Only present in starting/active states. */
  processInfo?: ProcessInfo
  /** Human-readable error message describing why activation failed. */
  lastError?: string
}

/**
 * Summary message emitted by Code_Backend via WebSocket bridge.
 */
export interface SummaryMessage {
  /** Message type discriminator */
  type: 'summary'
  /** Session identifier for correlation and validation */
  sessionId: string
  /** Human-readable summary text for TTS narration */
  text: string
  /** Execution context metadata */
  metadata: {
    /** Code mode that generated this summary */
    mode: string
    /** LLM model identifier */
    model: string
    /** Total tokens consumed during execution */
    tokens: number
  }
}
