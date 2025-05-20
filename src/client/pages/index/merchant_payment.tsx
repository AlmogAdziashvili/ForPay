import { Button, Text, TextInput, Loader, Card } from "@mantine/core";
import { useState } from "react";
import axios from "axios";

function MerchantPayment() {
  const [amount, setAmount] = useState<string | undefined>();
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/payments/merchant/request", {
        amount: Number(amount),
      });

      setCode(response.data.code);
    } catch (error) {
      console.error("Error generating payment code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      < Card radius='lg' >
        <Text style={{ fontSize: '2rem' }}>כמה?</Text>
        <TextInput value={amount} onChange={(e) => setAmount(e.target.value)} className='bigInput' variant="unstyled" placeholder="₪" maxLength={4} type='number' />
        <Button mt='lg' size='md' disabled={!amount || !amount.length || Number(amount) < 0} onClick={handleSubmit}>{isLoading ? <Loader /> : 'שלח'}</Button>
      </Card >
      {
        code && (
          <Card radius='lg' mt='lg'>
            <Text style={{ fontSize: '2rem' }}>קוד תשלום</Text>
            <Button mt='lg' size='md' variant="light" color="blue" onClick={() => navigator.clipboard.writeText(code)}>{code}</Button>
          </Card>
        )
      }

    </>
  );
}

export default MerchantPayment;