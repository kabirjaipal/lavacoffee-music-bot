const { MessageEmbed } = require("discord.js");
const client = require("..");
const ee = require("../settings/embed.json");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  let prefix = "!"
  let mentionprefix = new RegExp(
    `^(<@!?${client.user?.id}>|${mentionprefixnew(prefix)})`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  if (nprefix.includes(client.user.id)) {
    message.reply(`**To See My All Commans Type **\`/help\``);
  }
});

function mentionprefixnew(newprefix) {
  return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
