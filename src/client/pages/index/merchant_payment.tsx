import { Button, Text, TextInput, Loader, Card, Group, Stack, Box, ActionIcon } from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function MerchantPayment() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string | undefined>();
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      <Card radius="lg" shadow="sm" p="xl" withBorder>
        <Stack align="center" gap="xs">
          <Text 
            fw={600} 
            ta="center" 
            fz="xl" 
            c="dimmed"
          >
            {t('merchant_payment_enter_amount')}
          </Text>
          
          <Box 
            onClick={() => inputRef.current?.focus()}
            style={{
              position: 'relative',
              margin: '2rem 0',
              cursor: 'text',
              width: '100%',
              maxWidth: '280px'
            }}
          >
            <Box
              style={{
                position: 'relative',
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
            >
              <Box
                style={{
                  position: 'relative',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  background: isFocused ? 'rgba(0, 119, 255, 0.05)' : 'transparent',
                  border: isFocused ? '2px solid rgba(0, 119, 255, 0.4)' : '2px solid rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                <TextInput
                  ref={inputRef}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  variant="unstyled"
                  placeholder="0"
                  maxLength={6}
                  type="number"
                  min={0}
                  styles={{
                    input: {
                      fontSize: '3.5rem',
                      fontWeight: 700,
                      height: 'auto',
                      padding: '0.5rem 0',
                      textAlign: 'center',
                      color: '#333',
                      '&::placeholder': {
                        color: 'rgba(0,0,0,0.2)'
                      }
                    }
                  }}
                />
                <Text 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '1rem',
                    transform: 'translateY(-50%)',
                    fontSize: '2rem',
                    fontWeight: 500,
                    color: amount ? '#333' : 'rgba(0,0,0,0.3)',
                  }}
                >
                  ₪
                </Text>
              </Box>
            </Box>
          </Box>
          
          <Button 
            mt="lg" 
            size="lg" 
            radius="md"
            fullWidth
            disabled={!amount || !amount.length || Number(amount) <= 0} 
            onClick={handleSubmit}
            bg={isLoading ? "white" : ""}
            style={{
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              transform: isLoading ? 'scale(0.98)' : '',
            }}
          >
            {isLoading ? <Loader size="sm" /> : t('merchant_payment_create_code_button')}
          </Button>
        </Stack>
      </Card>
      
      {code && (
        <Card radius="lg" shadow="sm" p="xl" mt="lg" withBorder>
          <Stack align="center" gap="md">
            <Text fw={600} ta="center" fz="xl" c="dimmed">
              {t('merchant_payment_payment_code')}
            </Text>
            
            <Text
              fw={700}
              fz="3.5rem"
              style={{
                letterSpacing: '0.4rem',
                color: '#333',
                userSelect: 'all'
              }}
            >
              {code}
            </Text>
            
            <Group>
              <Button
                variant="light"
                onClick={() => navigator.clipboard.writeText(code)}
                radius="md"
                leftSection={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V18M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M14 5H16C17.1046 5 18 5.89543 18 7V10M20 14H10M10 14L13 11M10 14L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
              >
                {t('merchant_payment_copy_code_button')}
              </Button>
            </Group>
          </Stack>
        </Card>
      )}
    </>
  );
}

export default MerchantPayment;