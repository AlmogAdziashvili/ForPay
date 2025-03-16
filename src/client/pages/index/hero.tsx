import { Alert, Flex, Stack, Text, Title } from "@mantine/core";
import { ForPayContext } from ".";
import { useContext, useEffect } from "react";
import { IconInfoCircle } from '@tabler/icons-react';
import { useNavigate } from "react-router";
import { notifications } from '@mantine/notifications';

function EmptyWalletAlert() {
  const navigate = useNavigate();

  const icon = <IconInfoCircle />;

  return (
    <Alert variant="light" color="yellow" icon={icon} onClick={() => navigate('/deposit')}>
      שמנו לב שעוד לא הפקדת כסף לחשבון שלך, לחץ כאן כדי להפקיד עכשיו
    </Alert>
  );
}

function Hero() {
  const { wallets } = useContext(ForPayContext);
  const queryParams = new URLSearchParams(window.location.search);
  let didNotificationShow = false;
  
  useEffect(() => {
    const isDepositSuccess = queryParams.get('deposit') === 'success';
    if (isDepositSuccess && !didNotificationShow) {
      didNotificationShow = true;
      notifications.show({
        title: 'הפקדה בוצעה בהצלחה',
        message: 'הפקדת כסף לחשבון שלך בהצלחה',
        color: 'teal',
      });
    }
  }, []);
  
  return (
    <Stack align='center' justify='center' p='xl' gap='xs'>
      <Text size='md'>היתרה שלך</Text>
      <Flex align='end'>
        <Title size='64'>{wallets?.[0].balance}</Title>
      
        <Text size='md' pb='10' pr='2'>₪</Text>
      </Flex>
      {!wallets?.[0].balance && <EmptyWalletAlert />}
    </Stack>
  )
}

export default Hero;