import { Button, Checkbox, Container, Grid, Group, Image, SimpleGrid, Stack, Stepper, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import axios from 'axios';
import { useNavigate } from 'react-router';

function Form0(props: any) {
  const form1 = useForm({
    mode: 'uncontrolled',
    initialValues: {
      identificationNumber: '',
      termsOfService: false,
    },

    validate: {
      identificationNumber: (value) => (/^[0-9]{9}$/.test(value) ? null : 'תעדות זהות לא תקינה'),
      termsOfService: (value) => (value ? null : 'אנא אשר את תנאי השימוש'),
    },
  });

  return (
    <>
      <Text size='xl'>
        בואו נתחיל!
      </Text>
      <form onSubmit={form1.onSubmit(props.onSubmit)}>
        <TextInput
          type='number'
          placeholder="תעודת זהות"
          key={form1.key('identificationNumber')}
          miw={300}
          {...form1.getInputProps('identificationNumber')}
        />
        <Checkbox
          mt="md"
          label="אני מסכים לתנאי השימוש"
          key={form1.key('termsOfService')}
          {...form1.getInputProps('termsOfService', { type: 'checkbox' })}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit">המשך</Button>
        </Group>
      </form>
    </>
  )
}

function Form1(props: any) {
  const today18YearsAgo = new Date();
  today18YearsAgo.setFullYear(today18YearsAgo.getFullYear() - 18);
  const form1 = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
      birthDate: today18YearsAgo,
    },

    validate: {
      firstName: (value) => (value ? null : 'שדה חובה'),
      lastName: (value) => (value ? null : 'שדה חובה'),
      birthDate: (value) => (value ? null : 'שדה חובה'),
    },
  });

  return (
    <>
      <Text size='xl'>
        מושלם! בואו נכיר קצת יותר
      </Text>
      <form onSubmit={form1.onSubmit(props.onSubmit)}>
        <TextInput
          placeholder="שם פרטי"
          key={form1.key('firstName')}
          miw={300}
          mb='md'
          {...form1.getInputProps('firstName')}
        />

        <TextInput
          placeholder="שם משפחה"
          key={form1.key('lastName')}
          miw={300}
          mb='md'
          {...form1.getInputProps('lastName')}
        />

        <DatePickerInput
          placeholder="תאריך לידה"
          key={form1.key('birthDate')}
          miw={300}
          mb='md'
          firstDayOfWeek={0}
          weekendDays={[]}
          {...form1.getInputProps('birthDate')}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit">המשך</Button>
        </Group>
      </form>
    </>
  )
}

function Form2(props: any) {
  const form2 = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validate: {
      password: (value) => (value ? null : 'שדה חובה'),
      confirmPassword: (value, { password }) => ((value == password) ? null : 'הסיסמאות אינן תואמות'),
    },
  });

  return (
    <>
      <Text size='xl'>
        נשאר רק צעד אחד!
      </Text>
      <form onSubmit={form2.onSubmit(props.onSubmit)}>
        <TextInput
          placeholder="סיסמא"
          type='password'
          key={form2.key('password')}
          miw={300}
          mb='md'
          {...form2.getInputProps('password')}
        />

        <TextInput
          placeholder="אימות סיסמא"
          type='password'
          key={form2.key('confirmPassword')}
          miw={300}
          mb='md'
          {...form2.getInputProps('confirmPassword')}
        />

        <Group mt="md" w='100%'>
          <Button fullWidth color='green' type="submit">הרשמה</Button>
        </Group>
      </form>
    </>
  );
}

function Register() {
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const goBack = (requiredStep: number) => setStep(step => Math.min(step, requiredStep));

  const handleForm0Submit = (values: any) => {
    setFormValues((prev) => ({ ...prev, ...values }));
    setStep(1);
  }

  const handleForm1Submit = (values: any) => {
    setFormValues((prev) => ({ ...prev, ...values }));
    setStep(2);
  }

  const submitRegister = async (values: any) => {
    setFormValues((prev) => ({ ...prev, ...values }));
    setIsLoading(true);
    const registerValues = { ...formValues, ...values };
    try {
      await axios.post('/auth/register', registerValues);
      navigate('/login');
    } catch (err: any) {
      setIsLoading(false);
      if (err.response.status === 409) {
        setStep(0);
        setError('משתמש כבר קיים');
      } else if (err.response.status === 500) {
        setError('שגיאה בשרת');
      } else if (err.response.status === 400) {
        setStep(0);
        setError('נתונים לא תקינים');
      }
    }
  };

  return (
    <Container bg="var(--mantine-color-blue-light)" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Stack align='center' mt='30vh'>
        <Image src='/logo.png' alt='Mantine logo' maw={200} />
        {step === 0 && <Form0 onSubmit={handleForm0Submit} />}
        {step === 1 && <Form1 onSubmit={handleForm1Submit} />}
        {step === 2 && <Form2 onSubmit={submitRegister} />}
        {error && <Text c='red'>{error}</Text>}
        <Button display={step ? 'none' : 'block'} fullWidth variant='subtle' color='green' onClick={() => navigate('/register')}>התחבר לארנק קיים</Button>
      </Stack>
      <Stack align='center' mt='10vh'>
        <Stepper active={step} color='green' miw={300} onStepClick={goBack}>
          <Stepper.Step disabled={step < 1} />
          <Stepper.Step disabled={step < 2} />
          <Stepper.Step disabled={step < 3} loading={isLoading} />
        </Stepper>
      </Stack>
    </Container>
  );
}

export default Register;
