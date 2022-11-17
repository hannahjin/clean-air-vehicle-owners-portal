module.exports = {
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: [["builtin", "external"], "internal", "sibling", "type"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        alphabetize: {
          order: "asc",
        },
      },
    ],
  },
};
