import { Image, Button, Flex, Group, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { GetProvidersResponse200 } from "@api/open-finance-data";
import axios from "axios";

function Deposit() {
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<GetProvidersResponse200>([]);

  useEffect(() => {
    axios.get('/transfer/providers').then((response) => setProviders(response.data)).catch(() => setProviders([]));
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
      amount: (value) => ((value || value < 1) ? null : 'סכום חייב להיות גדול מ-0'),
      branch: (value) => (value ? null : 'שדה חובה'),
      bban: (value) => (value ? null : 'שדה חובה'),
      providerId: (value) => (value ? null : 'שדה חובה'),
      providerIdentifier: (value) => (value ? null : 'שדה חובה'),
    },
  });

  const pickProvider = (provider: number, providerIdentifier: string) => () => {
    form.setFieldValue('providerId', provider);
    form.setFieldValue('providerIdentifier', providerIdentifier);
  };

  const onSubmit = async (values: ReturnType<typeof form.getValues>) => {
    setIsLoading(true);
    try {
      await axios.post('/transfer/deposit', values);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Stack align='center' justify='center' p='xl' gap='xs'>
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
        <SimpleGrid cols={3} spacing='sm'>
          {providers.map((provider) => {
            const maybeSelectedStyles = form.getValues().providerIdentifier === provider.providerFriendlyId ? { border: '2px solid var(--mantine-color-green-outline)', padding: 2 } : {};
            return (
              <img onClick={pickProvider(provider.bankCode!, provider.providerFriendlyId!)} height={90} width={90} src={provider.image} style={{ borderRadius: '50%', objectFit: 'contain', background: '#fff', scale: 0.8, ...maybeSelectedStyles }} />
            );
          })}
        </SimpleGrid>

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit" loading={isLoading}>עבור לאישור הפקדה</Button>
        </Group>
      </form>
    </Stack>
  )
}

export default Deposit;