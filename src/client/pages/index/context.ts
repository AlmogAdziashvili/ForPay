import { createContext } from "react";

export const ForPayContext = createContext<
  { user: any; wallets: any[] | null; reload: () => void}
>({
  user: null,
  wallets: null,
  reload: () => {},
});