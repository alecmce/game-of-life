import { Getter, Setter, WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export enum RULE {
  ALIVE    = 'alive',
  BORN     = 'born',
  DIE      = 'die',
  SURVIVES = 'survives',
}

const { ALIVE, BORN, DIE, SURVIVES } = RULE

type RuleBytes = 0 | 1 | 2 | 3

const BYTES_TO_RULE: Record<RuleBytes, RULE> = { 0: DIE, 1: SURVIVES, 2: BORN, 3: ALIVE }
const RULE_BYTES: Record<RULE, number> = { [DIE]: 0b00, [SURVIVES]: 0b01, [BORN]: 0b10, [ALIVE]: 0b11 }

export const CONWAYS_RULE_CODE = 'B3/S23'
export const CONWAYS_RULE = encodeRuleCode(CONWAYS_RULE_CODE)

export const NAMED_RULES = [
  { label: '(Conway\'s) Life',   value: CONWAYS_RULE_CODE },
  { label: 'Replicator',         value: 'B1357/S1357' },
  { label: 'Seeds',              value: 'B2/S' },
  { label: 'B25/S4',             value: 'B25/S4' },
  { label: '34 Life',            value: 'B34/S34' },
  { label: 'Diamoeba',           value: 'B35678/S5678' },
  { label: '2x2',                value: 'B36/S125' },
  { label: 'HighLife',           value: 'B36/S23' },
  { label: 'Day & Night',        value: 'B3678/S34678' },
  { label: 'Anneal',             value: 'B4678/S35678' },
  { label: 'Life Free Or Die',   value: 'B2/S0' },
]

export type DecodedRule = [RULE, RULE, RULE, RULE, RULE, RULE, RULE, RULE, RULE]

/** The bitwise encoded GameOfLife rule. */
export const encodedRule = atomWithStorage('gol:rule', CONWAYS_RULE)

/** A decoded rule, as an array of 9 RULE values. */
export const decodedRule = makeDecodedRule()

/** A human-readable string encoding of the Game Of Life rule. */
export const ruleCode = makeRuleCode()

function makeDecodedRule(): WritableAtom<DecodedRule, [value: DecodedRule], void> {
  return atom(getDecodedRule, setDecodedRule)

  function getDecodedRule(get: Getter): DecodedRule {
    return decodeRule(get(encodedRule))
  }

  function setDecodedRule(_: Getter, set: Setter, value: DecodedRule): void {
    set(encodedRule, encodeRule(value))
  }
}

function makeRuleCode(): WritableAtom<string, [value: string], void> {
  return atom(getRuleCode, setRuleCode)

  type Pair = [rule: RULE, index: number]

  function getRuleCode(get: Getter): string {
    const rule = get(decodedRule)

    const pairs = rule.map((value, i) => [value, i]) as Pair[]
    const born = pairs.filter(isBorn).map(getIndex).join('')
    const survives = pairs.filter(isSurvives).map(getIndex).join('')

    return `B${born}/S${survives}`
  }

  function isBorn([rule]: Pair): boolean {
    return rule === BORN || rule === ALIVE
  }

  function isSurvives([rule]: Pair): boolean {
    return rule === SURVIVES || rule === ALIVE
  }

  function getIndex([, index]: Pair): number {
    return index
  }

  function setRuleCode(_: Getter, set: Setter, code: string): void {
    set(encodedRule, encodeRuleCode(code))
  }
}

function decodeRule(encoded: number): DecodedRule {
  return [
    BYTES_TO_RULE[(encoded & 0b11) as RuleBytes],
    BYTES_TO_RULE[(encoded >> 2 & 0b11) as RuleBytes],
    BYTES_TO_RULE[(encoded >> 4 & 0b11) as RuleBytes],
    BYTES_TO_RULE[(encoded >> 6 & 0b11) as RuleBytes],
    BYTES_TO_RULE[(encoded >> 8 & 0b11) as RuleBytes],
    BYTES_TO_RULE[(encoded >> 10 & 0b11) as RuleBytes],
    BYTES_TO_RULE[(encoded >> 12 & 0b11) as RuleBytes],
    BYTES_TO_RULE[(encoded >> 14 & 0b11) as RuleBytes],
    BYTES_TO_RULE[(encoded >> 16 & 0b11) as RuleBytes],
  ]
}

function encodeRule(decoded: DecodedRule): number {
  return (
    RULE_BYTES[decoded[0]] |
    RULE_BYTES[decoded[1]] << 2 |
    RULE_BYTES[decoded[2]] << 4 |
    RULE_BYTES[decoded[3]] << 6 |
    RULE_BYTES[decoded[4]] << 8 |
    RULE_BYTES[decoded[5]] << 10 |
    RULE_BYTES[decoded[6]] << 12 |
    RULE_BYTES[decoded[7]] << 14 |
    RULE_BYTES[decoded[8]] << 16
  )
}

function encodeRuleCode(code: string): number {
  const parts = code.match(/B?(\d*)\/?S?(\d*)/)
  const born = new Set(parts ? parts[1].split('').map(Number) : [])
  const survives = new Set(parts ? parts[2].split('').map(Number) : [])
  const rule = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(getCode) as DecodedRule

  return encodeRule(rule)

  function getCode(index: number): RULE {
    const isBorn = born.has(index)
    const isSurvives = survives.has(index)

    if (isBorn) {
      return isSurvives ? ALIVE : BORN
    } else if (isSurvives) {
      return SURVIVES
    } else {
      return DIE
    }
  }
}
