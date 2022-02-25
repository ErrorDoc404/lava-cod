module.exports = {
  name: 'stop',
  run: async (client, interaction, parms, {MusicDB}) => {
    let player = await client.manager.get(interaction.guildId);
    if (!member.voice.channel) interaction.reply({content: "❌ | **You must be in a voice channel to use this command.**"}).catch(err => {client.error(err)});
    if(!interaction.member.permissions.has('MOVE_MEMBERS')) return interaction.reply({content: `You dont have permission to do that`}).catch(err => {client.error(err)});
    if(!player) return interaction.reply({content: `Nothing is playing right now`}).catch(err => {client.error(err)});
    player.destroy();
    const embed = {
        title: `🎵 Vibing Music 🎵`,
        description: `Anything you type in this channel will be interpreted as a video title`,
        color: 0xd43790,
        image: {
          url: 'https://c.tenor.com/eDVrPUBkx7AAAAAd/anime-sleepy.gif',
        },
        thumbnail: {
          url: 'https://i.imgur.com/Za8NXjk.png',
        },
      };
    client.musicMessage = await interaction.channel.messages.fetch(MusicDB.musicMessageId);
    client.musicMessage.edit({content: `**[ Nothing Playing ]**\nJoin a voice channel and queue songs by name or url in here.`, embeds: [embed]});
    return interaction.reply({content: `Music Stoped`}).catch(err => {client.error(err)});
  }
}
