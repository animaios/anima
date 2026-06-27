import { describe, expect, it } from 'vitest'

import { buildPatternDisruptorSupplement } from './injector'

describe('buildPatternDisruptorSupplement', () => {
  it('returns an empty supplement when disabled', () => {
    const result = buildPatternDisruptorSupplement({
      settings: { enabled: false },
      userMessage: 'tell me about the garden',
    })

    expect(result.text).toBe('')
    expect(result.words).toEqual([])
    expect(result.metadata.randomWordsEnabled).toBe(false)
  })

  it('injects random words while respecting blacklist and history', () => {
    const result = buildPatternDisruptorSupplement({
      settings: {
        enabled: true,
        randomWords: {
          enabled: true,
          mode: 'random',
          wordCount: 3,
          blacklist: ['aurora'],
        },
        synonyms: { enabled: false },
      },
      userMessage: 'tell me something new',
      wordHistory: ['lantern'],
      random: () => 0,
    })

    expect(result.words).toHaveLength(3)
    expect(result.words).not.toContain('aurora')
    expect(result.words).not.toContain('lantern')
    expect(result.text).toContain('NARRATIVE OVERDRIVE')
  })

  it('uses contextual associations when the user message has a synonym anchor', () => {
    const result = buildPatternDisruptorSupplement({
      settings: {
        enabled: true,
        randomWords: {
          enabled: true,
          mode: 'contextual',
          wordCount: 2,
        },
        synonyms: { enabled: false },
      },
      userMessage: 'the garden feels quiet tonight',
      random: () => 0,
    })

    expect(result.words.length).toBeGreaterThan(0)
    expect(['moss', 'harvest', 'lantern', 'ripple']).toContain(result.words[0])
  })

  it('adds synonym freshness rows from repeated assistant wording', () => {
    const result = buildPatternDisruptorSupplement({
      settings: {
        enabled: true,
        randomWords: { enabled: false },
        synonyms: {
          enabled: true,
          minOccurrences: 3,
          topN: 2,
        },
      },
      userMessage: 'keep going',
      assistantMessages: ['nice nice nice and bright', 'nice work, bright bright bright'],
    })

    expect(result.synonymRows.map((row) => row.normalizedWord)).toEqual(expect.arrayContaining(['nice', 'bright']))
    expect(result.text).toContain('WORD FRESHNESS')
    expect(result.text).toContain('pleasant')
  })
})
