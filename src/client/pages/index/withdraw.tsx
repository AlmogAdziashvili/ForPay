import { Button, Group, SimpleGrid, Stack, Text, TextInput, Center, Loader, Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import { GetProvidersResponse200 } from "@api/open-finance-data";
import axios from "axios";
import { ForPayContext } from "./context";

function Withdraw() {
  const { wallets } = useContext(ForPayContext);
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<GetProvidersResponse200>([]);

  function validateAmount(amount: number) {
    if (!amount || amount < 1) {
      return "סכום חייב להיות גדול מ-0";
    }
    if (wallets && amount > wallets[0].balance) {
      return "הסכום גבוה יותר מהיתרה בחשבון";
    }
    return null;
  }

  useEffect(() => {
    axios
      .get("/transfer/providers")
      .then((response) => setProviders(response.data))
      .catch(() => setProviders([]));
  }, []);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      amount: 0,
      branch: "",
      bban: "",
      providerId: 12,
      providerIdentifier: "hapoalim",
    },
    validate: {
      amount: validateAmount,
      branch: (value) => (value ? null : "שדה חובה"),
      bban: (value) => (value ? null : "שדה חובה"),
    },
  });

  const pickProvider = (provider: number, providerIdentifier: string) => () => {
    form.setFieldValue("providerId", provider);
    form.setFieldValue("providerIdentifier", providerIdentifier);
  };

  const onSubmit = async (values: ReturnType<typeof form.getValues>) => {
    setIsLoading(true);
    console.log(values);
    setIsLoading(false);
  };

  if (!providers.length) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Stack align="center" justify="center" p="xl" gap="xs">
      <Card shadow="lg" p="xl" radius="lg" withBorder>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            type="number"
            placeholder="סכום"
            label="סכום"
            key={form.key("amount")}
            miw={300}
            mb="md"
            {...form.getInputProps("amount")}
          />

          <TextInput
            placeholder="סניף"
            label="סניף"
            key={form.key("branch")}
            miw={300}
            mb="md"
            {...form.getInputProps("branch")}
          />

          <TextInput
            placeholder="מספר חשבון"
            label="מספר חשבון"
            key={form.key("bban")}
            miw={300}
            mb="md"
            {...form.getInputProps("bban")}
          />

          <Text size="lg" weight={700} align="center" mb="md" color="blue">
            בחר בנק
          </Text>

          <SimpleGrid cols={3} spacing="md">
            {providers.map((provider) => {
              const isSelected =
                form.getValues().providerIdentifier === provider.providerFriendlyId;
              return (
                <Stack
                  key={provider.providerFriendlyId}
                  align="center"
                  spacing="xs"
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: isSelected ? "#e6f7ff" : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <img
                    onClick={pickProvider(provider.bankCode!, provider.providerFriendlyId!)}
                    height={90}
                    width={90}
                    src={provider.image}
                    style={{
                      borderRadius: "50%",
                      objectFit: "contain",
                      background: "#fff",
                      padding: "5px",
                      border: isSelected ? "2px solid #1e90ff" : "1.5px solid #ddd",
                      boxShadow: isSelected ? "0 4px 12px rgba(30, 144, 255, 0.5)" : "0 2px 6px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: isSelected ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                  <Text size="md" weight={700} color={isSelected ? "blue" : "black"}>
                    {provider.nameNativeLanguage}
                  </Text>
                </Stack>
              );
            })}
          </SimpleGrid>

          <Group mt="md" w="100%">
            <Button
              fullWidth
              type="submit"
              loading={isLoading}
              sx={(theme) => ({
                background: "linear-gradient(90deg, #28a745, #218838)",
                color: theme.white,
                fontSize: "18px",
                fontWeight: "bold",
                padding: "12px",
                borderRadius: "30px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { 
                  background: "linear-gradient(90deg, #218838, #1e7e34)", 
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" 
                },
                "&:active": { transform: "scale(0.95)" },
              })}
            >
              💸 בצע משיכה
            </Button>
          </Group>
        </form>
      </Card>
    </Stack>
  );
}

export default Withdraw;