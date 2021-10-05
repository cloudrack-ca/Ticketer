const connection = require('../../db');

function ifExists(guildId) {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await connection.execute('SELECT * FROM GuildMemberEvent WHERE GuildID = ?', [guildId]);
      resolve(rows[0] ?? false);
    } catch(err) {
      reject(err);
    }
  });
}

async function memberAdd(client, Discord, prefix, member) {
  try {
    const record = await ifExists(member.guild.id);
    if (!record) return;
    
    const {ChannelID, Enabled} = record;
    if (!Enabled || ChannelID === 0) return;

    const channel = await member.guild.channels.fetch(ChannelID);
    if (!channel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) return;
  
    const embed = new Discord.MessageEmbed()
    .setColor('DARK_GREEN')
    .setTitle(`Welcome ${member.user.tag}`)
    .setDescription(`<@${member.id}> Thank you for joining ${member.guild.name}! Enjoy your stay here!`)
    .addField('Account Creation Date', `<t:${Math.floor(member.user.createdTimestamp / 1000)}>`)
    .addField('Join Date', `<t:${Math.floor(new Date().getTime() / 1000)}:R>`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

    channel.send({embeds: [embed]});
  } catch(err) {
    console.error(err);
  }
}

module.exports = memberAdd;