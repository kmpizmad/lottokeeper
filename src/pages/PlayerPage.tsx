import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import usePlayer, { Player } from '../hooks/usePlayer';
import { NewTicket, PlayedTicket } from '../components/TicketTemplate';

function PlayerPage(): JSX.Element | null {
  const { player, createPlayer, buyTicket } = usePlayer();

  return (
    <div>
      {!player.name ? <NewPlayer onCreate={createPlayer} /> : <ActivePlayer {...player} onBuyTicket={buyTicket} />}
    </div>
  );
}

export default PlayerPage;

function NewPlayer({ onCreate }: NewPlayerProps): JSX.Element | null {
  const [name, setName] = useState<string | null>(null);

  return (
    <form
      className="p-2 flex items-baseline justify-center"
      onSubmit={e => {
        e.preventDefault();
        if (name) onCreate(name);
        else setName('');
      }}
    >
      <FormGroup>
        <FormControl>
          <InputLabel htmlFor="name">Név</InputLabel>
          <Input id="name" name="name" type="text" onChange={e => setName(e.target.value)} />
          {name === '' && <FormHelperText className="text-red-600">Meg kell adnod a neved!</FormHelperText>}
        </FormControl>
      </FormGroup>
      <Button type="submit" color="primary" variant="text">
        Start
      </Button>
    </form>
  );
}

function ActivePlayer({ name, budget, tickets, onBuyTicket }: ActivePlayerProps): JSX.Element | null {
  const canBuy = useMemo(() => budget - 500 >= 0, [budget]);
  const [showEmptyTicket, setShowEmptyTicket] = useState<boolean>(false);

  return (
    <div className="p-4">
      <Typography variant="h4">Név: {name}</Typography>
      <div className="flex items-center gap-8">
        <Typography variant="h6">Egyenleg: {budget}</Typography>
        <Button
          type="button"
          color="primary"
          variant="contained"
          disabled={!canBuy}
          onClick={() => setShowEmptyTicket(true)}
        >
          {canBuy ? 'Új szelvény vásárlása' : 'Nincs elég kereted'}
        </Button>
      </div>
      <div className="my-4 h-px bg-gray-200 rounded-full"></div>
      <div className="flex flex-col gap-2">
        <Typography variant="h5">Szelvények</Typography>
        <div className="flex flex-wrap items-baseline gap-4">
          {tickets.map((ticket, ticketIdx) => (
            <PlayedTicket key={`${ticket.toString()}-${ticketIdx + 1}}`} id={ticketIdx + 1} values={ticket} />
          ))}
          {showEmptyTicket && (
            <NewTicket
              id={tickets.length + 1}
              onBuyTicket={values => {
                onBuyTicket(values);
                setShowEmptyTicket(false);
              }}
              onCancelTicket={() => {
                setShowEmptyTicket(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type NewPlayerProps = { onCreate: (name: string) => void };
type ActivePlayerProps = Player & { onBuyTicket: (tickets: [number, number, number, number, number]) => void };
