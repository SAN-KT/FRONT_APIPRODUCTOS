import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import App from './App.tsx'

const tema = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  // Un escalon mas grande que el default de Mantine (12/14/16/18/20), para mejor lectura
  fontSizes: {
    xs: '13px',
    sm: '15px',
    md: '17px',
    lg: '19px',
    xl: '22px',
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={tema} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
)
