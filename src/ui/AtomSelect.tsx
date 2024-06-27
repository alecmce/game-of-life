import { GridItem, Select, Text } from '@chakra-ui/react';
import { WritableAtom, useAtom } from 'jotai';
import { ChangeEvent, ReactNode, useMemo } from 'react';

interface Props<T> {
  atom:           WritableAtom<T, [value: T], void>;
  defaultLabel?:  ReactNode
  disabled?:      boolean;
  label:          string
  options:        Option<T>[]
}

interface Option<T> {
  label: ReactNode;
  value: T;
}

export function AtomSelect<T>(props: Props<T>): ReactNode {
  const { atom, defaultLabel, disabled = false, label, options } = props;

  const [value, setValue] = useAtom(atom)

  const { selectOptions, stringToValue, valueToString } = useProcesedOptions(options)

  const selectValue = valueToString.get(value)
  const renderedOptions = !selectValue && defaultLabel
      ? [...selectOptions, <option key="default" value="">{ defaultLabel }</option>]
      : selectOptions

  return (
    <>
      <GridItem className="atom-ui-cell" colSpan={1}>
        <Text fontSize='sm'>{ label }</Text>
      </GridItem>
      <GridItem className="atom-ui-cell" colSpan={1}>
        <Select
          className="atom-ui-select"
          value={valueToString.get(value) ?? ''}
          isDisabled={disabled}
          onChange={onChange}
          size="xs"
        >
          { renderedOptions }
        </Select>
      </GridItem>
    </>
  )

  function onChange(event: ChangeEvent<HTMLSelectElement>): void {
    const value = stringToValue.get(event.target.value)
    if (value) {
      setValue(value)
    }
  }
}


interface ProcessedOptions<T> {
  selectOptions:  ReactNode[];
  stringToValue:  Map<string, T>;
  valueToString:  Map<T, string>;
}

function useProcesedOptions<T>(options: Option<T>[]): ProcessedOptions<T> {
  return useMemo(() => {
    const selectOptions: ReactNode[] = []
    const stringToValue = new Map<string, T>()
    const valueToString = new Map<T, string>()

    options.forEach(processOption)

    return { selectOptions, stringToValue, valueToString }

    function processOption({ label, value }: Option<T>, i: number): void {
      const key = `option-${i}`
      selectOptions.push(<option key={key} value={key}>{ label }</option>)
      stringToValue.set(key, value)
      valueToString.set(value, key)
    }
  }, [options])
}
