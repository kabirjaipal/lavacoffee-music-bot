const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const manager = require("../../handlers/lavacoffeeManager");
const { LoadTypes } = require("lavacoffee/dist/utils");
const { MessageEmbed } = require("discord.js");
const { formatDuration } = require("../../handlers/functions");
module.exports = new Command({
  // options
  name: "play",
  description: `play your favourate song with me`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  options: [
    {
      name: "song",
      description: "give song name or url",
      type: "STRING",
      required: true,
    },
  ],
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let quary = interaction.options.getString("song");
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
    } else if (interaction.guild.me.voice.serverMute === true) {
      return client.embed(
        interaction,
        `${emoji.ERROR} Sorry, I can't join voice channel , i am muted`
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
      if (!player.voiceConnected) await player.connect();

      let res = await manager.search({ query: quary }, interaction.user);
      switch (res.loadType) {
        case LoadTypes.LoadFailed:
          {
            if (!player || !player.queue.current) player.destroy();
            return client.embed(
              interaction,
              `${emoji.ERROR} Search Failed Reason :- \`${res.error.message}\``
            );
          }
          break;
        case LoadTypes.NoMatches:
          {
            if (!player || !player.queue.current) player.destroy();
            return client.embed(
              interaction,
              `${emoji.ERROR} No Result Found For \`${quary}\``
            );
          }
          break;
        case LoadTypes.PlaylistLoaded:
          {
            let playlist = res.tracks[0];
            await player.queue.add(res.tracks);
            interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor(ee.color)
                  .setAuthor({
                    name: `Playlist Added to Queue`,
                    iconURL: playlist.displayThumbnail(),
                    url: playlist.url,
                  })
                  .setDescription(
                    ` ${emoji.SUCCESS} [\`${res.playlist.name}\`](${playlist.url})`
                  )
                  .addFields([
                    {
                      name: `** Requested By **`,
                      value: `${playlist.requester}`,
                      inline: true,
                    },
                    {
                      name: `** Duration **`,
                      value: `\`${formatDuration(res.playlist.duration)}\``,
                      inline: true,
                    },
                    {
                      name: `** Tracks **`,
                      value: `\`${res.tracks.length} Tracks\``,
                      inline: true,
                    },
                  ])
                  .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon,
                  }),
              ],
            });
            if (!player.queue.current) {
              player.play({}).catch((e) => {
                console.log(e);
              });
            }
          }
          break;
        case LoadTypes.SearchResult:
          {
            let track = res.tracks[0];
            await player.queue.add(track);
            interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor(ee.color)
                  .setAuthor({
                    name: `Added to Queue`,
                    iconURL: track?.displayThumbnail(),
                    url: track.url,
                  })
                  .setDescription(
                    ` ${emoji.SUCCESS} [\`${track.title}\`](${track.url})`
                  )
                  .addFields([
                    {
                      name: `** Requested By **`,
                      value: `${track.requester}`,
                      inline: true,
                    },
                    {
                      name: `** Duration **`,
                      value: `\`${formatDuration(track.duration)}\``,
                      inline: true,
                    },
                  ])
                  .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon,
                  }),
              ],
            });
            if (!player.queue.current) {
              player.play().catch((e) => {
                console.log(e);
              });
            }
          }
          break;
        case LoadTypes.TrackLoaded:
          {
            let track = res.tracks[0];
            await player.queue.add(track);
            interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor(ee.color)
                  .setAuthor({
                    name: `Added to Queue`,
                    iconURL: track?.displayThumbnail(),
                    url: track.url,
                  })
                  .setDescription(
                    ` ${emoji.SUCCESS} [\`${track.title}\`](${track.url})`
                  )
                  .addFields([
                    {
                      name: `** Requested By **`,
                      value: `${track.requester}`,
                      inline: true,
                    },
                    {
                      name: `** Duration **`,
                      value: `\`${formatDuration(track.duration)}\``,
                      inline: true,
                    },
                  ])
                  .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon,
                  }),
              ],
            });
            if (!player.queue.current) {
              player.play().catch((e) => {
                console.log(e);
              });
            }
          }
          break;
        default:
          break;
      }
    }
  },
});
