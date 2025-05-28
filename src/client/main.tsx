import { createTheme, DirectionProvider, MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n'; // Your i18n configuration
import dayjs from 'dayjs';
import 'dayjs/locale/he';
import 'dayjs/locale/th';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import './i18n';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import Register from './pages/register';
import Login from './pages/login';
import Index from './pages/index';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
});

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    dayjs.locale(i18n.language);
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n.language]);

  return (
    <DirectionProvider initialDirection={i18n.dir(i18n.language)}>
      <MantineProvider theme={theme}>
        <DatesProvider settings={{ locale: i18n.language }}>
          <Notifications />
          <BrowserRouter>
            <Routes>
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='*' element={<Index />} />
            </Routes>
          </BrowserRouter>
        </DatesProvider>
      </MantineProvider>
    </DirectionProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
);
