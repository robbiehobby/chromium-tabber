module.exports = {
  content: ["public/**/*.html"],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes").light,
          primary: "#1c73e7",
          secondary: "#1c73e7",
          neutral: "#ced4da",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes").dark,
          primary: "#71b1ff",
          secondary: "#71b1ff",
          neutral: "#343a40",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
