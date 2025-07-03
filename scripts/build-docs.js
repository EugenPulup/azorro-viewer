import { bundleArazzo, createArazzoConfig, lintArazzo } from "../index.js";
import { writeFileSync } from "node:fs";

const argPath = process.argv.find((a) => a.startsWith("--path="));
const argOutput = process.argv.find((a) => a.startsWith("--output="));

function mapByOperationId(spec) {
  const table = {};
  for (const [apiPath, methods] of Object.entries(spec.paths ?? {})) {
    for (const [method, op] of Object.entries(methods)) {
      if (op?.operationId) {
        table[op.operationId] = {
          method: method.toUpperCase(),
          path: apiPath,
          op: op,
        };
      }
    }
  }
  return table;
}

if (!argPath) {
  console.error(
    "path argument is required. Usage: node build-docs.js --path=<path-to-spec>"
  );
  process.exit(1);
}

const config = await createArazzoConfig();

const specPath = argPath.replace(/^--?path=/, "");
const specOutput = argOutput?.replace(/^--?output=/, "");

try {
  await lintArazzo(specPath, config);

  console.log("Linting completed successfully.");
} catch (error) {
  console.error(error);
  process.exit(1);
}

try {
  const bundleResults = await bundleArazzo(specPath, config);

  if (specOutput) {
    if (bundleResults.parsed?.sourceDescriptions.length > 0) {
      let sources = {};

      for (const source of bundleResults.parsed.sourceDescriptions) {
        const bundledSpec = await bundleArazzo(source.url, config);

        sources[source.name] = mapByOperationId(bundledSpec.parsed);
      }

      writeFileSync(
        `${specOutput}/spec.sources.json`,
        JSON.stringify(sources, null, 2)
      );
    }

    writeFileSync(
      `${specOutput}/spec.json`,
      JSON.stringify(bundleResults.parsed, null, 2)
    );

    console.log(`Bundled specification written to ${specOutput}`);
  }

  console.log("Bundling completed successfully.");
} catch (error) {
  console.error("Error bundling the spec:", error);
  process.exit(1);
}
