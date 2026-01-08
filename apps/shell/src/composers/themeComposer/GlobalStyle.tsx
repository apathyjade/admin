
import { createGlobalStyle } from 'styled-components';
import theme, { type ThemeData } from './theme';
import { memo } from 'react';

const createCssVariables = (themeData: ThemeData): string => {
  const vars: string[] = [];
  const flatten = (obj: Record<string, any>, prefix = '') => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flatten(obj[key], `${prefix}${key}-`);
      } else {
        // 转换 key 为 kebab-case（如 colors-primary → colors-primary）
        const cssVarName = `--${prefix}${key}`.replace(/([A-Z])/g, '-$1').toLowerCase();
        vars.push(`${cssVarName}: ${obj[key]};`);
      }
    }
  };
  flatten(themeData);
  return vars.join('\n  ');
};

export default memo(createGlobalStyle`
  :root {
    ${createCssVariables(theme.light)}
  }
  [theme="dark"]:root {
    ${createCssVariables(theme.dark)}
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: var(--text_color);
    background-color: var(--site_bgc);
  }
`);
