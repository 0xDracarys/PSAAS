/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  trailingComma: "es5",
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
  arrowParens: "avoid",
  bracketSpacing: true,
  bracketSameLine: false,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./postcss.config.mjs",
  overrides: [
    {
      files: "*.md",
      options: {
        printWidth: 100,
      },
    },
  ],
}
