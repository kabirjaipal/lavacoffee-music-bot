const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { MessageEmbed } = require("discord.js");
const manager = require("../../handlers/lavacoffeeManager");

module.exports = new Command({
  // options
  name: "247",
  description: `toggle 24/7 system in your server`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let player = await manager.players.get(interaction.guild.id);

    let { channel } = interaction.member.voice;
    if (!channel) {
      return client.embed(
        interaction,
        `${emoji.ERROR} You Need To Join Voice Channel`
      );
    } else if (!player || !player.queue.current) {
      return client.embed(
        interaction,
        `${emoji.ERROR} Nothing Playing Right Now`
      );
    } else {
      let mode = player.twentyFourSeven || false;
      if (mode === true) {
        player.twentyFourSeven = false;
        return client.embed(interaction, "24/7 mode is **disabled**");
      } else {
        player.twentyFourSeven = true;
        return client.embed(interaction, "24/7 mode is **Enable**");
      }
    }
  },
});
