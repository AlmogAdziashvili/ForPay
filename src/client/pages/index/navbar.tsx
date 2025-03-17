import { Divider, Flex, Text } from "@mantine/core";
import { IconBrandStorybook, IconHome, IconPigMoney } from "@tabler/icons-react";
import { useNavigate } from "react-router";

const navigationRoutes = [
  { title: 'בית', icon: IconHome, to: '/' },
  { title: 'הפקדה', icon: IconPigMoney, to: '/deposit' },
  { title: 'היסטוריית הפקדות', icon: IconBrandStorybook, to: '/deposit-list' },
];

export function NavBar(props: { toggleNavbar: () => void }) {
  const navigate = useNavigate();

  const navigateTo = (to: string) => () => {
    navigate(to);
    props.toggleNavbar();
  }

  return (
    <>
      {navigationRoutes.map((route, i) => (
        <>
          <Flex p='lg' gap='md' align='center' onClick={navigateTo(route.to)} style={{ cursor: 'pointer' }}>
            <route.icon />
            <Text size='lg'>{route.title}</Text>
          </Flex>
          {i < navigationRoutes.length - 1 && <Divider />}
        </>
      ))}
    </>
  );
}
