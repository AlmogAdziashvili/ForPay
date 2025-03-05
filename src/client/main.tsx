import { createTheme, DirectionProvider, MantineProvider } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css';
import 'dayjs/locale/he';

import React from 'react';
import ReactDOM from 'react-dom/client';

import Register from './pages/register';
import Login from './pages/login';
import Index from './pages/index';
import { DatesProvider } from '@mantine/dates';

const theme = createTheme({
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DirectionProvider initialDirection='rtl'>
      <MantineProvider theme={theme}>
        <DatesProvider settings={{ locale: 'he' }}>
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
  </React.StrictMode>,
);
