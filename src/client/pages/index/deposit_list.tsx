import { Text, Stack, Card, Flex, Title, Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp ?? Date.now());
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

interface DepositListProps {
  limit?: number;
}
function actionToDescription (action: any) {
  if (action.type === 'DEPOSIT') {
    return 'הפקדה לארנק';
  }
  if (action.type === 'TRANSFER_FROM_ME') {
    return `העברת כסף ל${action.recipientId.firstName} ${action.recipientId.lastName}`;
  }
  if (action.type === 'TRANSFER_TO_ME') {
    return `העברת כסף מ${action.senderId.firstName} ${action.senderId.lastName}`;
  }
  if (action.type === 'WITHDRAW') {
    return 'משיכת כסף מהארנק';
  }
  return '';
}

function DepositList(props: DepositListProps) {
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
                {actionToDescription(action)}
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