import { Button, GridItem, Text } from '@chakra-ui/react';
import { WritableAtom, useAtom } from 'jotai';
import { ReactNode } from 'react';

interface Props<T> {
  atom:    WritableAtom<T, [value: T], void>;
  label:   string
  options: Option<T>[]
}

interface Option<T> {
  label: ReactNode;
  value: T;
}

export function AtomButtonGroup<T>(props: Props<T>): ReactNode {
  const { atom, label, options } = props;

  const [currentValue, setValue] = useAtom(atom)

  return (
    <>
      <GridItem className="atom-ui-cell" colSpan={1}>
        <Text fontSize='sm'>{ label }</Text>
      </GridItem>
      <GridItem className="atom-ui-cell atom-ui-button-group" colSpan={1}>
        {
          options.map(({ label ,value }, i) => (
            <Button
              className="atom-ui-button"
              key={i}
              onClick={() => setValue(value)}
              size="xs"
              variant={value === currentValue ? 'solid' : 'outline'}
            >
              { label }
            </Button>
          ))
        }
      </GridItem>
    </>
  )
}
