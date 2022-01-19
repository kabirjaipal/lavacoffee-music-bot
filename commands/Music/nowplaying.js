const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { MessageEmbed } = require("discord.js");
const manager = require("../../handlers/lavacoffeeManager");
const { formatDuration , bar } = require("../../handlers/functions");
module.exports = new Command({
  // options
  name: "nowplaying",
  description: `see what now playing`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 10,
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
      let song = player.queue.current;
      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`** ${emoji.playing} Now Playing **`)
            .setDescription(
              `[${song.title}](${
                song.url
              }) - \`[${formatDuration(song.duration)}]\`- [${
                song.requester
              }] \n\n\`${bar(player)}\``
            )
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
      });
    }
  },
});
