import { createStore } from "jotai";
import { describe, expect, it } from "vitest";
import { RULE, decodedRule, encodedRule } from "./rule";

const { DIE, SURVIVES: PERSIST, BORN: ALIVE } = RULE

describe('encodeRule', () => {
  it('encodes the rule', () => {
    const store = createStore()
    store.set(decodedRule, [DIE, DIE, PERSIST, ALIVE, DIE, ALIVE, ALIVE, PERSIST, DIE])
    const value = store.get(encodedRule)

    expect(value).toEqual(0b00_01_10_10_00_10_01_00_00)
  })

  it('encodes a different rule', () => {
    const store = createStore()
    store.set(decodedRule, [PERSIST, DIE, PERSIST, ALIVE, DIE, DIE, ALIVE, PERSIST, ALIVE])
    const value = store.get(encodedRule)

    expect(value).toEqual(0b10_01_10_00_00_10_01_00_01)
  })
})

describe('decodeRule', () => {
  it('decodes a rule', () => {
    const store = createStore()
    store.set(encodedRule, 0b00_01_10_10_00_10_01_00_00)
    const value = store.get(decodedRule)

    expect(value[0]).toEqual(RULE.DIE)
    expect(value[1]).toEqual(RULE.DIE)
    expect(value[2]).toEqual(RULE.SURVIVES)
    expect(value[3]).toEqual(RULE.BORN)
    expect(value[4]).toEqual(RULE.DIE)
    expect(value[5]).toEqual(RULE.BORN)
    expect(value[6]).toEqual(RULE.BORN)
    expect(value[7]).toEqual(RULE.SURVIVES)
    expect(value[8]).toEqual(RULE.DIE)
  })
})
