const { Client } = require("discord.js");
const manager = require("./lavacoffeeManager");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  manager.on("nodeConnect", async (node) => {
    console.log(
      "Node Connected: %s, Plugins: %s",
      node.options.name,
      node.plugins.size
        ? (() => {
            const plugins = [];
            for (const plugin of node.plugins.keys()) {
              plugins.push(plugin);
            }
            return plugins.join(" , ");
          })()
        : "(none)"
    );
  });
  manager.on("nodeCreate", async (node) => {
    console.log("Node Created: %s", node.options.name);
  });
  manager.on("nodeDestroy", async (node) => {
    console.log("Node Destroyed: %s", node.options.name);
  });
  manager.on("nodeDisconnect", async (node, reason) => {
    console.log(
      "Node Disconnected: %s, Code: %d, Reason: %s",
      node.options.name,
      reason.code,
      reason.reason
    );
  });
  manager.on("nodeError", async (node, error) => {
    console.log("Node Error: %s, Error: %O", node.options.name, error);
  });
  manager.on("nodeMissingPlugins", async (node, missing) => {
    console.log(
      "Node Missing Plugins: %s, Missing: %s",
      node.options.name,
      missing.join(" , ")
    );
  });
  manager.on("nodeReconnect", async (node) => {
    console.log("Node Reconnecting: %s", node.options.name);
  });
};
