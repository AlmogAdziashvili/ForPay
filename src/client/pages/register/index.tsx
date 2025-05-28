import { Button, Checkbox, Container, Flex, Grid, Group, Image, SegmentedControl, Select, SimpleGrid, Stack, Stepper, Switch, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { GetProvidersResponse200 } from '@api/open-finance-data';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

function Form0(props: any) {
  const { t } = useTranslation();
  const form1 = useForm({
    mode: 'uncontrolled',
    initialValues: {
      identificationNumber: '',
      termsOfService: false,
    },

    validate: {
      identificationNumber: (value) => (/^[0-9]{9}$/.test(value) ? null : t('register_form0_id_validation')),
      termsOfService: (value) => (value ? null : t('register_form0_terms_validation')),
    },
  });

  return (
    <>
      <Text size='xl'>
        {t('register_form0_title')}
      </Text>
      <form onSubmit={form1.onSubmit(props.onSubmit)}>
        <TextInput
          type='number'
          placeholder={t('register_form0_id_placeholder')}
          key={form1.key('identificationNumber')}
          miw={300}
          {...form1.getInputProps('identificationNumber')}
        />
        <Checkbox
          mt="md"
          label={t('register_form0_terms_label')}
          key={form1.key('termsOfService')}
          {...form1.getInputProps('termsOfService', { type: 'checkbox' })}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit">{t('common_continue_button')}</Button>
        </Group>
      </form>
    </>
  )
}

function Form1(props: any) {
  const { t } = useTranslation();
  const [type, setType] = useState<'USER' | 'MERCHANT'>('USER');
  const onSubmit = (values: any) => {
    if (type === 'MERCHANT') {
      props.onSubmit({
        ...values,
        bankCode: providers.find((provider) => provider.providerFriendlyId === values.providerFriendlyId)?.bankCode,
        type,
      });
    } else {
      props.onSubmit({
        ...values,
        type,
      });
    }
  }
  const [providers, setProviders] = useState<GetProvidersResponse200>([]);
  useEffect(() => {
    axios.get('/payments/providers').then((response) => setProviders(response.data)).catch(() => setProviders([]));
  }, []);
  const typeSwitch = (
    <SegmentedControl
      value={type}
      onChange={(value) => setType(value as 'USER' | 'MERCHANT')}
      data={[
        { label: t('register_form1_user_type_normal'), value: 'USER' },
        { label: t('register_form1_user_type_business'), value: 'MERCHANT' },
      ]}
    />
  );

  if (type === 'MERCHANT') {
    return (
      <>
        {typeSwitch}
        <Form1Merchant {...props} onSubmit={onSubmit} providers={providers} />
      </>
    );
  } else {
    return (
      <>
        {typeSwitch}
        <Form1User {...props} onSubmit={onSubmit} />
      </>
    );
  }
}

function Form1Merchant(props: any) {
  const { t } = useTranslation();
  const providers = props.providers as GetProvidersResponse200;

  const form1 = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      providerFriendlyId: 'hapoalim',
      branch: '',
      bban: '',
    },

    validate: {
      firstName: (value) => (value ? null : t('common_required_field')),
      providerFriendlyId: (value) => (value ? null : t('common_required_field')),
      branch: (value) => (value ? null : t('common_required_field')),
      bban: (value) => (value ? null : t('common_required_field')),
    },
  });

  const options = providers?.filter((provider) => !!provider.providerFriendlyId).map((provider) => ({ value: `${provider.providerFriendlyId}`, label: t(provider.providerFriendlyId!) }));

  return (
    <>
      <Text size='xl'>
        {t('register_form1_title')}
      </Text>
      <form onSubmit={form1.onSubmit(props.onSubmit)}>
        <TextInput
          placeholder={t('register_form1_merchant_name_placeholder')}
          key={form1.key('firstName')}
          miw={300}
          mb='md'
          {...form1.getInputProps('firstName')}
        />
        <Select
          data={options}
          mb='md'
          {...form1.getInputProps('providerFriendlyId')}
        />
        <TextInput
          placeholder={t('register_form1_merchant_branch_placeholder')}
          key={form1.key('branch')}
          mb='md'
          miw={300}
          {...form1.getInputProps('branch')}
        />
        <TextInput
          placeholder={t('register_form1_merchant_bank_placeholder')}
          key={form1.key('bban')}
          miw={300}
          mb='md'
          {...form1.getInputProps('bban')}
        />
        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit">{t('common_continue_button')}</Button>
        </Group>
      </form>
    </>
  );
}

