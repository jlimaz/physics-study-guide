"use client";

import { useSyncExternalStore } from "react";

/** Everything persisted lives under one localStorage key as a flat map. */
const KEY = "psg-progress-v1";
const EVENT = "psg-progress";

type Store = Record<string, unknown>;

const EMPTY: Store = {};
let cached: Store | null = null;

function read(): Store {
  if (cached) return cached;
  try {
    cached = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    cached = {};
  }
  return cached!;
}

function write(next: Store) {
  cached = next;
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cached = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore(): Store {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useValue<T>(key: string): T | undefined {
  return useStore()[key] as T | undefined;
}

export function setValue(key: string, value: unknown) {
  const next = { ...read() };
  if (value === undefined) delete next[key];
  else next[key] = value;
  write(next);
}

export function resetPrefix(prefix: string) {
  const next = Object.fromEntries(Object.entries(read()).filter(([k]) => !k.startsWith(prefix)));
  write(next);
}

export type QuizResult = { choice: number; correct: boolean };
export const quizKey = (id: string) => `quiz:${id}`;
export const checkKey = (id: string) => `check:${id}`;
export const doneKey = (slug: string) => `done:${slug}`;
