import { useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { GeneratedTicket } from '../hooks/useMaintainer';
import { SortBy, collectPrize, countWinners, sortTickets } from '../lib/tickets';
import { WinningTicket } from './TicketTemplate';

function Statistics({ tickets, winner }: StatisticsProps): JSX.Element | null {
  const [sortBy, setSortBy] = useState<SortBy>('hit-desc');

  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h5">Statisztika</Typography>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col justify-center gap-2">
          <HitStats tickets={tickets} winner={winner} />
          <ProfitStats tickets={tickets} winner={winner} />
        </div>
        <Select defaultValue="hit-desc" onChange={e => setSortBy(e.target.value as SortBy)}>
          <MenuItem value="hit-desc">Találatok száma csökkenő</MenuItem>
          <MenuItem value="hit-asc">Találatok száma növekvő</MenuItem>
          <MenuItem value="prize-desc">Szelvényre kifizetendő összeg csökkenő</MenuItem>
          <MenuItem value="prize-asc">Szelvényre kifizetendő összeg növekvő</MenuItem>
        </Select>
      </div>
      <div className="flex flex-wrap items-baseline gap-4">
        {sortTickets(tickets, winner, sortBy).map((ticket, ticketIdx) => (
          <WinningTicket key={`ticket-stat-${ticketIdx}`} type={ticket.type} values={ticket.values} winner={winner} />
        ))}
      </div>
    </div>
  );
}

export default Statistics;

function HitStats({ tickets, winner }: StatisticsProps): JSX.Element | null {
  return (
    <div className="flex items-baseline gap-4">
      <div>
        <div>5-ös találatok száma: {countWinners(tickets, winner, 5)}</div>
        <div>kifizetendő nyeremény: {collectPrize(tickets, winner, { threshold: 5 })}</div>
      </div>
      <div>
        <div>4-es találatok száma: {countWinners(tickets, winner, 4)}</div>
        <div>kifizetendő nyeremény: {collectPrize(tickets, winner, { threshold: 4 })}</div>
      </div>
      <div>
        <div>3-as találatok száma: {countWinners(tickets, winner, 3)}</div>
        <div>kifizetendő nyeremény: {collectPrize(tickets, winner, { threshold: 3 })}</div>
      </div>
      <div>
        <div>2-es találatok száma: {countWinners(tickets, winner, 2)}</div>
        <div>kifizetendő nyeremény: {collectPrize(tickets, winner, { threshold: 2 })}</div>
      </div>
      <div>Nyeretlen szelvények száma: {countWinners(tickets, winner, 2, false)}</div>
    </div>
  );
}

function ProfitStats({ tickets, winner }: StatisticsProps): JSX.Element | null {
  const prizePool = useMemo(() => tickets.length * 500, [tickets.length]);
  const prize = useMemo(() => collectPrize(tickets, winner), [tickets, winner]);

  return (
    <div className="flex flex-col justify-center">
      <div>Összes szelvény száma: {tickets.length}</div>
      <div>Összes szelvény után járó bevétel: {prizePool}</div>
      <div>Összesen kifizetendő nyeremény: {prize}</div>
      <div>Nyereség: {prizePool - prize}</div>
    </div>
  );
}

type StatisticsProps = { tickets: GeneratedTicket[]; winner: number[] };
