import { Button, Group, SimpleGrid, Stack, Text, TextInput, Center, Loader, Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import { GetProvidersResponse200 } from "@api/open-finance-data";
import axios from "axios";
import { ForPayContext } from "./context";
import { useNavigate } from "react-router";

function Withdraw() {
  const { wallets, reload } = useContext(ForPayContext);
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<GetProvidersResponse200>([]);
  const navigate = useNavigate();

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
      .get("/payments/providers")
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
    try {
      await axios.post('/payments/withdraw', values);
      reload();
      navigate('/?withdraw=success');
    } catch (error) {
      console.error(error);
    }
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
    <Stack align="center" justify="center" gap="xs">
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

        <SimpleGrid cols={3} spacing="md">
          {providers.map((provider) => {
            const isSelected =
              form.getValues().providerIdentifier === provider.providerFriendlyId;
            return (
              <Stack
                key={provider.providerFriendlyId}
                align="center"
                p='xs'
                style={{
                  borderRadius: "10px",
                  paddingBottom: 0,
                  backgroundColor: isSelected ? "#e6f7ff" : "transparent",
                  transition: "all 0.3s ease",
                }}
              >
                <img
                  onClick={pickProvider(provider.bankCode!, provider.providerFriendlyId!)}
                  height={70}
                  width={70}
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
                <Text size="sm" ta='center' c={isSelected ? "blue" : "black"}>
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
            bg='green'
          >
            בצע משיכה
          </Button>
        </Group>
      </form>
    </Stack>
  );
}

export default Withdraw;