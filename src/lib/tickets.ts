import { GeneratedTicket } from '../hooks/useMaintainer';

export function createTicket(sorted: boolean = false): [number, number, number, number, number] {
  const numbers: number[] = [];
  const min: number = 1;
  const max: number = 40; // excluded

  let i: number = 0;
  while (i < 5) {
    const random = Math.floor(Math.random() * (max - min)) + min;
    if (numbers.includes(random)) continue;
    numbers.push(random);
    i++;
  }

  return (sorted ? numbers.sort((a, b) => a - b) : numbers) as [number, number, number, number, number];
}

export function countWinners(
  tickets: GeneratedTicket[],
  winner: number[],
  threshold: number,
  exact: boolean = true,
): number {
  let winnerCount: number = 0;
  for (let i: number = 0; i < tickets.length; i++) {
    let j: number = 0;
    let matchCount: number = 0;
    while (j < tickets[i].values.length) {
      if (winner.includes(tickets[i].values[j])) matchCount++;
      j++;
    }
    if (exact ? matchCount === threshold : matchCount < threshold) winnerCount++;
  }
  return winnerCount;
}

export function countHits(ticket: number[], winner: number[], threshold: number): number {
  let count: number = 0;
  for (let i: number = 0; i < ticket.length; i++) {
    if (winner.includes(ticket[i])) count++;
  }
  return count >= threshold ? count : 0;
}

export function collectPrize(tickets: GeneratedTicket[], winner: number[], options?: { threshold?: number }): number {
  if (options?.threshold) {
    const winners = countWinners(tickets, winner, options?.threshold);
    return winners * options?.threshold * 100;
  }

  let hits: number = 0;
  for (const { values } of tickets) {
    hits += countHits(values, winner, 2);
  }

  return hits * 100;
}

export function collectPlayerProfit(tickets: GeneratedTicket[], winner: number[]): number {
  const t = tickets.filter(x => x.type === 'player');

  let hits: number = 0;
  for (const { values } of t) {
    hits += countHits(values, winner, 2);
  }

  return hits * 100;
}

export function sortTickets(tickets: GeneratedTicket[], winner: number[], sortBy: SortBy): GeneratedTicket[] {
  switch (sortBy) {
    default:
    case 'hit-desc':
      return tickets.toSorted((a, b) => {
        const aHits = countHits(a.values, winner, 1);
        const bHits = countHits(b.values, winner, 1);
        return bHits - aHits;
      });
    case 'hit-asc':
      return tickets.toSorted((a, b) => {
        const aHits = countHits(a.values, winner, 1);
        const bHits = countHits(b.values, winner, 1);
        return aHits - bHits;
      });
    case 'prize-desc':
      return tickets.toSorted((a, b) => {
        const aHits = countHits(a.values, winner, 1) * 100;
        const bHits = countHits(b.values, winner, 1) * 100;
        return bHits - aHits;
      });
    case 'prize-asc':
      return tickets.toSorted((a, b) => {
        const aHits = countHits(a.values, winner, 1) * 100;
        const bHits = countHits(b.values, winner, 1) * 100;
        return aHits - bHits;
      });
  }
}

export type SortBy = 'hit-desc' | 'hit-asc' | 'prize-desc' | 'prize-asc';
