import { Group, ScrollArea, Text, Table, List, Stack, Card, Badge, Flex, Title } from "@mantine/core";
import { ForPayContext } from ".";
import { useContext, useEffect } from "react";
import { notifications } from '@mantine/notifications';
import { IconArrowDownLeft, IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
const formatDate = (date: Date) => {
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};
const d = {
  paymentId: '1',
  amount: 1,
  status: 'APPROVED',
  created_at: new Date(),
}

const transactions = [
  { paymentId: "1", amount: 1, status: "APPROVED", created_at: new Date() },
  { paymentId: "2", amount: -100, status: "DECLINED", created_at: new Date("2025-03-16") },
  { paymentId: "3", amount: 500, status: "APPROVED", created_at: new Date("2025-03-15") },
];

function DepositList() {

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
            <Title>
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