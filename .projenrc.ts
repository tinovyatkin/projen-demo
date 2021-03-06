import { aws_lambda } from "aws-cdk-lib";
import {
  Architecture,
  LambdaInsightsVersion,
  Tracing,
} from "aws-cdk-lib/aws-lambda";
import { awscdk, javascript, TextFile } from "projen";
import { configureESLint, eslintOptions } from "./projenrc/eslint";
import { configureGitHooks } from "./projenrc/git-hooks";
import { configureJest, jestOptions } from "./projenrc/jest";
import { configureVSCode } from "./projenrc/vscode";

/**
 * @see {@link https://projen.io/api/API.html#projen-awscdk-awscdktypescriptapp}
 */

const project = new awscdk.AwsCdkTypeScriptApp({
  name: "Worldcoin ID Discord Bot",
  description:
    "Demo bot for verification via Worldcoin ID on a discord channel",
  packageName: "worldcoin-id-discord-example",
  license: "MIT",
  copyrightOwner: "Humanity Corporation",
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  defaultReleaseBranch: "main",
  cdkVersion: "2.25.0",
  constructsVersion: "10.1.22",
  minNodeVersion: "16.14.0",
  dependabot: true,
  depsUpgrade: false,
  jestOptions,
  eslintOptions,
  prettier: true,
  vscode: true,
  lambdaOptions: {
    tracing: Tracing.ACTIVE,
    insightsVersion: LambdaInsightsVersion.VERSION_1_0_119_0,
    architecture: Architecture.ARM_64,
    // @ts-expect-error projen still doesn't support it
    runtime: aws_lambda.Runtime.NODEJS_16_X,
  },
  deps: [
    "@mrgrain/cdk-esbuild@cdk-v2",
    "discord-bot-cdk-construct",
    "discord.js",
    "@discordjs/rest",
    "discord-api-types",
  ],
  devDeps: ["prettier-plugin-organize-imports"],
  tsconfig: {
    compilerOptions: {
      target: "es2022",
      lib: ["ES2022"],
      noEmit: true,
      skipLibCheck: true,
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"],
        "~/*": ["./*"],
      },
    },
  },
});

// Add generated files to prettier ignore
project.prettier?.ignoreFile?.addPatterns(
  ".eslintrc.json",
  ".github/pull_request_template.md",
  ".vscode/settings.json",
  "cdk.json",
  "tsconfig.*"
);

// Add ts-node settings to tsconfig
[project.tsconfig, project.tsconfigDev].forEach((tsconfig) => {
  tsconfig?.file.addOverride("ts-node", {
    preferTsExts: true,
    experimentalResolver: true,
    experimentalSpecifierResolution: "node",
    ignoreDiagnostics: [6133],
  });
});

// Remove projen CDK bundle
project.cdkConfig.json.addDeletionOverride("build");
project.tasks.removeTask("bundle");

// Creating .npmrc
new TextFile(project, ".npmrc", {
  lines: [
    '# ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".',
    "fund=false",
    "loglevel=error",
    "engine-strict=true",
    "send-metrics=false",
    "legacy-peer-deps=true",
  ],
});

configureVSCode(project);
configureESLint(project);
configureGitHooks(project);
configureJest(project);

project.synth();
