import { Alert, Button, Center, Flex, Stack, Text, Title } from "@mantine/core";
import { ForPayContext } from ".";
import { useContext, useEffect } from "react";
import { IconInfoCircle } from '@tabler/icons-react';
import { useNavigate } from "react-router";
import { notifications } from '@mantine/notifications';
import DepositList from "./deposit_list";

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
  const navigate = useNavigate();
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
    <Stack justify='center' p='xl' gap='xs'>
      <Flex justify='center' align='center' gap='xs' direction='column'>
        <Text size='md'>היתרה שלך</Text>
        <Flex align='end'>
          <Title size='64'>{wallets?.[0].balance}</Title>

          <Text size='md' pb='10' pr='2'>₪</Text>
        </Flex>
        {!wallets?.[0].balance && <EmptyWalletAlert />}
      </Flex>
      <Flex justify='space-between' align='center' mt='lg'>
        <Text size='md'>פעולות אחרונות</Text>
        <Button color='blue' variant='transparent' size='xs' onClick={() => navigate('/deposit-list')}>צפה בכל הפעולות</Button>
      </Flex>
      <DepositList limit={2} />
    </Stack>
  )
}

export default Hero;