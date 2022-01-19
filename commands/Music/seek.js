const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { MessageEmbed } = require("discord.js");
const manager = require("../../handlers/lavacoffeeManager");
const ms = require("ms");
const { formatDuration } = require("../../handlers/functions");

module.exports = new Command({
  // options
  name: "seek",
  description: `seek current song`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 10,
  options: [
    {
      name: "time",
      description: "<10s || 10m || 10h>",
      required: true,
      type: 'STRING',
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
      const time = ms(interaction.options.getString("time"));
      const position = player.position;
      const duration = player.queue.current.duration;
      const song = player.queue.current;

      if (time <= duration) {
        if (time > position) {
          player.seek(time);
          client.embed(
            interaction,
            `${emoji.forward} **Forward**\n[${song.title}](${
              song.url
            })\n\`${formatDuration(time)} / ${formatDuration(duration)}\``
          );
        } else {
          player.seek(time);
          client.embed(
            interaction,
            `${emoji.rewind} **Rewind**\n[${song.title}](${
              song.url
            })\n\`${formatDuration(time)} / ${formatDuration(duration)}\``
          );
        }
      } else {
        client.embed(
          interaction,
          `Seek duration exceeds Song duration.\nSong duration: \`${formatDuration(
            duration
          )}\``
        );
      }
    }
  },
});
