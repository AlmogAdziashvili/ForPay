import { Button, Group, SimpleGrid, Stack, Text, TextInput, Center, Loader, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import { GetProvidersResponse200 } from "@api/open-finance-data";
import axios from "axios";
import { ForPayContext } from "./context";
import { useNavigate } from "react-router";

function Transfer() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [providers, setProviders] = useState<GetProvidersResponse200>([]);
  const { wallets } = useContext(ForPayContext);

  useEffect(() => {
    axios.get('/payments/providers').then((response) => setProviders(response.data)).catch(() => setProviders([]));
  }, []);

  function validateAmount(value: number) {
    if (!value || value <= 0) {
      return 'סכום חייב להיות גדול מ-0';
    }
    if (wallets && value > wallets[0].balance) {
      return 'אין לך מספיק כסף בחשבון';
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
      identificationNumber: (value) => (/^\d{9}$/).test(value) ? null : 'מספר תעודת זהות חייב להיות בעל 9 ספרות',
    },
  });

  const onSubmit = async (values: ReturnType<typeof form.getValues>) => {
    setIsLoading(true);
    try {
      await axios.post('/payments/transfer', values);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!providers.length) {
    return <Center><Loader /></Center>;
  }

  return (
    <Stack align='center' justify='center' p='xl' gap='xs'>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <NumberInput
          placeholder="סכום"
          label="סכום"
          key={form.key('amount')}
          miw={300}
          mb='md'
          {...form.getInputProps('amount')}
        />

        <TextInput
          placeholder="תעודת זהות"
          label="למי מעבירים?"
          key={form.key('identificationNumber')}
          miw={300}
          mb='md'
          {...form.getInputProps('identificationNumber')}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit" loading={isLoading}>אשר העברה</Button>
        </Group>
      </form>
    </Stack>
  )
}

export default Transfer;