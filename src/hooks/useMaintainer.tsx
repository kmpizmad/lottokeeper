import { useCallback, useEffect, useReducer } from 'react';
import { getEntity, saveEntity } from '../lib/utils';
import { createTicket } from '../lib/tickets';
import { Player } from './usePlayer';

const defaultMaintainer: Maintainer = {
  budget: 0,
  tickets: [],
};

function useMaintainer() {
  const [maintainer, dispatch] = useReducer(maintainerReducer, defaultMaintainer);

  const generateTickets = useCallback((count: number) => {
    dispatch({ type: 'GENERATE_TICKETS', count });
  }, []);

  const updateTickets = useCallback(() => {
    dispatch({ type: 'UPDATE_TICKETS' });
  }, []);

  const updateBudgets = useCallback((profit: number, loss: number) => {
    console.log(profit, loss);
    dispatch({ type: 'EVALUATE_PRIZES', playerProfit: profit, loss });
  }, []);

  useEffect(() => {
    dispatch({ type: 'LOAD_MAINTAINER' });
  }, []);

  return { maintainer, generateTickets, updateTickets, updateBudgets };
}

export default useMaintainer;

function maintainerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_MAINTAINER':
      return getEntity<State>('maintainer') || { ...state };
    case 'UPDATE_TICKETS':
      return updateTickets(state);
    case 'GENERATE_TICKETS':
      return generateTickets(state, action.count);
    case 'EVALUATE_PRIZES':
      return updateBudgets(state, action.playerProfit, action.loss);
  }
}

function generateTickets(state: State, count: number): State {
  const generated: GeneratedTicket[] = new Array<GeneratedTicket>(count)
    .fill({ type: 'generated', values: [] })
    .map(ticket => ({ ...ticket, values: createTicket(true) }));

  const played: GeneratedTicket[] =
    getEntity<Player>('player')?.tickets.map(ticket => ({ type: 'player', values: ticket })) || [];

  return saveEntity<Maintainer>('maintainer', {
    ...state,
    budget: state.budget + (generated.length + played.length) * 500,
    tickets: [...played, ...generated],
  });
}

function updateTickets(state: State): State {
  const played: GeneratedTicket[] =
    getEntity<Player>('player')?.tickets.map(ticket => ({ type: 'player', values: ticket })) || [];

  const lastPlayerTicketIndex = getLastPlayerTicketIndex(state.tickets);
  const tickets = state.tickets.slice(lastPlayerTicketIndex);

  return saveEntity<Maintainer>('maintainer', {
    ...state,
    budget: state.budget - lastPlayerTicketIndex * 500 + played.length * 500,
    tickets: [...played, ...tickets],
  });
}

function updateBudgets(state: State, profit: number, loss: number): State {
  const player = getEntity<Player>('player');
  if (player) saveEntity<Player>('player', { ...player, budget: player.budget + profit });
  return saveEntity<Maintainer>('maintainer', { ...state, budget: state.budget - loss });
}

export type Maintainer = { budget: number; tickets: GeneratedTicket[] };
export type GeneratedTicket = { type: 'generated' | 'player'; values: number[] };

type State = Maintainer;
type Action =
  | { type: 'LOAD_MAINTAINER' }
  | { type: 'UPDATE_TICKETS' }
  | { type: 'EVALUATE_PRIZES'; loss: number; playerProfit: number }
  | { type: 'GENERATE_TICKETS'; count: number };

function getLastPlayerTicketIndex(tickets: GeneratedTicket[]) {
  let i: number = 0;
  while (i < tickets.length && tickets[i].type === 'player') {
    i++;
  }
  return i;
}
