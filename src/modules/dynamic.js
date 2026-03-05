import { createRequire } from "node:module";
import { argv } from "node:process";

const dynamic = async () => {
  // Write your code here
  // Accept plugin name as CLI argument
  // Dynamically import plugin from plugins/ directory
  // Call run() function and print result
  // Handle missing plugin case

  const require = createRequire(import.meta.url);

  const pluginName = argv[2];

  try {
    if (!pluginName) throw new Error();

    const plugin = require(`./plugins/${pluginName}.js`);
    console.log(plugin.run());
  } catch {
    console.log("Plugin not found");
    process.exit(1);
  }
};

await dynamic();
