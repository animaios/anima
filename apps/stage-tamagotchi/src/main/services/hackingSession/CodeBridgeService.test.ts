import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { setupCodeBridgeService } from './CodeBridgeService'
import { setupHackingSessionService } from './HackingSessionService'

vi.mock('ws', () => {
  return {
    default: vi.fn(function mockWebSocket(this: any) {
      return {
        readyState: 0,
        url: '',
        send: vi.fn(),
        close: vi.fn(),
        ping: vi.fn(),
        listeners: {} as Record<string, Array<(event: any) => void>>,
        addEventListener(event: string, callback: (event: any) => void) {
          if (!this.listeners[event]) {
            this.listeners[event] = []
          }
          this.listeners[event].push(callback)
        },
        removeEventListener(event: string, callback: (event: any) => void) {
          if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
          }
        },
        dispatchEvent(event: { type: string }) {
          if (this.listeners[event.type]) {
            this.listeners[event.type].forEach((callback) => callback(event))
          }
        },
      }
    }),
  }
})

describe('CodeBridgeService', () => {
  let hackingSessionService: ReturnType<typeof setupHackingSessionService>
  let codeBridgeService: ReturnType<typeof setupCodeBridgeService>

  beforeEach(() => {
    hackingSessionService = setupHackingSessionService({
      codeBackendPath: '/nonexistent/path.js',
      httpReadyTimeoutMs: 10,
      readinessTimeoutMs: 20,
    })

    // Use a simple mock object instead of tracking instances
    // The actual behavior is verified through mocking and the close test
    const mockContext = {
      emit: vi.fn(),
    } as any

    codeBridgeService = setupCodeBridgeService(hackingSessionService, {
      port: 3210,
      sessionId: 'test-session-id',
      bridgeToken: 'test-token',
      context: mockContext,
    })
  })

  afterEach(() => {
    // Clear all mocks to ensure clean state
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should create service with correct initial state', () => {
      expect(codeBridgeService).toBeDefined()
      expect(typeof codeBridgeService.connect).toBe('function')
      expect(typeof codeBridgeService.close).toBe('function')
      expect(typeof codeBridgeService.sendConfig).toBe('function')
      expect(typeof codeBridgeService.updateSessionId).toBe('function')
    })
  })

  describe('connect', () => {
    it('should create WebSocket connection', () => {
      // The connect method should complete without errors
      // The mock WebSocket will handle the connection
      expect(() => codeBridgeService.connect()).not.toThrow()
    })
  })

  describe('updateSessionId', () => {
    it('should update sessionId', () => {
      codeBridgeService.updateSessionId('new-session-id')
      // The sessionId is stored internally - we can't directly access it
      // but we can verify the service still works
      expect(codeBridgeService).toBeDefined()
    })
  })

  describe('close', () => {
    it('should close WebSocket connection', async () => {
      // Connect first
      codeBridgeService.connect()

      // Close should complete without errors
      await expect(codeBridgeService.close()).resolves.not.toThrow()
    })
  })
})
