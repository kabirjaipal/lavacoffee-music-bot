const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const manager = require("../../handlers/lavacoffeeManager");
module.exports = new Command({
  // options
  name: "join",
  description: `join your voice channel`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let botchannel = interaction.guild.me.voice.channel;
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
    } else {
      let player = await manager.players.get(interaction.guildId);
      if (!player) {
        player = await manager.create({
          guildID: interaction.guildId,
          selfDeaf: true,
          selfMute: false,
          voiceID: channel.id,
          volume: 70,
          metadata: {
            text: interaction.channel,
            voice: channel,
          },
        });
      }
      if (!player.voiceConnected) {
        await player.connect();
        return client.embed(
          interaction,
          `${emoji.SUCCESS} Joined ${channel} Voice Channel`
        );
      } else {
        return client.embed(
          interaction,
          `${emoji.SUCCESS} Joined ${channel} Voice Channel`
        );
      }
    }
  },
});
