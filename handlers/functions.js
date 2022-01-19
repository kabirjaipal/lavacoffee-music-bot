const {
  Interaction,
  Collection,
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
  CommandInteraction,
  Client,
} = require("discord.js");
const ee = require("../settings/embed.json");
const client = require("../index");

/**
 *
 * @param {Interaction} interaction
 * @param {Object} cmd
 */
function cooldown(interaction, cmd) {
  if (!interaction || !cmd) return;
  let { client, member } = interaction;
  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(cmd.name);
  const cooldownAmount = cmd.cooldown * 1000;
  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000; //get the lefttime
      //return true
      return timeLeft;
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false;
    }
  } else {
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    return false;
  }
}

/**
 *
 * @param {*} duration Number | Time in Milliseconds
 * @returns Object of Formatted Time in Days to milliseconds
 */
function parseDuration(duration) {
  let remain = duration;
  let days = Math.floor(remain / (1000 * 60 * 60 * 24));
  remain = remain % (1000 * 60 * 60 * 24);

  let hours = Math.floor(remain / (1000 * 60 * 60));
  remain = remain % (1000 * 60 * 60);

  let minutes = Math.floor(remain / (1000 * 60));
  remain = remain % (1000 * 60);

  let seconds = Math.floor(remain / 1000);
  remain = remain % 1000;

  let milliseconds = remain;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

/**
 *
 * @param {*} o Object of Time from days to nanoseconds/milliseconds
 * @param {*} useMilli Optional Boolean parameter, if it should use milliseconds or not in the showof
 * @returns Formatted Time
 */
function formatTime(o, useMilli = false) {
  let parts = [];
  if (o.days) {
    let ret = o.days + " Day";
    if (o.days !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.hours) {
    let ret = o.hours + " Hr";
    if (o.hours !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.minutes) {
    let ret = o.minutes + " Min";
    if (o.minutes !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (o.seconds) {
    let ret = o.seconds + " Sec";
    if (o.seconds !== 1) {
      ret += "s";
    }
    parts.push(ret);
  }
  if (useMilli && o.milliseconds) {
    let ret = o.milliseconds + " ms";
    parts.push(ret);
  }
  if (parts.length === 0) {
    return "instantly";
  } else {
    return parts;
  }
}

/**
 *
 * @param {*} duration Number | Time in Millisceonds
 * @param {*} useMilli Optional Boolean parameter, if it should use milliseconds or not in the showof
 * @returns Formatted Time
 */
function duration(duration, useMilli = false) {
  let time = parseDuration(duration);
  return formatTime(time, useMilli);
}

function shuffle(a) {
  try {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  } catch (e) {
    console.log(String(e.stack));
  }
}

function formatDuration(millis) {
  try {
    var h = Math.floor(millis / 3600000),
      m = Math.floor(millis / 60000),
      s = ((millis % 60000) / 1000).toFixed(0);
    if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    else
      return (
        (h < 10 ? "0" : "") +
        h +
        ":" +
        (m < 10 ? "0" : "") +
        m +
        ":" +
        (s < 10 ? "0" : "") +
        s
      );
  } catch (e) {
    console.log(e);
  }
}

function bar(player) {
  let size = 25;
  let line = "▬";
  let slider = "🔘";

  if (!player.queue.current) return `${slider}${line.repeat(size - 1)}]`;
  let current =
    player.queue.current.duration !== 0
      ? player.position
      : player.queue.current.duration;
  let total = player.queue.current.duration;
  let bar =
    current > total
      ? [line.repeat((size / 2) * 2), (current / total) * 100]
      : [
          line
            .repeat(Math.round((size / 2) * (current / total)))
            .replace(/.$/, slider) +
            line.repeat(size - Math.round(size * (current / total)) + 1),
          current / total,
        ];

  if (!String(bar).includes(slider)) return `${slider}${line.repeat(size - 1)}`;
  return `${bar[0]}`;
}

module.exports = {
  cooldown,
  parseDuration,
  formatTime,
  duration,
  shuffle,
  formatDuration,
  bar,
};
