import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import useMaintainer, { Maintainer } from '../hooks/useMaintainer';
import TicketTemplate from '../components/TicketTemplate';
import Statistics from '../components/Statistics';
import { collectPlayerProfit, collectPrize, createTicket } from '../lib/tickets';
import cloneDeep from 'lodash.clonedeep';

function MaintainerPage(): JSX.Element | null {
  const { maintainer, generateTickets, updateTickets, updateBudgets } = useMaintainer();

  return (
    <div>
      {maintainer.tickets.length === 0 ? (
        <NewMaintainer onCreate={generateTickets} />
      ) : (
        <ActiveMaintainer {...maintainer} onUpdate={updateTickets} onLottery={updateBudgets} />
      )}
    </div>
  );
}

export default MaintainerPage;

function NewMaintainer({ onCreate }: NewMaintainerProps): JSX.Element | null {
  const [count, setCount] = useState<number>(1);

  const setValue = useCallback((value: number) => {
    if (value < 1) return;
    setCount(value);
  }, []);

  return (
    <form
      className="p-2 flex items-baseline justify-center"
      onSubmit={e => {
        e.preventDefault();
        onCreate(count);
      }}
    >
      <FormGroup>
        <FormControl>
          <InputLabel htmlFor="count">Generált szelvények (darabszám)</InputLabel>
          <Input id="count" name="count" type="number" value={count} onChange={e => setValue(+e.target.value)} />
        </FormControl>
      </FormGroup>
      <Button type="submit" color="primary" variant="text">
        Start
      </Button>
    </form>
  );
}

function ActiveMaintainer({ tickets, budget, onUpdate, onLottery }: ActiveMaintainerProps): JSX.Element | null {
  const ticketsCopy = useMemo(() => cloneDeep(tickets), [tickets]);
  const [winningTicket, setWinningTicket] = useState<number[]>([]);
  const [showStats, setShowStats] = useState<boolean>(false);

  useEffect(() => {
    if (onUpdate) onUpdate();
  }, [onUpdate]);

  return (
    <div className="p-4">
      <div>
        <div className="flex items-center gap-8">
          <Typography variant="h6">Egyenleg: {budget}</Typography>
          <Button
            type="button"
            color="primary"
            variant="contained"
            onClick={() => {
              const winner = createTicket();
              setWinningTicket(winner);
              setShowStats(true);
              if (onLottery) {
                const playerProfit = collectPlayerProfit(ticketsCopy, winner);
                const maintainerLoss = collectPrize(ticketsCopy, winner);
                onLottery(playerProfit, maintainerLoss);
              }
            }}
          >
            Húzás indítása
          </Button>
        </div>
        {winningTicket.length !== 0 && (
          <div className="flex items-center gap-8">
            <Typography variant="h6">Nyertes számok: {winningTicket.toString()}</Typography>
          </div>
        )}
      </div>
      <div className="my-4 h-px bg-gray-200 rounded-full"></div>
      <div className="flex flex-col gap-2">
        <Typography variant="h5">Szelvények</Typography>
        <div className="flex flex-wrap items-baseline gap-4">
          {ticketsCopy.map((ticket, ticketIdx) => (
            <div key={`ticket-${ticketIdx}`}>
              <div>{ticket.type}</div>
              <TicketTemplate selectedNumbers={ticket.values} winningNumbers={winningTicket} />
            </div>
          ))}
        </div>
      </div>
      {showStats && (
        <>
          <div className="my-4 h-px bg-gray-200 rounded-full"></div>
          <Statistics tickets={ticketsCopy} winner={winningTicket} />
        </>
      )}
    </div>
  );
}

type NewMaintainerProps = { onCreate: (count: number) => void };
type ActiveMaintainerProps = Maintainer & { onUpdate?: () => void; onLottery?: (profit: number, loss: number) => void };
