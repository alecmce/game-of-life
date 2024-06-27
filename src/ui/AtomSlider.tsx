import { GridItem, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import { WritableAtom, useAtom } from 'jotai';
import { ReactNode, useEffect, useState } from 'react';
import { isDefined } from '../lib/object';


interface Props {
  atom:       WritableAtom<number, [value: number], void>;
  disabled?:  boolean;
  label:      string
  max?:       number;
  min?:       number;
  step?:      number
  debug?:     true
  precision?: number
}

export function AtomSlider(props: Props): ReactNode {
  const { atom, disabled = false, label, min = 0, max = 100, precision, step } = props;

  const [value, setValue] = useAtom(atom)

  // This block makes the atom slider optimistic, to account for debouncing (like scale).
  const [inner, setInner] = useState(value)
  useEffect(() => {
    setInner(value)
  }, [value, setInner])

  const valueLabel = isDefined(precision) ? inner.toFixed(precision) : inner.toString()

  return (
    <>
      <GridItem className="atom-ui-cell" colSpan={1}>
        <Text fontSize="sm">{ label }</Text>
      </GridItem>
      <GridItem className="atom-ui-cell atom-ui-control" colSpan={1}>
        <Text fontSize="xs" color={value === inner ? '' : 'tomato'}>{ valueLabel }</Text>
        <Slider
          className="atom-ui-slider"
          value={inner}
          isDisabled={disabled}
          max={max}
          min={min}
          step={step}
          onChange={onChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </GridItem>
    </>
  )

  function onChange(value: number): void {
    setInner(value)
    setValue(value)
  }
}
