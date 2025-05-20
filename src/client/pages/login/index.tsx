import { Button, Container, Group, Image, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      identificationNumber: '',
      password: '',
    },

    validate: {
      identificationNumber: (value) => (/^\d{9}$/).test(value) ? null : 'מספר תעודת זהות חייב להיות בעל 9 ספרות',
      password: (value) => (value ? null : 'שדה חובה'),
    },
  });

  const onSubmit = async (values: ReturnType<typeof form.getValues>) => {
    try {
      setIsLoading(true);
      await axios.post('/auth/login', values);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      form.setErrors({ password: 'סיסמא או תעודת זהות שגויים' });
    }
  };

  return (
    <Container bg="var(--mantine-color-blue-light)" style={{ minHeight: '100%', minWidth: '100vw' }}>
      <Stack align='center' mt='30vh'>
        <Image src='/logo.png' alt='Mantine logo' maw={200} />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            type='number'
            placeholder="תעודת זהות"
            key={form.key('identificationNumber')}
            miw={300}
            mb='md'
            {...form.getInputProps('identificationNumber')}
          />

          <TextInput
            placeholder="סיסמא"
            type='password'
            key={form.key('password')}
            miw={300}
            mb='md'
            {...form.getInputProps('password')}
          />

          <Group mt="md" w='100%'>
            <Button fullWidth color='green' type="submit" loading={isLoading}>כניסה</Button>
            <Button fullWidth variant='subtle' color='green' onClick={() => navigate('/register')}>פתח ארנק חדש</Button>
          </Group>
        </form>
      </Stack>
    </Container>
  );
}

export default Login;
