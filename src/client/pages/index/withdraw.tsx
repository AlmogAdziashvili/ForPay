import { Button, Group, Stack, Text, TextInput, Center, Loader, Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import { GetProvidersResponse200 } from "@api/open-finance-data";
import axios from "axios";
import { ForPayContext } from "./context";
import { useNavigate } from "react-router";
import { ProvidersList } from "../../components/providers_list";
import { useTranslation } from "react-i18next";

function Withdraw() {
  const { t } = useTranslation();
  const { wallets, reload } = useContext(ForPayContext);
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<GetProvidersResponse200>([]);
  const navigate = useNavigate();

  function validateAmount(amount: number) {
    if (!amount || amount < 1) {
      return t('deposit_amount_validation');
    }
    if (wallets && amount > wallets[0].balance) {
      return t('withdraw_amount_too_high_validation');
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
      branch: (value) => (value ? null : t('common_required_field')),
      bban: (value) => (value ? null : t('common_required_field')),
    },
  });

  const handleSelectProvider = (bankCode: number, providerFriendlyId: string) => {
    form.setFieldValue("providerId", bankCode);
    form.setFieldValue("providerIdentifier", providerFriendlyId);
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
          placeholder={t('deposit_amount_placeholder')}
          label={t('deposit_amount_label')}
          key={form.key("amount")}
          miw={300}
          mb="md"
          {...form.getInputProps("amount")}
        />

        <TextInput
          placeholder={t('deposit_branch_placeholder')}
          label={t('deposit_branch_label')}
          key={form.key("branch")}
          miw={300}
          mb="md"
          {...form.getInputProps("branch")}
        />

        <TextInput
          placeholder={t('deposit_account_placeholder')}
          label={t('deposit_account_label')}
          key={form.key("bban")}
          miw={300}
          mb="md"
          {...form.getInputProps("bban")}
        />

        <ProvidersList 
          providers={providers}
          selectedProviderId={form.getValues().providerIdentifier}
          onSelectProvider={handleSelectProvider}
        />

        <Group mt="md" w="100%">
          <Button
            fullWidth
            type="submit"
            loading={isLoading}
            bg='green'
          >
            {t('withdraw_submit_button')}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}

export default Withdraw;