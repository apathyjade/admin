
const LBlue = ['#e6f5ff', '#adddff', '#85c8ff', '#58a9f5', '#2e88e8', '#0866db', '#004bb5', '#00378f', '#002569', '#001542'];
const DBlue = ['#111926', '#0f223c', '#102d50', '#0f396e', '#0c4995', '#0a5abd', '#2b7cd3', '#55a2ea', '#82c3f8', '#aad9fa'];

export interface ThemeData {
  site_bgc: string;
  text_color: string;
  block_bgc: string;

  primary_color: string;
  primary_color_hover: string;
  primary_color_active: string;
  primary_bgc: string;
}

const createTheme = (primary: string[]) => ({
  spacing: '1px',
  primary_color: primary[5],
  primary_color_hover: primary[4],
  primary_color_active: primary[6],
  primary_bgc: primary[0],
  primary_bgc_hover: primary[1],
});


export const lightTheme = {
  site_bgc: '#e9edf4',
  text_color: '#36383B',
  block_bgc: '#fcfeff',
  border_color: '#d2d2d2',
  mask_color: 'rgba(0, 0, 0, 0.02)',
  ...createTheme(LBlue),
};
export const darkTheme = {
  site_bgc: '#1c1e1f',
  text_color: '#c2c3c5',
  block_bgc: '#131517',
  border_color: '#2d2d2d',
  mask_color: 'rgba(255, 255, 255, 0.02)',
  ...createTheme(DBlue),
};

export default {
  light: lightTheme,
  dark: darkTheme,
};
