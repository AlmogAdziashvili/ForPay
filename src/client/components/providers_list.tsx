import { SimpleGrid, Stack, Text } from "@mantine/core";
import { GetProvidersResponse200 } from "@api/open-finance-data";
import { useTranslation } from "react-i18next";

interface ProvidersListProps {
  providers: GetProvidersResponse200;
  selectedProviderId: string;
  onSelectProvider: (bankCode: number, providerFriendlyId: string) => void;
}

export function ProvidersList({ 
  providers, 
  selectedProviderId, 
  onSelectProvider
}: ProvidersListProps) {
  const { t } = useTranslation();
  return (
    <SimpleGrid cols={3} spacing="md">
      {providers.map((provider) => {
        const isSelected = selectedProviderId === provider.providerFriendlyId;
        
        return (
          <Stack
            key={provider.providerFriendlyId}
            align="center"
            p="xs"
            style={{
              borderRadius: "10px",
              paddingBottom: 0,
              backgroundColor: isSelected ? "#e6f7ff" : "transparent",
              transition: "all 0.3s ease",
            }}
          >
            <img
              onClick={() => onSelectProvider(provider.bankCode!, provider.providerFriendlyId!)}
              height={70}
              width={70}
              src={provider.image}
              style={{
                borderRadius: "50%",
                objectFit: "contain",
                background: "#fff",
                padding: "5px",
                border: isSelected ? "2px solid #1e90ff" : "1.5px solid #ddd",
                boxShadow: isSelected ? "0 4px 12px rgba(30, 144, 255, 0.5)" : "0 2px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: isSelected ? "scale(1.1)" : "scale(1)",
              }}
            />
            <Text size="sm" ta="center" c={isSelected ? "blue" : "black"}>
              {t(provider.providerFriendlyId!)}
            </Text>
          </Stack>
        );
      })}
    </SimpleGrid>
  );
} 