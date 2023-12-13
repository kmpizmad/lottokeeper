import { useCallback, useEffect, useReducer } from 'react';
import { getEntity, saveEntity } from '../lib/utils';

const defaultPlayer: Player = {
  name: '',
  budget: 10000,
  tickets: [],
  winnings: { tickets: [], value: 0 },
};

function usePlayer() {
  const [player, dispatch] = useReducer(playerReducer, defaultPlayer);

  const createPlayer = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', name });
  }, []);

  const buyTicket = useCallback(
    (tickets: [number, number, number, number, number]) => {
      if (player.budget - 500 >= 0) {
        dispatch({ type: 'BUY_TICKET', tickets });
      }
    },
    [player.budget],
  );

  useEffect(() => {
    dispatch({ type: 'LOAD_PLAYER' });
  }, []);

  return { player, createPlayer, buyTicket };
}

export default usePlayer;

function playerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_PLAYER':
      return getEntity<State>('player') || { ...state };
    case 'SET_NAME':
      return saveEntity<Player>('player', { ...state, name: action.name });
    case 'BUY_TICKET':
      return saveEntity<Player>('player', {
        ...state,
        budget: state.budget - 500,
        tickets: [...state.tickets, action.tickets],
      });
  }
}

export type Player = {
  name: string;
  budget: number;
  tickets: number[][];
  winnings: {
    tickets: number[][];
    value: number;
  };
};

type State = Player;
type Action =
  | { type: 'LOAD_PLAYER' }
  | { type: 'BUY_TICKET'; tickets: [number, number, number, number, number] }
  | { type: 'SET_NAME'; name: string };
