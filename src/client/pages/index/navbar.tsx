import { Divider, Flex, Text } from "@mantine/core";
import { IconCashBanknoteMove, IconCashPlus, IconHistory, IconLogout, IconHome, IconCashMinus, IconBarcode } from "@tabler/icons-react";
import { useNavigate } from "react-router";

const navigationRoutes = [
  { title: 'בית', icon: IconHome, to: '/' },
  { title: 'הפקדה', icon: IconCashPlus, to: '/deposit' },
  { title: 'משיכה', icon: IconCashMinus, to: '/withdraw' },
  { title: 'העברה', icon: IconCashBanknoteMove, to: '/transfer' },
  { title: 'תשלום עם קוד', icon: IconBarcode, to: '/merchant-code' },
  { title: 'היסטוריית פעולות', icon: IconHistory, to: '/deposit-list' },
  { title: 'התנתק', icon: IconLogout, to: '/auth/logout', bottom: true },
];

export function NavBar(props: { toggleNavbar: () => void }) {
  const navigate = useNavigate();

  const navigateTo = (to: string) => () => {
    if (to.startsWith('/auth')) {
      window.location.href = to;
      return;
    }
    navigate(to);
    props.toggleNavbar();
  }

  return navigationRoutes.map((route, i) => (
    <div key={i} style={{ marginTop: route.bottom ? 'auto' : 0 }}>
      <Flex p='lg' gap='md' align='center' onClick={navigateTo(route.to)} style={{ cursor: 'pointer' }}>
        <route.icon />
        <Text size='lg'>{route.title}</Text>
      </Flex>
      {i < navigationRoutes.length - 1 && <Divider />}
    </div>
  ));
}
