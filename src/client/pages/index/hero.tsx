import { ActionIcon, Alert, Button, Flex, Stack, Text, Title } from "@mantine/core";
import { ForPayContext } from ".";
import { useContext, useEffect } from "react";
import { IconBarcode, IconCashBanknoteMove, IconCashMinus, IconCashPlus, IconInfoCircle, IconPigMoney } from '@tabler/icons-react';
import { useNavigate } from "react-router";
import { notifications } from '@mantine/notifications';
import DepositList from "./deposit_list";
import { getNavigationRoutes } from "./navbar";
import { useTranslation } from "react-i18next";

function EmptyWalletAlert() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const icon = <IconInfoCircle />;

  return (
    <Alert variant="light" color="yellow" icon={icon} onClick={() => navigate('/deposit')}>
      {t('hero_empty_wallet_alert')}
    </Alert>
  );
}

function Hero() {
  const { t } = useTranslation();
  const { wallets, user } = useContext(ForPayContext);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  let didNotificationShow = false;
  const heroNavItems = getNavigationRoutes(t)
    .filter(item => typeof item !== 'string' && item.showOnHero);

  useEffect(() => {
    const isDepositSuccess = queryParams.get('deposit') === 'success';
    const isTransferSuccess = queryParams.get('transfer') === 'success';
    const isWithdrawSuccess = queryParams.get('withdraw') === 'success';

    if (isDepositSuccess && !didNotificationShow) {
      didNotificationShow = true;
      notifications.show({
        title: t('hero_deposit_success_title'),
        message: t('hero_deposit_success_message'),
        color: 'teal',
      });
    }

    if (isTransferSuccess && !didNotificationShow) {
      didNotificationShow = true;
      notifications.show({
        title: t('hero_transfer_success_title'),
        message: t('hero_transfer_success_message'),
        color: 'teal',
      });
    }

    if (isWithdrawSuccess && !didNotificationShow) {
      didNotificationShow = true;
      notifications.show({
        title: t('hero_withdraw_success_title'),
        message: t('hero_withdraw_success_message'),
        color: 'teal',
      });
    }
  }, []);

  return (
    <Stack justify='center' gap='xs'>
      <Flex justify='center' align='center' gap='xs' direction='column'>
        <Text size='md'>{t('hero_your_balance')}</Text>
        <Flex align='end'>
          <Title size='64'>{wallets?.[0].balance}</Title>
          <Text size='md' pb='10' pr='2'>₪</Text>
        </Flex>
        {!wallets?.[0].balance && <EmptyWalletAlert />}
      </Flex>
      <Flex py='lg' gap='lg' justify='center'>
        {heroNavItems.map((item, i) => {
          if (typeof item === 'string') return null;
          if (item.hideInBusiness && user.type === 'MERCHANT') {
            return null;
          }
          if (item.hideInUser && user.type === 'USER') {
            return null;
          }
          return (
            <Flex key={i} direction='column' align='center'>
              <ActionIcon gradient={{ from: 'lime', to: 'teal' }} variant="gradient" size={52} radius="xl" onClick={() => navigate(item.to)}>
                <item.icon />
              </ActionIcon>
              <Text size='xs' ta='center'>{item.title}</Text>
            </Flex>
          );
        })}
      </Flex>
      <Flex justify='space-between' align='center'>
        <Text size='md'>{t('hero_recent_actions')}</Text>
        <Button color='green' variant='transparent' size='xs' onClick={() => navigate('/deposit-list')}>{t('hero_view_all_actions_button')}</Button>
      </Flex>
      <DepositList limit={2} />
    </Stack>
  )
}

export default Hero;