function Form1User(props: any) {
  const { t } = useTranslation();
  const today18YearsAgo = new Date();
  today18YearsAgo.setFullYear(today18YearsAgo.getFullYear() - 18);
  const form1 = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
      birthDate: null,
    },

    validate: {
      firstName: (value) => (value ? null : t('common_required_field')),
      lastName: (value) => (value ? null : t('common_required_field')),
      birthDate: (value) => (value ? null : t('common_required_field')),
    },
  });

  return (
    <>
      <Text size='xl'>
        {t('register_form1_title')}
      </Text>
      <form onSubmit={form1.onSubmit(props.onSubmit)}>
        <TextInput
          placeholder={t('register_form1_user_firstname_placeholder')}
          key={form1.key('firstName')}
          miw={300}
          mb='md'
          {...form1.getInputProps('firstName')}
        />

        <TextInput
          placeholder={t('register_form1_user_lastname_placeholder')}
          key={form1.key('lastName')}
          miw={300}
          mb='md'
          {...form1.getInputProps('lastName')}
        />

        <DatePickerInput
          placeholder={t('register_form1_user_birthdate_placeholder')}
          key={form1.key('birthDate')}
          miw={300}
          mb='md'
          firstDayOfWeek={0}
          weekendDays={[]}
          {...form1.getInputProps('birthDate')}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit">{t('common_continue_button')}</Button>
        </Group>
      </form>
    </>
  )
}

function Form2(props: any) {
  const { t } = useTranslation();
  const form2 = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validate: {
      password: (value) => (value ? null : t('common_required_field')),
      confirmPassword: (value, { password }) => ((value == password) ? null : t('register_form2_passwords_no_match')),
    },
  });

  return (
    <>
      <Text size='xl'>
        {t('register_form2_title')}
      </Text>
      <form onSubmit={form2.onSubmit(props.onSubmit)}>
        <TextInput
          placeholder={t('register_form2_password_placeholder')}
          type='password'
          key={form2.key('password')}
          miw={300}
          mb='md'
          {...form2.getInputProps('password')}
        />

        <TextInput
          placeholder={t('register_form2_confirm_password_placeholder')}
          type='password'
          key={form2.key('confirmPassword')}
          miw={300}
          mb='md'
          {...form2.getInputProps('confirmPassword')}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit">{t('register_form2_submit_button')}</Button>
        </Group>
      </form>
    </>
  );
}

function Register() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const goBack = (requiredStep: number) => setStep(step => Math.min(step, requiredStep));

  const handleForm0Submit = (values: any) => {
    setFormValues(prev => ({ ...prev, ...values }));
    setStep(1);
  };
  const handleForm1Submit = (values: any) => {
    setFormValues(prev => ({ ...prev, ...values }));
    setStep(2);
  };

  const submitRegister = async (values: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await axios.post('/auth/register', { ...formValues, ...values });
      navigate('/');
    } catch (err: any) {
      setIsLoading(false);
      if (err.response?.status === 409) {
        setStep(0);
        setError(t('error_user_exists'));
      } else if (err.response?.status === 500) {
        setError(t('error_server_error'));
      } else if (err.response?.status === 400) {
        setStep(0);
        setError(t('error_invalid_data'));
      } else {
        setError(t('error_unknown'));
      }
    }
  };

  return (
    <Container bg="var(--mantine-color-blue-light)" style={{ minHeight: '100%', minWidth: '100vw' }}>
      <Stack align='center' mt='30vh' w='100%'>
        <Image src='/logo.png' alt='Mantine logo' maw={200} />
        {step === 0 && <Form0 onSubmit={handleForm0Submit} />}
        {step === 1 && <Form1 onSubmit={handleForm1Submit} />}
        {step === 2 && <Form2 onSubmit={submitRegister} />}
        {error && <Text c='red'>{error}</Text>}
        <Button display={step ? 'none' : 'block'} fullWidth variant='subtle' color='green' onClick={() => navigate('/login')}>{t('register_login_button')}</Button>
      </Stack>
      <Stack align='center' mt='10vh'>
        <Stepper active={step} color='green' miw={300} onStepClick={goBack}>
          <Stepper.Step disabled={step < 1} />
          <Stepper.Step disabled={step < 2} />
          <Stepper.Step disabled={step < 3} loading={isLoading} />
        </Stepper>
      </Stack>
      <Flex justify='center' pos="fixed" bottom={0} w='100%' p='md' right={0} left={0}>
        <LanguageSwitcher />
      </Flex>
    </Container>
  );
}

export default Register;
