import { ActionIcon, Alert, Button, Flex, Stack, Text, Title } from "@mantine/core";
import { ForPayContext } from ".";
import { useContext, useEffect } from "react";
import { IconBarcode, IconCashBanknoteMove, IconCashMinus, IconCashPlus, IconInfoCircle, IconPigMoney } from '@tabler/icons-react';
import { useNavigate } from "react-router";
import { notifications } from '@mantine/notifications';
import DepositList from "./deposit_list";
import { navigationRoutes } from "./navbar";

function EmptyWalletAlert() {
  const navigate = useNavigate();

  const icon = <IconInfoCircle />;

  return (
    <Alert variant="light" color="yellow" icon={icon} onClick={() => navigate('/deposit')}>
      שמנו לב שעוד לא הפקדת כסף לחשבון שלך, לחץ כאן כדי להפקיד עכשיו
    </Alert>
  );
}

const heroNavItems = navigationRoutes.filter((item) => item.showOnHero);

function Hero() {
  const { wallets, user } = useContext(ForPayContext);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  let didNotificationShow = false;

  useEffect(() => {
    const isDepositSuccess = queryParams.get('deposit') === 'success';
    const isTransferSuccess = queryParams.get('transfer') === 'success';
    const isWithdrawSuccess = queryParams.get('withdraw') === 'success';

    if (isDepositSuccess && !didNotificationShow) {
      didNotificationShow = true;
      notifications.show({
        title: 'הפקדה בוצעה בהצלחה',
        message: 'הפקדת כסף לחשבון שלך בהצלחה',
        color: 'teal',
      });
    }

    if (isTransferSuccess && !didNotificationShow) {
      didNotificationShow = true;
      notifications.show({
        title: 'העברה בוצעה בהצלחה',
        message: 'ביצעת העברה בהצלחה',
        color: 'teal',
      });
    }

    if (isWithdrawSuccess && !didNotificationShow) {
      didNotificationShow = true;
      notifications.show({
        title: 'משיכת כסף בוצעה בהצלחה',
        message: 'משיכת כסף מהחשבון שלך בוצעה בהצלחה',
        color: 'teal',
      });
    }
  }, []);

  return (
    <Stack justify='center' p='xl' gap='xs'>
      <Flex justify='center' align='center' gap='xs' direction='column'>
        <Text size='md'>היתרה שלך</Text>
        <Flex align='end'>
          <Title size='64'>{wallets?.[0].balance}</Title>
          <Text size='md' pb='10' pr='2'>₪</Text>
        </Flex>
        {!wallets?.[0].balance && <EmptyWalletAlert />}
      </Flex>
      <Flex py='lg' gap='lg' justify='center'>
        {heroNavItems.map((item, i) => {
          if (item.hideInBusiness && user.type === 'MERCHANT') {
            return null;
          }
          if (item.hideInUser && user.type === 'USER') {
            return null;
          }
          return (
            <Flex key={i} direction='column' align='center'>
              <ActionIcon gradient={{ from: 'lime', to: 'teal' }} variant="gradient" size="64" radius="xl" onClick={() => navigate(item.to)}>
                <item.icon />
              </ActionIcon>
              <Text size='xs'>{item.title}</Text>
            </Flex>
          );
        })}
      </Flex>
      <Flex justify='space-between' align='center'>
        <Text size='md'>פעולות אחרונות</Text>
        <Button color='green' variant='transparent' size='xs' onClick={() => navigate('/deposit-list')}>צפה בכל הפעולות</Button>
      </Flex>
      <DepositList limit={2} />
    </Stack>
  )
}

export default Hero;