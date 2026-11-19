import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => {
    window.removeEventListener('hashchange', onChange);
  };
}

/** Current hash route, e.g. "/create-link" for "#/create-link" ("" otherwise). */
export function useHashRoute(): string {
  return useSyncExternalStore(
    subscribe,
    () => (window.location.hash.startsWith('#/') ? window.location.hash.slice(1).split('?')[0] ?? '' : ''),
    () => '',
  );
}
