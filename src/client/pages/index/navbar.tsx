import { Divider, Flex, Text } from "@mantine/core";
import { IconCashBanknoteMove, IconCashPlus, IconHistory, IconLogout, IconHome, IconCashMinus, IconBarcode } from "@tabler/icons-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { ForPayContext } from "./context";

export const navigationRoutes = [
  { title: 'בית', icon: IconHome, to: '/' },
  { title: 'הפקדה', icon: IconCashPlus, to: '/deposit', hideInBusiness: true, showOnHero: true },
  { title: 'משיכה', icon: IconCashMinus, to: '/withdraw', showOnHero: true },
  { title: 'העברה', icon: IconCashBanknoteMove, to: '/transfer', hideInBusiness: true, showOnHero: true },
  { title: 'תשלום עם קוד', icon: IconBarcode, to: '/merchant-code', hideInBusiness: true, showOnHero: true },
  { title: 'בקשת תשלום', icon: IconBarcode, to: '/merchant-request', showOnHero: true, hideInUser: true },
  { title: 'היסטוריית פעולות', icon: IconHistory, to: '/deposit-list' },
  { title: 'התנתק', icon: IconLogout, to: '/auth/logout', bottom: true },
];

export function NavBar(props: { toggleNavbar: () => void }) {
  const navigate = useNavigate();
  const { user } = useContext(ForPayContext);

  const navigateTo = (to: string) => () => {
    if (to.startsWith('/auth')) {
      window.location.href = to;
      return;
    }
    navigate(to);
    props.toggleNavbar();
  }

  return navigationRoutes.map((route, i) => {
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
