import { Button, Card, Loader, Stack, Text, TextInput, Box } from "@mantine/core";
import axios from "axios";
import { useContext, useState, useRef, useEffect } from "react";
import { ForPayContext } from "./context";
import { useNavigate } from "react-router";
import { notifications } from '@mantine/notifications';
import { useTranslation } from "react-i18next";

function MerchantCode() {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const { reload } = useContext(ForPayContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const submit = async () => {
    if (code.length !== 4) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/payments/merchant/response', { code });
      reload();
      navigate('/?transfer=success');
    } catch (error: any) {
      notifications.show({
        title: t('merchant_code_error_title'),
        message: t('merchant_code_invalid_code_error'),
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Stack display='flex' justify="space-between" h='100%'>
      <Card radius="lg" shadow="sm" p="xl" withBorder>
        <Stack align="center" gap="xs">
          <Text 
            fw={600} 
            ta="center" 
            fz="xl" 
            c="dimmed"
          >
            {t('merchant_code_enter_payment_code')}
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
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  variant="unstyled"
                  placeholder="0000"
                  maxLength={4}
                  styles={{
                    input: {
                      fontSize: '3.5rem',
                      fontWeight: 700,
                      height: 'auto',
                      padding: '0.5rem 0',
                      textAlign: 'center',
                      color: '#333',
                      letterSpacing: '0.5rem',
                      '&::placeholder': {
                        color: 'rgba(0,0,0,0.2)'
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
          
          <Button 
            mt="lg" 
            size="lg" 
            radius="md"
            fullWidth
            disabled={code.length !== 4 || isLoading} 
            onClick={submit}
            bg={isLoading ? "white" : ""}
            style={{
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              transform: isLoading ? 'scale(0.98)' : '',
            }}
          >
            {isLoading ? <Loader size="sm" /> : t('merchant_code_submit_button')}
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

export default MerchantCode;