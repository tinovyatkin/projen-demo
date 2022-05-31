/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { javascript } from "projen";
import type { TypeScriptProject } from "projen/lib/typescript";

/**
 * @see {@link https://github.com/projen/projen/blob/master/src/javascript/eslint.ts}
 */

export const eslintOptions: javascript.EslintOptions = {
  prettier: false,
  dirs: ["src"],
  devdirs: ["test", "projenrc"],
};

export function configureESLint(project: TypeScriptProject) {
  // remove extra deps
  [
    "eslint-import-resolver-node",
    "eslint-import-resolver-typescript",
    "eslint-plugin-import",
    "json-schema",
    "eslint-plugin-prettier",
  ].forEach((dep) => project.deps.removeDependency(dep));

  const eslint = project.eslint!;
  const eslintRc = project.tryFindObjectFile(".eslintrc.json")!;

  eslintRc.addOverride("extends", [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ]);

  Object.keys(eslint.config.settings).forEach((setting) => {
    if (setting.startsWith("import/"))
      eslintRc.addDeletionOverride(`settings.${setting}`);
  });
  eslintRc.addDeletionOverride("plugins");
  eslintRc.addDeletionOverride("parser");

  eslintRc.addOverride("parserOptions.ecmaVersion", 2022);
  eslintRc.addDeletionOverride("rules.prettier/prettier");
  eslintRc.addDeletionOverride("rules.no-duplicate-imports");
  Object.keys(eslint.rules).forEach((rule) => {
    if (rule.startsWith("import/"))
      eslintRc.addDeletionOverride(`rules.${rule}`);
  });

  eslint.addRules({
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/dot-notation": "warn",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // Require use of the `import { foo } from 'bar';` form instead of `import foo = require('bar');`
    "@typescript-eslint/no-require-imports": ["error"],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", disallowTypeAnnotations: false },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        caughtErrors: "all",
        argsIgnorePattern: "^_",
      },
    ],

    "@typescript-eslint/no-namespace": ["warn", { allowDeclarations: true }],
    "@typescript-eslint/no-empty-interface": [
      "error",
      {
        allowSingleExtends: true,
      },
    ],
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/non-nullable-type-assertion-style": "warn",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/promise-function-async": [
      "error",
      { checkArrowFunctions: false },
    ],
    "@typescript-eslint/sort-type-union-intersection-members": "warn",

    "sort-imports": "off", // we use TypeScripts' organize imports feature
  });
}
