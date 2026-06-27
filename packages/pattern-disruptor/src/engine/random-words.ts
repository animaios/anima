import type {
  PatternDisruptorPartOfSpeechCode,
  PatternDisruptorSettings,
  ResolvedPatternDisruptorLanguage,
  SynonymMap,
  WordBankEntry,
} from '../types'

import { getSynonymMap } from '../data/synonyms'
import { getWordBank } from '../data/words'
import {
  isStopword,
  normalizeToken,
  PART_OF_SPEECH_CODE_BY_NAME,
  resolvePatternDisruptorLanguage,
  tokenizeWords,
} from '../data/language'

interface GenerateRandomWordsInput {
  settings: PatternDisruptorSettings
  userMessage: string
  wordHistory?: Iterable<string>
  random?: () => number
}

function pick<T>(items: T[], random: () => number): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(random() * items.length)]
}

function sampleWithoutReplacement<T>(items: T[], count: number, random: () => number): T[] {
  const pool = [...items]
  const selected: T[] = []
  while (pool.length > 0 && selected.length < count) {
    const index = Math.floor(random() * pool.length)
    const [item] = pool.splice(index, 1)
    selected.push(item)
  }
  return selected
}

function selectedPartOfSpeechCodes(settings: PatternDisruptorSettings): Set<PatternDisruptorPartOfSpeechCode> {
  const codes = new Set<PatternDisruptorPartOfSpeechCode>()
  for (const [name, enabled] of Object.entries(settings.randomWords.partsOfSpeech)) {
    if (enabled) codes.add(PART_OF_SPEECH_CODE_BY_NAME[name as keyof typeof PART_OF_SPEECH_CODE_BY_NAME])
  }
  return codes
}

function normalizeWordSet(words: Iterable<string> | undefined): Set<string> {
  return new Set(Array.from(words ?? []).map((word) => word.toLowerCase()))
}

function filterWordBank(input: {
  bank: WordBankEntry[]
  settings: PatternDisruptorSettings
  history: Set<string>
}): WordBankEntry[] {
  const partsOfSpeech = selectedPartOfSpeechCodes(input.settings)
  const blacklist = normalizeWordSet(input.settings.randomWords.blacklist)
  const exactLength = input.settings.randomWords.wordLength

  return input.bank.filter(([word, partOfSpeech]) => {
    const lower = word.toLowerCase()
    if (blacklist.has(lower) || input.history.has(lower)) return false
    if (partsOfSpeech.size > 0 && !partsOfSpeech.has(partOfSpeech)) return false
    if (exactLength > 0 && word.length !== exactLength) return false
    return true
  })
}

function uniqueWords(words: string[], count: number, history: Set<string>, settings: PatternDisruptorSettings) {
  const blacklist = normalizeWordSet(settings.randomWords.blacklist)
  const seen = new Set<string>()
  const result: string[] = []

  for (const word of words) {
    const lower = word.toLowerCase()
    if (!word || seen.has(lower) || history.has(lower) || blacklist.has(lower)) continue
    seen.add(lower)
    result.push(word)
    if (result.length >= count) break
  }

  return result
}

function randomMode(input: { filteredBank: WordBankEntry[]; count: number; random: () => number }): string[] {
  return sampleWithoutReplacement(input.filteredBank, input.count, input.random).map(([word]) => word)
}

function collectAssociations(
  anchor: string,
  synonyms: SynonymMap,
  language: ResolvedPatternDisruptorLanguage,
): string[] {
  const normalized = normalizeToken(anchor, language)
  const entry = synonyms[normalized] ?? synonyms[anchor.toLowerCase()]
  if (!entry) return []
  return [...entry.a, ...entry.s]
}

function doublePassMode(input: {
  filteredBank: WordBankEntry[]
  count: number
  synonyms: SynonymMap
  language: ResolvedPatternDisruptorLanguage
  history: Set<string>
  settings: PatternDisruptorSettings
  random: () => number
}): string[] {
  const anchorCandidates = input.filteredBank.filter(
    ([word]) => collectAssociations(word, input.synonyms, input.language).length > 0,
  )
  const anchor = pick(anchorCandidates, input.random)?.[0]
  if (!anchor) return randomMode(input)

  const associations = sampleWithoutReplacement(
    collectAssociations(anchor, input.synonyms, input.language),
    input.count - 1,
    input.random,
  )
  const fallback = randomMode(input)
  return uniqueWords([anchor, ...associations, ...fallback], input.count, input.history, input.settings)
}

function contextualMode(input: {
  userMessage: string
  filteredBank: WordBankEntry[]
  count: number
  synonyms: SynonymMap
  language: ResolvedPatternDisruptorLanguage
  history: Set<string>
  settings: PatternDisruptorSettings
  random: () => number
}): string[] {
  const keywords = tokenizeWords(input.userMessage)
    .map((token) => normalizeToken(token, input.language))
    .filter((token) => token.length >= 4 && !isStopword(token, input.language) && Boolean(input.synonyms[token]))

  const anchor = pick(Array.from(new Set(keywords)), input.random)
  if (!anchor) return doublePassMode(input)

  const associations = sampleWithoutReplacement(
    collectAssociations(anchor, input.synonyms, input.language),
    input.count,
    input.random,
  )
  const fallback = randomMode(input)
  return uniqueWords([...associations, ...fallback], input.count, input.history, input.settings)
}

export function generateRandomWords(input: GenerateRandomWordsInput): string[] {
  if (!input.settings.enabled || !input.settings.randomWords.enabled) return []

  const random = input.random ?? Math.random
  const language = resolvePatternDisruptorLanguage(input.settings.language, input.userMessage)
  const bank = getWordBank(language)
  const synonyms = getSynonymMap(language)
  const history = normalizeWordSet(input.wordHistory)
  const filteredBank = filterWordBank({ bank, settings: input.settings, history })
  const count = input.settings.randomWords.wordCount

  if (input.settings.randomWords.mode === 'contextual') {
    return contextualMode({
      userMessage: input.userMessage,
      filteredBank,
      count,
      synonyms,
      language,
      history,
      settings: input.settings,
      random,
    })
  }

  if (input.settings.randomWords.mode === 'double-pass') {
    return doublePassMode({ filteredBank, count, synonyms, language, history, settings: input.settings, random })
  }

  return uniqueWords(randomMode({ filteredBank, count, random }), count, history, input.settings)
}
