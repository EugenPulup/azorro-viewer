import {
  lint,
  createConfig,
  bundle,
  bundleFromString,
} from "@redocly/openapi-core";

export async function createArazzoConfig(config) {
  return createConfig({ ...config, extends: ["minimal"] });
}

export async function lintArazzo(path, config) {
  const lintResult = await lint({ ref: path, config });

  if (lintResult.length > 0) {
    throw new Error(
      `Linting failed with ${lintResult.length} problems:\n` +
        lintResult
          .map((problem) => `${problem.severity}: ${problem.message}`)
          .join("\n")
    );
  }

  return true;
}

export async function bundleArazzo(path, config) {
  const bundleResult = await bundle({ ref: path, config });

  if (bundleResult.problems.length > 0) {
    throw new Error(
      `Bundling failed with ${bundleResult.problems.length} problems:\n` +
        bundleResult.problems
          .map((problem) => `${problem.severity}: ${problem.message}`)
          .join("\n")
    );
  }

  return bundleResult.bundle;
}
