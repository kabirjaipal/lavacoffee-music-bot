const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { MessageEmbed } = require("discord.js");
const manager = require("../../handlers/lavacoffeeManager");
const { formatDuration, bar } = require("../../handlers/functions");
const { LoopMode } = require("lavacoffee/dist/utils");
module.exports = new Command({
  // options
  name: "loop",
  description: `set loop in queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 10,
  options: [
    {
      name: "input",
      description: "The looping input (track or queue or off).",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "Track",
          value: "t",
        },
        {
          name: "Queue",
          value: "q",
        },
        {
          name: "Off",
          value: "o",
        },
      ],
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
      let loopmode = interaction.options.getString("input");
      if (loopmode === "t") {
        if (player.loop === LoopMode.Track) {
          player.setLoop(LoopMode.None);
          client.embed(interaction, `${emoji.repeat_mode} Track Loop Off`);
        } else {
          player.setLoop(LoopMode.Track);
          client.embed(interaction, `${emoji.repeat_mode} Track Loop On`);
        }
      } else if (loopmode === "q") {
        if (player.loop === LoopMode.Queue) {
          player.setLoop(LoopMode.None);
          client.embed(interaction, `${emoji.repeat_mode} Queue Loop Off`);
        } else {
          player.setLoop(LoopMode.Queue);
          client.embed(interaction, `${emoji.repeat_mode} Queue Loop On`);
        }
      } else if (loopmode === "o") {
        player.setLoop(LoopMode.None);
        client.embed(interaction, `${emoji.repeat_mode} Loop Off`);
      }
    }
  },
});
