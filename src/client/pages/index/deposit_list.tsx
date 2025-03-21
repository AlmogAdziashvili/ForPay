import { Text, Stack, Card, Badge, Flex, Title, Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp ?? Date.now());
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

interface DepositListProps {
  limit?: number;
}

function DepositList(props: DepositListProps) {
  const [transactions, setTransactions] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/payments/deposits')
      .then((res) => res.json())
      .then((data) => setTransactions(data.slice(0, props.limit ?? data.length)));
  }, []);

  if (!transactions) {
    return <Center><Loader /></Center>;
  }


  return (
    <Stack>
      {transactions.map((tx) => (
        <Card key={tx.paymentId} shadow="sm" p="xs" radius="md" withBorder w='100%'>
          <Flex justify={"space-between"} align={"center"}>
            <Stack gap="2">
              <Text size="sm" c="gray">{formatDate(tx.created_at)}</Text>
              <Text size="md">
                הפקדה לארנק
              </Text>
            </Stack>
            <Flex align="end">
              <Title style={{ color: tx.amount > 0 ? 'green' : 'red' }}>
                {tx.amount}
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