module.exports = async (client, message) => {
  let MusicDB = await client.GetMusic(message.guild.id);

  if(message.channel.id == MusicDB.musicChannelId){
    if(message.author.bot) {
      if(message.id === MusicDB.musicMessageId) return;
      setTimeout(() => message.delete(), 3000);
    } else {
      message.delete();
      const play = client.Commands.get('play');
      play.run(client, message, {MusicDB});
    }
    // const msg = await message.channel.messages.fetch(MusicDB.musicMessageId);
  }
};
