const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { formatDuration } = require("../../handlers/functions");
const manager = require("../../handlers/lavacoffeeManager");
const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const { LoadTypes } = require("lavacoffee/dist/utils/rest");

module.exports = new Command({
  // options
  name: "search",
  description: `search your fav song`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 10,
  options: [
    {
      name: "input",
      description: "The search input (name/url)",
      required: true,
      type: "STRING",
    },
  ],
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
      const query = interaction.options.getString("input");
      let player = manager.get(interaction.guildId);
      if (!player)
        player = manager.create({
          guildID: interaction.guildId,
          voiceID: channel.id,
          volume: 80,
          selfDeaf: true,
          metadata: {
            text: interaction.channelId,
          },
        });

      if (!player.voiceConnected) await player.connect();

      const but = new MessageButton()
        .setCustomId("s_one")
        .setLabel("1")
        .setStyle("SUCCESS");
      const but2 = new MessageButton()
        .setCustomId("s_two")
        .setLabel("2")
        .setStyle("SUCCESS");
      const but3 = new MessageButton()
        .setCustomId("s_three")
        .setLabel("3")
        .setStyle("SUCCESS");
      const but4 = new MessageButton()
        .setCustomId("s_four")
        .setLabel("4")
        .setStyle("SUCCESS");
      const but5 = new MessageButton()
        .setCustomId("s_five")
        .setLabel("5")
        .setStyle("SUCCESS");
      const row = new MessageActionRow().addComponents(
        but,
        but2,
        but3,
        but4,
        but5
      );

      let s = await manager.search({ query: query }, interaction.user);
      switch (s.loadType) {
        case LoadTypes.TrackLoaded:
          player.queue.add(s.tracks[0]);
          client.embed(
            interaction,
            `**Added to queue** - [${s.tracks[0].title}](${
              s.tracks[0].url
            }) \`${formatDuration(s.tracks[0].duration)}\` • ${
              s.tracks[0].requester
            }`
          );
          if (!player.queue.current) player.play();
          break;
        case LoadTypes.SearchResult:
          let index = 1;
          const tracks = s.tracks.slice(0, 5);
          const results = s.tracks
            .slice(0, 5)
            .map(
              (x) =>
                `• ${index++} | [${x.title}](${x.url}) \`${formatDuration(
                  x.duration
                )}\``
            )
            .join("\n");
          const searched = new MessageEmbed()
            .setTitle("Select the track that you want")
            .setColor(ee.color)
            .setDescription(results);

          let mainmsg = await interaction.followUp({
            embeds: [searched],
            components: [row],
          });
          const search = new MessageEmbed().setColor(ee.color);

          const collector = interaction.channel.createMessageComponentCollector(
            {
              filter: (f) =>
                f.userId === interaction.authorId
                  ? true
                  : false && f.deferUpdate(),
              max: 1,
              time: 60000,
              idle: 60000 / 2,
            }
          );
          collector.on("end", async (collected) => {
            await mainmsg.edit({
              components: [
                new MessageActionRow().addComponents(
                  but.setDisabled(true),
                  but2.setDisabled(true),
                  but3.setDisabled(true),
                  but4.setDisabled(true),
                  but5.setDisabled(true)
                ),
              ],
            });
          });
          collector.on("collect", async (b) => {
            if (!b.deferred) await b.deferUpdate();
            if (!player && !collector.ended) return collector.stop();

            if (b.customId === "s_one") {
              player.queue.add(s.tracks[0]);
              if (
                player &&
                player.state === "CONNECTED" &&
                !player.playing &&
                !player.paused &&
                !player.queue.size
              )
                await player.play();

              await interaction.followUp({
                embeds: [
                  search.setDescription(
                    ` **Added to queue** - [${s.tracks[0].title}](${
                      s.tracks[0].url
                    }) \`${formatDuration(s.tracks[0].duration, true)}\` • ${
                      interaction.member.user
                    }`
                  ),
                ],
              });
            } else if (b.customId === "s_two") {
              player.queue.add(s.tracks[1]);
              if (!player.queue.current) await player.play();

              await interaction.followUp({
                embeds: [
                  search.setDescription(
                    ` **Added to queue** - [${s.tracks[1].title}](${
                      s.tracks[1].url
                    }) \`${formatDuration(s.tracks[1].duration, true)}\` • ${
                      interaction.member.user
                    }`
                  ),
                ],
              });
            } else if (b.customId === "s_three") {
              player.queue.add(s.tracks[2]);
              if (!player.queue.current) await player.play();

              await interaction.followUp({
                embeds: [
                  search.setDescription(
                    ` **Added to queue** - [${s.tracks[2].title}](${
                      s.tracks[2].url
                    }) \`${formatDuration(s.tracks[2].duration, true)}\` • ${
                      interaction.member.user
                    }`
                  ),
                ],
              });
            } else if (b.customId === "s_four") {
              player.queue.add(s.tracks[3]);
              if (!player.queue.current) await player.play();

              await interaction.followUp({
                embeds: [
                  search.setDescription(
                    ` **Added to queue** - [${s.tracks[3].title}](${
                      s.tracks[3].url
                    }) \`${formatDuration(s.tracks[3].duration, true)}\` • ${
                      interaction.member.user
                    }`
                  ),
                ],
              });
            } else if (b.customId === "s_five") {
              player.queue.add(s.tracks[4]);
              if (!player.queue.current) await player.play();

              await interaction.followUp({
                embeds: [
                  search.setDescription(
                    ` **Added to queue** - [${s.tracks[4].title}](${
                      s.tracks[4].url
                    }) \`${formatDuration(s.tracks[4].duration, true)}\` • ${
                      s.tracks[4].requester
                    }`
                  ),
                ],
              });
            }
          });
      }
    }
  },
});
