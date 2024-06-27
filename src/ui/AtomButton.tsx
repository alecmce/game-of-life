import { Button, GridItem } from '@chakra-ui/react';
import { WritableAtom, useAtom } from 'jotai';
import { ReactNode } from 'react';


interface Props {
  atom:     WritableAtom<unknown, [], void>;
  children: ReactNode | ReactNode[]
}

export function AtomButton(props: Props): ReactNode {
  const { atom, children } = props;

  const [, trigger] = useAtom(atom)

  return (
    <GridItem className="atom-ui-row" colSpan={2}>
      <Button size="xs" className="atom-ui-button" onClick={trigger}>{ children }</Button>
    </GridItem>
  )
}
