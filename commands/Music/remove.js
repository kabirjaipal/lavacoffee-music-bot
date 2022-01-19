const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { MessageEmbed } = require("discord.js");
const manager = require("../../handlers/lavacoffeeManager");

module.exports = new Command({
  // options
  name: "remove",
  description: `remove a song from queue `,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 10,
  options: [
    {
      name: "index",
      description: "index of song in queue",
      required: true,
      type: "NUMBER",
    },
  ],

  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let botchannel = interaction.guild.me.voice.channel;
    let player = await manager.players.get(interaction.guild.id);

    let { channel } = interaction.member.voice;
    if (!channel) {
      return client.embed(
        interaction,
        `${emoji.ERROR} You Need To Join Voice Channel`
      );
    } else if (channel.userLimit !== 0 && channel.full) {
      return client.embed(
        interaction,
        `${emoji.ERROR} Your Voice Channel is Full , i can't Join`
      );
    } else if (botchannel && !botchannel.equals(channel)) {
      return client.embed(
        interaction,
        `You Need to Join ${botchannel} To Listen Song With Me..`
      );
    } else if (!player || !player.queue.current) {
      return client.embed(
        interaction,
        `${emoji.ERROR} Nothing Playing Right Now`
      );
    } else {
      const position = interaction.options.getNumber("index") - 1;
      if (position > player.queue.size) {
        const number = position + 1;
        client.embed(
          interaction,
          `No songs at number ${number}.\nTotal Songs: ${player.queue.size}`
        );
      }

      const song = player.queue[position];
      player.queue.remove(position);
      return client.embed(
        interaction,
        `${emoji.SUCCESS} Removed\n[${song.title}](${song.url})`
      );
    }
  },
});
