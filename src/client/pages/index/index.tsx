import { AppShell, Burger, Center, Flex, Image, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes, useNavigate } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import Hero from './hero';
import Deposit from './deposit';
import DepositList from './deposit_list';
import { ForPayContext } from './context';
import { NavBar } from './navbar';
import Withdraw from './withdraw';
import Transfer from './transfer';

function Index() {
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState<any[] | null>(null);
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/auth/me').then((response) => { setUser(response.data.user); setWallets([response.data.parentWallet, ...response.data.childrenWallets]); }).catch(() => navigate('/login'));
  }, []);

  const reload = () => {
    setWallets(null);
    setUser(null);
    axios.get('/auth/me')
      .then((response) => { setUser(response.data.user); setWallets([response.data.parentWallet, ...response.data.childrenWallets]); })
      .catch(() => navigate('/login'));
  };

  return (
    <ForPayContext.Provider value={{ user, wallets, reload }}>
      <AppShell
        header={{ height: 60 }}
        padding="md"
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header p='8' bg='var(--mantine-color-blue-light)'>
          <Flex justify='space-between'>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="lg"
            />
            <Image height={36} src='/logo.png' alt='Mantine logo' maw={200} />
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar bg='var(--mantine-color-blue-0)' p="md">
          <NavBar toggleNavbar={toggle} />
        </AppShell.Navbar>

        <AppShell.Main bg='var(--mantine-color-blue-light)' miw='100vw'>
          {user ? (
            <Routes>
              <Route path='/transfer' element={<Transfer />} />
              <Route path='/deposit-list' element={<DepositList />} />
              <Route path='/deposit' element={<Deposit />} />
              <Route path='/withdraw' element={<Withdraw/>}/>
              <Route path='*' element={<Hero />} />
            </Routes>
          ) : <Center><Loader /></Center>}
        </AppShell.Main>
      </AppShell>
    </ForPayContext.Provider>
  );
}

export { ForPayContext, Index };
export default Index;
