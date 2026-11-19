import { createContext, useContext } from 'react';

export type ShowToast = (message: string) => void;

export const ToastContext = createContext<ShowToast>(() => undefined);

/** Shows a short, polite status message at the bottom of the screen. */
export function useToast(): ShowToast {
  return useContext(ToastContext);
}
