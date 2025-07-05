const config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,

  plugins: ["prettier-plugin-jinja-template"],
  overrides: [
    {
      files: ["*.njk"],
      options: {
        parser: "jinja-template",
      },
    },
  ],
};

export default config;
