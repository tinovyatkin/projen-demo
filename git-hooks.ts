import { Component } from "projen";
import type { NodeProject } from "projen/lib/javascript";
import { exec } from "projen/lib/util";

/**
 * @see {@link https://github.com/okonet/lint-staged}
 * @see {@link https://github.com/typicode/husky}
 */
export function configureGitHooks(project: NodeProject) {
  project.addDevDeps("husky", "lint-staged");
  project.setScript("prepare", "husky install");

  project.components.push(
    new (class extends Component {
      postSynthesize(): void {
        exec(
          `npx husky set .husky/pre-commit "FORCE_COLOR=1 npx lint-staged --concurrent=false"`,
          {
            cwd: project.outdir,
          }
        );
      }
    })(project)
  );

  project.package.addField("lint-staged", {
    "*.{ts,tsx}": "eslint --cache --fix",
    "*.{ts,js,mjs,css,svg,json,md,yaml,graphql,mjml}": "prettier --write",
  });
}
