import { Divider, Flex, Text } from "@mantine/core";
import { IconCashBanknoteMove, IconCashPlus, IconHistory, IconLogout, IconHome, IconCashMinus, IconBarcode } from "@tabler/icons-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { ForPayContext } from "./context";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export function getNavigationRoutes(t: any) {
  return [
    { title: t('navbar_home'), icon: IconHome, to: '/' },
    { title: t('navbar_deposit'), icon: IconCashPlus, to: '/deposit', hideInBusiness: true, showOnHero: true },
    { title: t('navbar_withdraw'), icon: IconCashMinus, to: '/withdraw', showOnHero: true },
    { title: t('navbar_transfer'), icon: IconCashBanknoteMove, to: '/transfer', hideInBusiness: true, showOnHero: true },
    { title: t('navbar_merchant_code'), icon: IconBarcode, to: '/merchant-code', hideInBusiness: true, showOnHero: true },
    { title: t('navbar_merchant_payment'), icon: IconBarcode, to: '/merchant-payment', showOnHero: true, hideInUser: true },
    { title: t('navbar_history'), icon: IconHistory, to: '/deposit-list' },
    'language-switcher' as const,
    { title: t('navbar_logout'), icon: IconLogout, to: '/auth/logout', bottom: true },
  ];
}

export function NavBar(props: { toggleNavbar: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useContext(ForPayContext);
  const navigationRoutes = getNavigationRoutes(t);

  const navigateTo = (to: string) => () => {
    if (to.startsWith('/auth')) {
      window.location.href = to;
      return;
    }
    navigate(to);
    props.toggleNavbar();
  }

  return navigationRoutes.map((route, i) => {
    if (route === 'language-switcher') {
      return <Flex justify='center' align='center' style={{ width: '100%' }} p='lg'>
        <LanguageSwitcher />
      </Flex>;
    }
    if (route.hideInBusiness && user?.type === 'MERCHANT') {
      return null;
    }
    if (route.hideInUser && user?.type === 'USER') {
      return null;
    }
    return (
      <div key={i} style={{ marginTop: route.bottom ? 'auto' : 0 }}>
        <Flex p='lg' gap='md' align='center' onClick={navigateTo(route.to)} style={{ cursor: 'pointer' }}>
          <route.icon />
          <Text size='lg'>{route.title}</Text>
        </Flex>
        {i < navigationRoutes.length - 1 && <Divider />}
      </div>
    );
  });
}
