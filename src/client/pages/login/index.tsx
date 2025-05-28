import { Button, Container, Flex, Group, Image, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

function Login() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      identificationNumber: '',
      password: '',
    },

    validate: {
      identificationNumber: (value) => (/^\d{9}$/).test(value) ? null : t('login_id_validation'),
      password: (value) => (value ? null : t('login_required_field')),
    },
  });

  const onSubmit = async (values: ReturnType<typeof form.getValues>) => {
    try {
      setIsLoading(true);
      await axios.post('/auth/login', values);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      form.setErrors({ password: t('login_incorrect_credentials') });
    }
  };

  return (
    <Container bg="var(--mantine-color-blue-light)" style={{ minHeight: '100%', minWidth: '100vw' }}>
      <Stack align='center' mt='30vh'>
        <Image src='/logo.png' alt='Mantine logo' maw={200} />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            type='number'
            placeholder={t('login_id_placeholder')}
            key={form.key('identificationNumber')}
            miw={300}
            mb='md'
            {...form.getInputProps('identificationNumber')}
          />

          <TextInput
            placeholder={t('login_password_placeholder')}
            type='password'
            key={form.key('password')}
            miw={300}
            mb='md'
            {...form.getInputProps('password')}
          />

          <Group mt="md" w='100%'>
            <Button fullWidth color='green' type="submit" loading={isLoading}>{t('login_submit_button')}</Button>
            <Button fullWidth variant='subtle' color='green' onClick={() => navigate('/register')}>{t('login_register_button')}</Button>
          </Group>
        </form>
      </Stack>
      <Flex justify='center' pos="fixed" bottom={0} w='100%' p='md' right={0} left={0}>
        <LanguageSwitcher />
      </Flex>
    </Container>
  );
}

export default Login;
