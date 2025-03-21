import { Text, Stack, Card, Badge, Flex, Title } from "@mantine/core";
import { useEffect, useState } from "react";

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp ?? Date.now());
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

function DepositList() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/transfer/deposits')
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  return (

    <Stack>
      {transactions.map((tx) => (
        <Card key={tx.paymentId} shadow="sm" p="md" radius="md" withBorder>
          <Flex justify={"space-between"} align={"center"}>
            <Stack>
              <Text size="sm" color="gray">{formatDate(tx.created_at)}</Text>
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