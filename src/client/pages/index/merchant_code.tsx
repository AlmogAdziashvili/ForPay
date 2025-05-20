import { ActionIcon, Alert, Button, Card, Flex, Loader, Stack, Text, TextInput, Title } from "@mantine/core";
import axios from "axios";
import { useContext, useState } from "react";
import { ForPayContext } from "./context";
import { useNavigate } from "react-router";
import { notifications } from '@mantine/notifications';

function MerchantCode() {
  const [code, setCode] = useState('');
  const { reload } = useContext(ForPayContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (code.length !== 4) {
      return;
    }

    try {
      await axios.post('/payments/merchant/response', { code });
      reload();
      navigate('/?transfer=success');
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: 'קוד לא תקין',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Stack display='flex' justify="space-between" h='100%'>
      <Card radius='lg'>
        <Text style={{ fontSize: '2rem' }}>הזן קוד</Text>
        <TextInput value={code} onChange={(e) => setCode(e.target.value)} className='bigInput' variant="unstyled" placeholder="####" maxLength={4} />
        <Button mt='lg' size='md' disabled={code.length !== 4 || isLoading} onClick={submit}>{isLoading ? <Loader /> : 'שלח'}</Button>
      </Card>
    </Stack>
  );
}

export default MerchantCode;