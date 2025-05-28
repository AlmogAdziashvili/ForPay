import { Button, Group, SimpleGrid, Stack, Text, TextInput, Center, Loader, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import { GetProvidersResponse200 } from "@api/open-finance-data";
import axios from "axios";
import { ForPayContext } from "./context";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

function Transfer() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [providers, setProviders] = useState<GetProvidersResponse200>([]);
  const { wallets, reload } = useContext(ForPayContext);

  useEffect(() => {
    axios.get('/payments/providers').then((response) => setProviders(response.data)).catch(() => setProviders([]));
  }, []);

  function validateAmount(value: number) {
    if (!value || value <= 0) {
      return t('deposit_amount_validation');
    }
    if (wallets && value > wallets[0].balance) {
      return t('transfer_insufficient_funds_validation');
    }
    return null;
  }

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      amount: 0,
      identificationNumber: '',
    },

    validate: {
      amount: validateAmount,
      identificationNumber: (value) => (/^\d{9}$/).test(value) ? null : t('login_id_validation'),
    },
  });

  const onSubmit = async (values: ReturnType<typeof form.getValues>) => {
    setIsLoading(true);
    try {
      await axios.post('/payments/transfer', values);
      reload();
      navigate('/?transfer=success');
    } catch (error: any) {
      if (error.response.status === 400) {
        form.setErrors({ amount: t('transfer_invalid_fields_error') });
      } else if (error.response.status === 404) {
        form.setErrors({ amount: t('transfer_account_not_found_error') });
      } else if (error.response.status === 403) {
        form.setErrors({ amount: t('transfer_insufficient_funds_validation') });
      } else {
        form.setErrors({ amount: t('transfer_error') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!providers.length) {
    return <Center><Loader /></Center>;
  }

  return (
    <Stack align='center' justify='center' gap='xs'>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <NumberInput
          placeholder={t('deposit_amount_placeholder')}
          label={t('deposit_amount_label')}
          key={form.key('amount')}
          miw={300}
          mb='md'
          {...form.getInputProps('amount')}
        />

        <TextInput
          placeholder={t('login_id_placeholder')}
          label={t('transfer_to_whom_label')}
          key={form.key('identificationNumber')}
          miw={300}
          mb='md'
          {...form.getInputProps('identificationNumber')}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit" loading={isLoading}>{t('transfer_submit_button')}</Button>
        </Group>
      </form>
    </Stack>
  )
}

export default Transfer;