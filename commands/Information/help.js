const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const { readdirSync } = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = new Command({
  // options
  name: "help",
  description: `need help ? click now to see commands`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["SEND_MESSAGES"],
  category: "Information",
  cooldown: 10,
  options: [
    {
      name: "cmd",
      description: `Give cmd name`,
      type: "STRING",
      required: false,
    },
  ],
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    let cmd = interaction.options.getString("cmd");
    if (!cmd) {
      let categories = [];
      readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );
        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "No command name.";

          let name = file.name.replace(".js", "");

          return `\`${name}\``;
        });

        let data = new Object();

        data = {
          name: `___${dir.toUpperCase()}___`,
          value: `>>> ${
            cmds.length === 0
              ? "In progress."
              : cmds.join(" , ") || "In progress."
          }`,
        };

        categories.push(data);
      });

      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setColor(ee.embed_color)
            .setTitle(`📬 My All Commands`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields(categories)
            .setDescription(
              `Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help ping\`.`
            )
            .setTimestamp()
            .setFooter({
              text: `Requested By ${interaction.user.tag}`,
              iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    } else {
      const command = client.commands.get(cmd.toLowerCase());
      if (!command) {
        return interaction.followUp(
          `:x: Inavlid Command , ${prefix}help to see all Commands`
        );
      } else {
        let embed = new MessageEmbed()
          .setColor(ee.embed_color)
          .setTitle(`${command.name} Command Info `)
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .addFields([
            {
              name: `⚙️ Command Name`,
              value: `>>> \`${command.name}\``,
            },
            {
              name: `⚙️ Command Description`,
              value: `>>> \`${command.description}\``,
            },
            {
              name: `⚙️ Member Permission`,
              value: `>>> \`\`\`${command.userPermissions.join(" , ")}\`\`\``,
            },
            {
              name: `⚙️ Bot Permission`,
              value: `>>> \`\`\`${command.botPermissions.join(" , ")}\`\`\``,
            },
            {
              name: `⚙️ Command Category`,
              value: `>>> ${command.category}`,
            },
            {
              name: `⚙️ Command Cooldown`,
              value: `>>> \`${command.cooldown} Seconds\``,
            },
          ])
          .setFooter({
            text: `Requested By ${interaction.user.tag}`,
            iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
          });

        interaction.followUp({ embeds: [embed] });
      }
    }
  },
});