import { Button, Group, Stack, Text, TextInput, Center, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { GetProvidersResponse200 } from "@api/open-finance-data";
import axios from "axios";
import { ProvidersList } from "../../components/providers_list";

function Deposit() {
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<GetProvidersResponse200>([]);

  useEffect(() => {
    axios.get('/payments/providers').then((response) => setProviders(response.data)).catch(() => setProviders([]));
  }, []);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      amount: 0,
      branch: '',
      bban: '',
      providerId: 12,
      providerIdentifier: 'hapoalim',
    },

    validate: {
      amount: (value) => ((value && value > 0) ? null : 'סכום חייב להיות גדול מ-0'),
      branch: (value) => (value ? null : 'שדה חובה'),
      bban: (value) => (value ? null : 'שדה חובה'),
      providerId: (value) => (value ? null : 'שדה חובה'),
      providerIdentifier: (value) => (value ? null : 'שדה חובה'),
    },
  });

  const handleSelectProvider = (bankCode: number, providerFriendlyId: string) => {
    form.setFieldValue('providerId', bankCode);
    form.setFieldValue('providerIdentifier', providerFriendlyId);
  };

  const onSubmit = async (values: ReturnType<typeof form.getValues>) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post('/payments/deposit', values);
      if (data.scaOAuth) {
        window.location.href = data.scaOAuth;
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  if (!providers.length) {
    return <Center><Loader /></Center>;
  }

  return (
    <Stack align='center' justify='center' gap='xs'>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          type='number'
          placeholder="סכום"
          label="סכום"
          key={form.key('amount')}
          miw={300}
          mb='md'
          {...form.getInputProps('amount')}
        />

        <TextInput
          placeholder="סניף"
          label="סניף"
          key={form.key('branch')}
          miw={300}
          mb='md'
          {...form.getInputProps('branch')}
        />

        <TextInput
          placeholder="מספר חשבון"
          label="מספר חשבון"
          key={form.key('bban')}
          miw={300}
          mb='md'
          {...form.getInputProps('bban')}
        />

        <Text size='sm' mb='md'>בחר בנק</Text>
        <ProvidersList 
          providers={providers}
          selectedProviderId={form.getValues().providerIdentifier}
          onSelectProvider={handleSelectProvider}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit" loading={isLoading}>עבור לאישור הפקדה</Button>
        </Group>
      </form>
    </Stack>
  )
}

export default Deposit;