// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "perf",
        "chore",
        "docs",
        "test",
        "build",
        "ci",
        "style"
      ]
    ],
    "scope-empty": [2, "never"], // Exige um escopo (remova esta linha se quiser tornar opcional)
    "subject-case": [2, "always", "sentence-case"], // Primeiro caractere maiúsculo
  },
};
