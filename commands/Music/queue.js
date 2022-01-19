const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const emoji = require("../../settings/emoji.json");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const manager = require("../../handlers/lavacoffeeManager");
const load = require("lodash");
const pms = require("pretty-ms");

module.exports = new Command({
  // options
  name: "queue",
  description: `see current queue`,
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
      if (!player.queue.size || player.queue.size === 0) {
        const embed = new MessageEmbed()
          .setColor(ee.color)
          .setDescription(
            `Now playing [${player.queue.current.title}](${
              player.queue.current.url
            }) • \`[ ${pms(player.position)} / ${pms(
              player.queue.current.duration
            )} ]\` • [${player.queue.current.requester}]`
          );

        await interaction.followUp({
          embeds: [embed],
        });
      } else {
        const mapping = player.queue.map(
          (t, i) =>
            `\` ${++i} \` • [${t.title}](${t.url}) • \`[ ${pms(
              t.duration
            )} ]\` • [${t.requester}]`
        );

        const chunk = load.chunk(mapping, 10);
        const pages = chunk.map((s) => s.join("\n"));
        let page = interaction.options.getNumber("page");
        if (!page) page = 0;
        if (page) page = page - 1;
        if (page > pages.length) page = 0;
        if (page < 0) page = 0;

        if (player.queue.size < 10 || player.queue.totalSize < 10) {
          const embed2 = new MessageEmbed()
            .setTitle(`${interaction.guild.name} Server Queue`)
            .setColor(ee.color)
            .setDescription(
              `**Now playing**\n[${player.queue.current.title}](${
                player.queue.current.url
              }) • \`[ ${pms(player.position)} / ${pms(
                player.queue.current.duration
              )} ]\` • [${
                player.queue.current.requester
              }]\n\n**Queued Songs**\n${pages[page]}`
            )
            .setFooter({
              text: `Page ${page + 1}/${pages.length}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(player.queue.current.displayThumbnail())
            .setTimestamp();

          await interaction
            .followUp({
              embeds: [embed2],
            })
            .catch(() => {});
        } else {
          const embed3 = new MessageEmbed()
            .setTitle(`${interaction.guild.name} Server Queue`)
            .setColor(ee.color)
            .setDescription(
              `**Now playing**\n[${player.queue.current.title}](${
                player.queue.current.url
              }) • \`[ ${pms(player.position)} / ${pms(
                player.queue.current.duration
              )} ]\` • [${
                player.queue.current.requester
              }]\n\n**Queued Songs**\n${pages[page]}`
            )
            .setFooter({
              text: `Page ${page + 1}/${pages.length}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(player.queue.current.thumbnail)
            .setTimestamp();

          const but1 = new MessageButton()
            .setCustomId("queue_cmd_but_1_app")
            .setEmoji("⏭️")
            .setStyle("PRIMARY");

          const dedbut1 = new MessageButton()
            .setDisabled(true)
            .setCustomId("queue_cmd_ded_but_1_app")
            .setEmoji("⏭️")
            .setStyle("SECONDARY");

          const but2 = new MessageButton()
            .setCustomId("queue_cmd_but_2_app")
            .setEmoji("⏮️")
            .setStyle("PRIMARY");

          const dedbut2 = new MessageButton()
            .setDisabled(true)
            .setCustomId("queue_cmd_ded_but_2_app")
            .setEmoji("⏮️")
            .setStyle("SECONDARY");

          const but3 = new MessageButton()
            .setCustomId("queue_cmd_but_3_app")
            .setEmoji("⏹️")
            .setStyle("DANGER");

          const dedbut3 = new MessageButton()
            .setDisabled(true)
            .setCustomId("queue_cmd_ded_but_3_app")
            .setEmoji("⏹️")
            .setStyle("SECONDARY");

          let mainmsg = await interaction
            .followUp({
              embeds: [embed3],
              components: [
                new MessageActionRow().addComponents([but2, but3, but1]),
              ],
            })
            .catch(() => {});

          const collector = interaction.channel.createMessageComponentCollector(
            {
              filter: (b) => {
                if (b.user.id === interaction.user.id) return true;
                else
                  return b
                    .followUp({
                      content: `Only **${interaction.user.tag}** can use this button, if you want then you've to run the command again.`,
                      ephemeral: true,
                    })
                    .catch(() => {});
              },
              time: 60000 * 5,
              idle: 30e3,
            }
          );

          collector.on("collect", async (button) => {
            if (button.customId === "queue_cmd_but_1_app") {
              await button.deferUpdate().catch(() => {});
              page = page + 1 < pages.length ? ++page : 0;

              const embed4 = new MessageEmbed()
                .setColor(ee.color)
                .setDescription(
                  `**Now playing**\n[${player.queue.current.title}](${
                    player.queue.current.url
                  }) • \`[ ${pms(player.position)} / ${pms(
                    player.queue.current.duration
                  )} ]\` • [${
                    player.queue.current.requester
                  }]\n\n**Queued Songs**\n${pages[page]}`
                )
                .setFooter({
                  text: `Page ${page + 1}/${pages.length}`,
                  iconURL: button.user.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(player.queue.current.thumbnail)
                .setTimestamp();

              await mainmsg.edit({
                embeds: [embed4],
                components: [
                  new MessageActionRow().addComponents([but2, but3, but1]),
                ],
              });
            } else if (button.customId === "queue_cmd_but_2_app") {
              await button.deferUpdate().catch(() => {});
              page = page > 0 ? --page : pages.length - 1;

              const embed5 = new MessageEmbed()
                .setColor(ee.color)
                .setDescription(
                  `**Now playing**\n[${player.queue.current.title}](${
                    player.queue.current.url
                  }) • \`[ ${pms(player.position)} / ${pms(
                    player.queue.current.duration
                  )} ]\` • [${
                    player.queue.current.requester
                  }]\n\n**Queued Songs**\n${pages[page]}`
                )
                .setFooter({
                  Text: `Page ${page + 1}/${pages.length}`,
                  iconURL: button.user.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(player.queue.current.thumbnail)
                .setTimestamp();

              await mainmsg
                .edit({
                  embeds: [embed5],
                  components: [
                    new MessageActionRow().addComponents([but2, but3, but1]),
                  ],
                })
                .catch(() => {});
            } else if (button.customId === "queue_cmd_but_3_app") {
              await button.deferUpdate().catch(() => {});
              await collector.stop();
            } else return;
          });

          collector.on("end", async () => {
            await mainmsg.edit({
              embeds: [embed3],
              components: [
                new MessageActionRow().addComponents([
                  dedbut2,
                  dedbut3,
                  dedbut1,
                ]),
              ],
            });
          });
        }
      }
    }
  },
});
