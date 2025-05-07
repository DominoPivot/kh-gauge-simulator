import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import reactDom from "eslint-plugin-react-dom";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ["./tsconfig.node.json", "./tsconfig.app.json"],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "react-x": reactX,
            "react-dom": reactDom,
            "@stylistic": stylistic,
            "@typescript-eslint": tseslint.plugin,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            ...reactX.configs["recommended-typescript"].rules,
            ...reactDom.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

            "@typescript-eslint/no-unused-vars": "off",
            "@stylistic/arrow-parens": "off",
            "@stylistic/member-delimiter-style": ["warn", {
                multiline: { delimiter: "comma" },
                singleline: { delimiter: "comma" },
            }],
        },
    },
);
