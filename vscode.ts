import { JsonFile } from "projen";
import type { TypeScriptProject } from "projen/lib/typescript";

export function configureVSCode(project: TypeScriptProject) {
  // settings file
  new JsonFile(project, ".vscode/settings.json", {
    newline: true,
    obj: {
      "editor.codeActionsOnSave": {
        "source.fixAll": true,
        "source.organizeImports": true,
      },
      "editor.formatOnSave": true,
      "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
      },
      "[jsonc]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
      },
      "[yaml]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
      },
      "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
      },
      "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
      },
      "eslint.useESLintClass": true,
      "eslint.options": {
        cache: true,
        reportUnusedDisableDirectives: "error",
      },
      "typescript.tsdk": "node_modules/typescript/lib",
      "jest.autoRun": "off",
      "jest.jestCommandLine": "npm test --",
      "json.schemaDownload.enable": true,
    },
  });

  // recommended extensions
  new JsonFile(project, ".vscode/extensions.json", {
    newline: true,
    marker: false,
    obj: {
      recommendations: [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "github.vscode-pull-request-github",
        "streetsidesoftware.code-spell-checker",
        "orta.vscode-jest",
        "amazonwebservices.aws-toolkit-vscode",
        "ms-azuretools.vscode-docker",
      ],
      unwantedRecommendations: [
        "DavidAnson.vscode-markdownlint",
        "GoogleCloudTools.cloudcode",
        "ms-kubernetes-tools.vscode-kubernetes-tools",
      ],
    },
  });
}
