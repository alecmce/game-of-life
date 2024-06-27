import { GridItem, Text } from '@chakra-ui/react'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { ReactNode } from 'react'
import { RULE, decodedRule } from '../state/rule'
import './atom-gol-ui.css'


export function AtomGameOfLifeRule(): ReactNode {
  const [value, setValue] = useAtom(decodedRule)

  return (
    <>
      <GridItem className="atom-ui-cell" colSpan={1}>
        <Text fontSize="sm">Rule</Text>
      </GridItem>
      <GridItem className="atom-ui-cell" colSpan={1}>
        <div className="atom-gol-rules">
          <div className="atom-gol-rule-pair">
            <Text className="atom-gol-rule-label" fontSize="xs">B</Text>
            <Text className="atom-gol-rule-label" fontSize="xs">S</Text>
          </div>
          <RuleAtomButton neighbors={0} rule={value[0]} setRule={setRule} />
          <RuleAtomButton neighbors={1} rule={value[1]} setRule={setRule} />
          <RuleAtomButton neighbors={2} rule={value[2]} setRule={setRule} />
          <RuleAtomButton neighbors={3} rule={value[3]} setRule={setRule} />
          <RuleAtomButton neighbors={4} rule={value[4]} setRule={setRule} />
          <RuleAtomButton neighbors={5} rule={value[5]} setRule={setRule} />
          <RuleAtomButton neighbors={6} rule={value[6]} setRule={setRule} />
          <RuleAtomButton neighbors={7} rule={value[7]} setRule={setRule} />
          <RuleAtomButton neighbors={8} rule={value[8]} setRule={setRule} />
        </div>
      </GridItem>
    </>
  )

  function setRule(neighbors: number, ruleValue: RULE): void {
    const newRule = produce(value, draft => {
      draft[neighbors] = ruleValue
    })
    setValue(newRule)
  }
}


interface RuleAtomButtonProps {
  neighbors: number
  rule:      RULE
  setRule:   (neighbors: number, rule: RULE) => void
}

function RuleAtomButton(props: RuleAtomButtonProps): ReactNode {
  const { neighbors, rule, setRule } = props

  const born = rule === RULE.BORN || rule === RULE.ALIVE
  const survives = rule === RULE.SURVIVES || rule === RULE.ALIVE

  return (
    <div className="atom-gol-rule-pair">
    <div className={`atom-gol-rule-button born ${born ? 'on' : 'off'}`} onClick={onBornClick}>
      { neighbors }
    </div>
    <div className={`atom-gol-rule-button survives ${survives ? 'on' : 'off'}`} onClick={onSurviesClick}>
      { neighbors }
    </div>
    </div>
  )

  function onBornClick(): void {
    switch (rule) {
      case RULE.DIE:      return setRule(neighbors, RULE.BORN)
      case RULE.BORN:     return setRule(neighbors, RULE.DIE)
      case RULE.SURVIVES: return setRule(neighbors, RULE.ALIVE)
      case RULE.ALIVE:    return setRule(neighbors, RULE.SURVIVES)
    }
  }

  function onSurviesClick(): void {
    switch (rule) {
      case RULE.DIE:      return setRule(neighbors, RULE.SURVIVES)
      case RULE.BORN:     return setRule(neighbors, RULE.ALIVE)
      case RULE.SURVIVES: return setRule(neighbors, RULE.DIE)
      case RULE.ALIVE:    return setRule(neighbors, RULE.BORN)
    }
  }
}
