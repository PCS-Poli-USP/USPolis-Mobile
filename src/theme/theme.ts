import { createTheme } from '@shopify/restyle'

const palette = {
  colors: {
    green: {
      700: '#408180',
      500: '#18DAD7',
    },
    gray: {
      700: '#121214',
      600: '#202024',
      500: '#29292E',
      400: '#323238',
      300: '#7C7C8A',
      200: '#C4C4CC',
      100: '#E1E1E6',
    },
    white: '#FFFFFF',
    red: {
      500: '#F75A68',
    },
  },
  fonts: {
    heading: 'Roboto_700Bold',
    body: 'Roboto_400Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  sizes: {
    14: 56,
    33: 148,
  },
}

const theme = createTheme({
  colors: {
    primary: palette.colors.green[500],
    secondary: palette.colors.green[700],
    grayOne: palette.colors.gray[100],
    grayTwo: palette.colors.gray[200],
    grayThree: palette.colors.gray[300],
    grayFour: palette.colors.gray[400],
    grayFive: palette.colors.gray[500],
    graySix: palette.colors.gray[600],
    graySeven: palette.colors.gray[700],
    white: palette.colors.white,
    red: palette.colors.red[500],
    transparent: 'transparent',
  },
  textVariants: {
    heading: {
      fontFamily: 'Roboto_700Bold',
    },
    defaults: {
      fontFamily: 'Roboto_400Regular',
    },
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
    auto: 'auto',
  },
})

export type Theme = typeof theme
export default theme
