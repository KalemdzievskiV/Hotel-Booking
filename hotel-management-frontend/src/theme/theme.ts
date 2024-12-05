import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#E6F1FF',
    100: '#CCE3FF',
    200: '#99C7FF',
    300: '#66ABFF',
    400: '#338FFF',
    500: '#0073FF', // primary
    600: '#005CBF',
    700: '#004080',
    800: '#002440',
    900: '#001220',
  },
  accent: {
    50: '#FFF0E6',
    100: '#FFE1CC',
    200: '#FFC399',
    300: '#FFA566',
    400: '#FF8733',
    500: '#FF6900', // secondary
    600: '#CC5400',
    700: '#993F00',
    800: '#662A00',
    900: '#331500',
  },
};

const semanticTokens = {
  colors: {
    'bg.default': {
      default: 'gray.50',
      _dark: 'gray.900',
    },
    'bg.paper': {
      default: 'white',
      _dark: 'gray.800',
    },
    'text.primary': {
      default: 'gray.900',
      _dark: 'white',
    },
    'text.secondary': {
      default: 'gray.600',
      _dark: 'gray.400',
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'lg',
    },
    defaultProps: {
      colorScheme: 'brand',
    },
  },
  Card: {
    baseStyle: {
      container: {
        backgroundColor: 'bg.paper',
        borderRadius: 'xl',
        boxShadow: 'lg',
      },
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  components,
  styles: {
    global: {
      body: {
        bg: 'bg.default',
        color: 'text.primary',
      },
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  },
});

export default theme;
