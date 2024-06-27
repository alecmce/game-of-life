import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: true,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
