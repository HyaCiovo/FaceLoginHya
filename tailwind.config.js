/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import plugin from 'tailwindcss/plugin';

const genColorGroup = (color) => {
  let str = color.replace('#', '');
  if (str.length === 3) {
    str = str
      .split('')
      .map((item) => item.repeat(2))
      .join('');
  }
  const r = parseInt(`0x${str.substring(0, 2)}`, 16);
  const g = parseInt(`0x${str.substring(2, 4)}`, 16);
  const b = parseInt(`0x${str.substring(4, 6)}`, 16);
  return {
    DEFAULT: `rgba(${r},${g} ,${b})`,
    ...[900, 800, 600, 550, 400, 300, 200, 100, 80, 60].reduce((previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue]: `rgba(${r},${g} ,${b}, ${currentValue / 1000})`,
      };
    }, {}),
  };
};
const themeColor = {
  primary: '#006AE8',
  primary_hover: '#2065b9',
  success: '#5AC614',
  white: '#ffffff',
  black: '#000000',
  cardColor: '#FAFAFA',
  desc: '#CCCCCC',
  border: '#F0F0F0',
  darkBorder: '#e5e5e5',
  label: '#999999',
  red: '#CC342C',
  gray: '#666',
  deepGray: '#333',
  grayBg: '#f5f5f5',
  blue: '#0073FF',
  blueBg: '#F0F7FF',
  cardBg: '#FAFAFA',
  lightGray: '#d8d8d8',
  pantone: '#61aae7',
  detailColor: '#0754B2',
  hoverTextColor: '#2065b9',
  yellow: '#fef6e5',
  yellowDeep: '#FEAB00',
  contentBg: '#FBFBFD'
};

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: themeColor,
      backgroundImage: {
        'card-hover': 'linear-gradient(225deg, #0E77F8 0%, #0F58E3 100%)',
      },
      opacity: {
        45: '.45',
        97: '.97',
      },
    },
  },
  plugins: [
    daisyui,
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.sin-backgroundImage': {
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        },
      };
      addUtilities(newUtilities, ['responsive']);
    }),
  ],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    themes: ["light", {
      bumblebee: {
        ...require("daisyui/src/theming/themes")["bumblebee"],
        ...themeColor,
        primary: '#006AE8'
      }
    }, "dark"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
}

