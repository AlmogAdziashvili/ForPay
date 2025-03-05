import { AppShell, Burger, Button, Container, Flex, Group, Image, Stack, Text, TextInput } from '@mantine/core';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import Hero from './hero';

const ForPayContext = createContext<
  { user: any; wallets: any[] | null }
>({
  user: null,
  wallets: null,
});

function Index() {
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState<any[] | null>(null);
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/auth/me').then((response) => { setUser(response.data.user); setWallets([response.data.parentWallet, ...response.data.childrenWallets]); }).catch(() => navigate('/login'));
  }, []);

  return (
    <ForPayContext.Provider value={{ user, wallets }}>
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

        <AppShell.Navbar bg='var(--mantine-color-blue-light)' p="md">Navbar</AppShell.Navbar>

        <AppShell.Main bg='var(--mantine-color-blue-light)' miw='100vw'>
          <Hero />
        </AppShell.Main>
      </AppShell>
    </ForPayContext.Provider>
  );
}

export { ForPayContext, Index };
export default Index;
