import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["dracula"],
  },
  plugins: [
    daisyui,
    // https://github.com/tailwindlabs/tailwindcss-intellisense/issues/227#issuecomment-1139895799
    ({ addUtilities }) => {
      addUtilities({
        ".app-grid": {
          display: "grid",
          "grid-template-rows": "auto 1fr",
          "min-height": "100dvh",
          width: "100dv",
        },
      });
    },
  ],
};
