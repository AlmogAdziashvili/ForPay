import { createContext } from "react";

export const ForPayContext = createContext<
  { user: any; wallets: any[] | null }
>({
  user: null,
  wallets: null,
});