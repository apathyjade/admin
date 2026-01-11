
import { useCallback, useEffect, useState, type FC } from 'react';
import { createCtxComposer } from '@jelper/context-composer';
import themeMap from './theme';
import GlobalStyle from './GlobalStyle';

type ThemeType = 'dark'|'light';
const themeCtxComposer = createCtxComposer(() => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const themeData = themeMap[theme] || themeMap.light;
  useEffect(() => {
    document.querySelector('html')?.setAttribute('theme', theme)
  }, [theme]);
  const switchTheme = useCallback(() => {
    setTheme(oldTheme => oldTheme === 'dark' ? 'light' : 'dark');
  }, [])
  return {theme, themeData, switchTheme} as const;
}, {
  builder(props, Com: FC<any>) {
    return <>
      <GlobalStyle />
      <Com {...props} />
    </>
  }
});

export default themeCtxComposer;
