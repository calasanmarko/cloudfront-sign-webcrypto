import tsEslint from "typescript-eslint";
import prettierEslint from "eslint-config-prettier";

export default [
    ...tsEslint.configs.recommended,
    prettierEslint,
    {
        rules: {
            "padded-blocks": ["error", "never"],
            "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 0 }],
            "array-callback-return": ["error", { checkForEach: true }],
            "no-await-in-loop": "warn",
            "no-duplicate-imports": ["error", { includeExports: true }],
            "no-self-compare": "error",
            "no-unreachable-loop": "warn",
            "require-atomic-updates": "warn",
            "block-scoped-var": "error",
            camelcase: ["error", { properties: "never" }],
            "capitalized-comments": ["error", "always", { ignoreConsecutiveComments: true }],
            "consistent-return": "error",
            "consistent-this": "error",
            curly: ["error", "all"],
            "default-case": "error",
            "default-case-last": "error",
            "default-param-last": "error",
            eqeqeq: ["error", "always"],
            "func-name-matching": "error",
            "func-names": ["error", "as-needed"],
            "func-style": ["error", "expression"],
            "grouped-accessor-pairs": ["error", "getBeforeSet"],
            "guard-for-in": "error",
            "logical-assignment-operators": ["error", "always", { enforceForIfStatements: true }],
            "max-depth": ["error", 4],
            "new-cap": "error",
            "no-alert": "warn",
            "no-array-constructor": "error",
            "no-caller": "error",
            "no-div-regex": "error",
            "no-else-return": ["error", { allowElseIf: false }],
            "no-empty-function": "error",
            "no-eval": "error",
            "no-extend-native": "error",
            "no-extra-bind": "error",
            "no-extra-label": "error",
            "no-implicit-coercion": ["error", { boolean: false }],
            "no-implied-eval": "error",
            "no-invalid-this": "error",
            "no-iterator": "error",
            "no-label-var": "error",
            "no-labels": "error",
            "no-lone-blocks": "error",
            "no-lonely-if": "error",
            "no-loop-func": "error",
            "no-multi-assign": "error",
            "no-negated-condition": "error",
            "no-new": "error",
            "no-new-func": "error",
            "no-new-wrappers": "error",
            "no-object-constructor": "error",
            "no-octal-escape": "error",
            "no-proto": "error",
            "no-return-assign": "error",
            "no-script-url": "error",
            "no-sequences": "error",
            "no-throw-literal": "error",
            "no-undef-init": "error",
            "no-unneeded-ternary": "error",
            "no-unused-expressions": "error",
            "no-useless-call": "error",
            "no-useless-computed-key": "error",
            "no-useless-concat": "error",
            "no-useless-constructor": "error",
            "no-useless-rename": "error",
            "no-useless-return": "error",
            "no-var": "error",
            "no-void": "error",
            "no-warning-comments": "warn",
            "object-shorthand": "error",
            "one-var": ["error", "never"],
            "operator-assignment": "error",
            "prefer-arrow-callback": "error",
            "prefer-const": "error",
            "prefer-destructuring": ["error", { object: true, array: false }],
            "prefer-exponentiation-operator": "error",
            "prefer-named-capture-group": "error",
            "prefer-numeric-literals": "error",
            "prefer-object-has-own": "error",
            "prefer-object-spread": "error",
            "prefer-promise-reject-errors": "error",
            "prefer-regex-literals": "error",
            "prefer-rest-params": "error",
            "prefer-spread": "error",
            "prefer-template": "error",
            radix: "error",
            "require-await": "error",
            "require-unicode-regexp": "error",
            semi: ["error", "always"],
            "symbol-description": "error",
            "vars-on-top": "error",
            yoda: "error",
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/class-literal-property-style": "error",
            "@typescript-eslint/consistent-generic-constructors": "error",
            "@typescript-eslint/consistent-indexed-object-style": "error",
            "@typescript-eslint/consistent-type-assertions": "error",
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            "@typescript-eslint/consistent-type-imports": "error",
            "default-param-last": "off",
            "@typescript-eslint/default-param-last": "error",
            "init-declarations": "off",
            "@typescript-eslint/init-declarations": "error",
            "@typescript-eslint/method-signature-style": "error",
            "@typescript-eslint/no-confusing-non-null-assertion": "error",
            "@typescript-eslint/no-dynamic-delete": "error",
            "no-empty-function": "off",
            "@typescript-eslint/no-empty-function": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-extraneous-class": "error",
            "@typescript-eslint/no-import-type-side-effects": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/no-invalid-void-type": "error",
            "no-loop-func": "off",
            "@typescript-eslint/no-loop-func": "error",
            "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
            "@typescript-eslint/no-unsafe-declaration-merging": "error",
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": [
                "error",
                { typedefs: false, classes: false, ignoreTypeReferences: true, allowNamedExports: true },
            ],
            "no-useless-constructor": "off",
            "@typescript-eslint/no-useless-constructor": "error",
            "@typescript-eslint/no-useless-empty-export": "error",
            "@typescript-eslint/parameter-properties": "error",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/prefer-literal-enum-member": "warn",
            "@typescript-eslint/unified-signatures": "error",
        },
    },
    {
        ignores: ["**/dist/*", "**/node_modules/*"],
    },
];
