import type {
  PatternDisruptorLanguage,
  PatternDisruptorPartOfSpeechCode,
  PatternDisruptorPartOfSpeechName,
  ResolvedPatternDisruptorLanguage,
} from '../types'

const CYRILLIC_RE = /[\u0400-\u04FF]/
const WORD_RE = /[\p{L}][\p{L}'-]*/gu

const STOPWORDS: Record<ResolvedPatternDisruptorLanguage, Set<string>> = {
  en: new Set([
    'about',
    'after',
    'again',
    'also',
    'and',
    'are',
    'because',
    'been',
    'but',
    'can',
    'could',
    'for',
    'from',
    'have',
    'into',
    'just',
    'like',
    'more',
    'not',
    'now',
    'that',
    'the',
    'their',
    'then',
    'there',
    'this',
    'was',
    'were',
    'with',
    'you',
    'your',
  ]),
  ru: new Set([
    'без',
    'был',
    'была',
    'были',
    'быть',
    'вам',
    'вас',
    'все',
    'для',
    'его',
    'если',
    'есть',
    'как',
    'когда',
    'мне',
    'может',
    'над',
    'она',
    'они',
    'оно',
    'при',
    'про',
    'так',
    'там',
    'тебя',
    'тем',
    'что',
    'это',
  ]),
}

export const PART_OF_SPEECH_CODE_BY_NAME: Record<PatternDisruptorPartOfSpeechName, PatternDisruptorPartOfSpeechCode> = {
  noun: 'n',
  verb: 'v',
  adjective: 'a',
  adverb: 'r',
}

export function detectPatternDisruptorLanguage(text: string): ResolvedPatternDisruptorLanguage {
  return CYRILLIC_RE.test(text) ? 'ru' : 'en'
}

export function resolvePatternDisruptorLanguage(
  language: PatternDisruptorLanguage,
  userMessage: string,
): ResolvedPatternDisruptorLanguage {
  if (language === 'auto') return detectPatternDisruptorLanguage(userMessage)
  return language
}

export function tokenizeWords(text: string): string[] {
  return text.match(WORD_RE)?.map((token) => token.toLowerCase()) ?? []
}

export function normalizeToken(token: string, language: ResolvedPatternDisruptorLanguage): string {
  const lower = token.toLowerCase().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')
  if (language === 'ru') return lower

  const withoutContraction = lower.replace(/'(s|re|ve|ll|d)$/u, '')
  if (withoutContraction.endsWith('ies') && withoutContraction.length > 4) return `${withoutContraction.slice(0, -3)}y`
  if (withoutContraction.endsWith('ing') && withoutContraction.length > 6) return withoutContraction.slice(0, -3)
  if (withoutContraction.endsWith('ed') && withoutContraction.length > 5) return withoutContraction.slice(0, -2)
  if (withoutContraction.endsWith('ly') && withoutContraction.length > 5) return withoutContraction.slice(0, -2)
  if (
    withoutContraction.endsWith('s') &&
    withoutContraction.length > 4 &&
    !withoutContraction.endsWith('ss') &&
    !withoutContraction.endsWith('us') &&
    !withoutContraction.endsWith('ous')
  ) {
    return withoutContraction.slice(0, -1)
  }

  return withoutContraction
}

export function isStopword(token: string, language: ResolvedPatternDisruptorLanguage): boolean {
  return STOPWORDS[language].has(token)
}
