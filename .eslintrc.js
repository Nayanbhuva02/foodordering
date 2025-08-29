module.exports = {
    root: true,
    extends: [
      "expo", // Expo’s recommended ESLint rules
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:react-native/all",
      "plugin:expo/recommended",
      "prettier"
    ],
    parser: "@typescript-eslint/parser",
    plugins: [
      "@typescript-eslint",
      "react",
      "react-hooks",
      "react-native",
      "expo",
      "prettier"
    ],
    rules: {
      "prettier/prettier": ["error"],
      "react-native/no-inline-styles": "off",
      "react-native/no-unused-styles": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  };
  