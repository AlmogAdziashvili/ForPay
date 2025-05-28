import { Text, Stack, Card, Flex, Title, Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp ?? Date.now());
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

interface DepositListProps {
  limit?: number;
}
function actionToDescription (action: any, t: any) {
  if (action.type === 'DEPOSIT') {
    return t('deposit_list_deposit_to_wallet');
  }
  if (action.type === 'TRANSFER_FROM_ME') {
    return t('deposit_list_transfer_from_me', { recipientName: `${action.recipientId.firstName} ${action.recipientId.lastName || ''}` });
  }
  if (action.type === 'TRANSFER_TO_ME') {
    return t('deposit_list_transfer_to_me', { senderName: `${action.senderId.firstName} ${action.senderId.lastName || ''}` });
  }
  if (action.type === 'WITHDRAW') {
    return t('deposit_list_withdraw_from_wallet');
  }
  return '';
}

function DepositList(props: DepositListProps) {
  const { t } = useTranslation();
  const [actions, setActions] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/payments/actions')
      .then((res) => res.json())
      .then((data) => setActions(data.slice(0, props.limit ?? data.length)));
  }, []);

  if (!actions) {
    return <Center><Loader /></Center>;
  }

  return (
    <Stack>
      {actions.map((action) => (
        <Card key={action.paymentId} shadow="sm" p="xs" radius="md" withBorder w='100%'>
          <Flex justify={"space-between"} align={"center"}>
            <Stack gap="2">
              <Text size="sm" c="gray">{formatDate(action.createdAt)}</Text>
              <Text size="md">
                {actionToDescription(action, t)}
              </Text>
            </Stack>
            <Flex align="end">
              <Title style={{ color: action.amount > 0 ? 'green' : 'red' }}>
                {action.amount}
              </Title>
              <Text mb='2'>₪</Text>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Stack>
  )
}

export default DepositList;