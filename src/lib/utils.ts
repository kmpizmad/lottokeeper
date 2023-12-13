import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export function getEntity<T>(name: string): T | null {
  const entity = window.localStorage.getItem(name);
  return entity ? (JSON.parse(entity) as T) : null;
}

export function saveEntity<T>(name: string, payload: T): T {
  window.localStorage.setItem(name, JSON.stringify(payload));
  return payload;
}
