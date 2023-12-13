import { useCallback, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { cn } from '../lib/utils';
import { countHits } from '../lib/tickets';

const numbers = new Array<number>(39).fill(1).map((num, iter) => num + iter);

function TicketTemplate({ selectedNumbers, winningNumbers = [], onSelect }: TicketTemplateProps): JSX.Element | null {
  return (
    <div className="max-w-max p-2 rounded-lg border border-gray-400">
      <div className="grid grid-cols-[repeat(5,32px)] gap-1">
        {numbers.map((num, i) => (
          <div
            key={`ticket-${num}-${i}`}
            className={cn('flex items-center justify-center w-8 h-8 border border-gray-900 rounded-full', {
              'bg-gray-400': selectedNumbers.includes(num),
              'bg-red-400': selectedNumbers.includes(num) && winningNumbers.includes(num),
              'cursor-pointer': selectedNumbers.length < 5,
            })}
            onClick={() => {
              if (onSelect) onSelect(num);
            }}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketTemplate;

export function NewTicket({ id, onBuyTicket, onCancelTicket }: NewTicketProps): JSX.Element | null {
  const [selection, setSelection] = useState<number[]>([]);

  const selectNumber = useCallback((num: number) => {
    setSelection(prev => {
      if (prev.includes(num)) return prev.filter(n => n !== num);
      return prev.length === 5 ? [...prev] : [...prev, num];
    });
  }, []);

  return (
    <div>
      <Typography variant="h5">{id}.</Typography>
      <div className="flex flex-col max-w-max gap-2">
        <TicketTemplate selectedNumbers={selection} onSelect={selectNumber} />
        <Button
          type="button"
          color="primary"
          variant="contained"
          disabled={selection.length !== 5}
          onClick={() => onBuyTicket([...selection].sort((a, b) => a - b) as [number, number, number, number, number])}
        >
          {selection.length === 5 ? 'Megveszem' : `Még ${5 - selection.length} db számot ki kell választanod`}
        </Button>
        <Button type="button" color="secondary" variant="outlined" onClick={() => onCancelTicket()}>
          Mégse
        </Button>
      </div>
    </div>
  );
}

export function PlayedTicket({ id, values }: PlayedTicketProps): JSX.Element | null {
  return (
    <div>
      <Typography variant="h5">{id}.</Typography>
      <TicketTemplate selectedNumbers={values} />
    </div>
  );
}

export function WinningTicket({ type, values, winner }: WinningTicketProps): JSX.Element | null {
  const hits = useMemo(() => countHits(values, winner, 2), [values, winner]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>{type}</div>
        <div>találat: {hits}</div>
      </div>
      <TicketTemplate selectedNumbers={values} winningNumbers={winner} />
      <Typography variant="h6">Nyeremény: {hits * 100}</Typography>
    </div>
  );
}

export type TicketTemplateProps = {
  selectedNumbers: number[];
  winningNumbers?: number[];
  onSelect?: (value: number) => void;
};

export type NewTicketProps = {
  id: number;
  onBuyTicket: (values: [number, number, number, number, number]) => void;
  onCancelTicket: () => void;
};

export type PlayedTicketProps = {
  id: number;
  values: number[];
};

export type WinningTicketProps = {
  type: string;
  values: number[];
  winner: number[];
};
