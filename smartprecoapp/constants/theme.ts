import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const colors = {
  primary: '#34A853',   
  secondary: '#F2994A',  
  background: '#F5F5F5', 
  surface: '#FFFFFF',    
  text: '#333333',      
  accent: '#4285F4',     
  error: '#EB5757',     
  disabled: '#BDBDBD', 
  placeholder: '#9E9E9E', 
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primary + '20', 
    secondary: colors.secondary,
    secondaryContainer: colors.secondary + '20',
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    onSurface: colors.text,
    disabled: colors.disabled,
    placeholder: colors.placeholder,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: colors.accent,
    accent: colors.accent,
  },
  roundness: 8,
};

export const appColors = colors;

export default theme;