const { Client, TextChannel, MessageEmbed } = require("discord.js");
const { formatDuration } = require("./functions");
const manager = require("./lavacoffeeManager");
const ee = require("../settings/embed.json");
const emoji = require("../settings/emoji.json");
/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  // init manager
  require("./nodeevents")(client);
  client.on("ready", async () => {
    await manager.init(client.user.id);
  });
  // updating voice state
  client.on("raw", async (d) => {
    await manager.updateVoiceData(d);
  });
  // gettingg node event file

  // events
  manager.on("playerCreate", async (player) => {
    let channel = player.get("text");
    send(
      channel,
      `${emoji.SUCCESS} Joined ${player.get(
        "voice"
      )} Voice Channel From ${channel}`
    );
  });
  manager.on("playerDestroy", async (player) => {
    let channel = player.get("text");
    send(
      channel,
      `${emoji.ERROR} Someone disconnect me from ${player.get("voice")}`
    );
  });
  manager.on("playerMove", async (player, os, ns) => {
    let channel = player.get("text");
    send(channel, `${emoji.SUCCESS} Player Moved`);
  });
  manager.on("playerReplay", async (player) => {
    let channel = player.get("text");
    send(channel, `${emoji.SUCCESS} Player Replaying`);
  });
  manager.on("queueEnd", async (player, track) => {
    let channel = player.get("text");
    send(channel, `Queue has Ended`);
  });
  manager.on("queueStart", async (player, track) => {
    // let channel = player.get("text");
    // send(channel, `Queue has Started`);
  });
  manager.on("replayError", async (player, track) => {
    let channel = player.get("text");
    send(channel, `${emoji.ERROR} Getting error in replaying`);
  });
  // manager.on("socketClosed", async (player) => {
  //   let channel = player.get("text");
  //   send(channel, `${emoji.ERROR} uff , Socked Closed`);
  // });
  manager.on("trackEnd", async (player, track) => {
    let channel = player.get("text");
    send(
      channel,
      `${emoji.SUCCESS} [\`${track.title}\`](${track.url}) Has Ended `
    );
  });
  manager.on("trackError", async (player, track) => {
    let channel = player.get("text");
    send(
      channel,
      `${emoji.ERROR} Getting error in Playing [\`${track.title}\`](${track.url}) Song `
    );
  });
  manager.on("trackStart", async (player, track) => {
    let channel = player.get("text");
    send(
      channel,
      `${emoji.playing} [\`${track.title}\`](${track.url}) \`[${formatDuration(
        track.duration
      )}]\` ${track.requester} `
    );
  });
  manager.on("trackStuck", async (player, track) => {
    let channel = player.get("text");
    send(
      channel,
      `${emoji.ERROR} Stuck during Playing [\`${track.title}\`](${track.url}) Song `
    );
  });
};

/**
 *
 * @param {TextChannel} channel
 * @param {String} message
 */
function send(channel, message) {
  channel.send({
    embeds: [
      new MessageEmbed()
        .setColor(ee.color)
        .setDescription(`** ${message} **`)
        .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
    ],
  });
}
