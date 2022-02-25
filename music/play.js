const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');
const { DiscordTogether } = require('discord-together');


module.exports = {
    name: "play",
    description: "play music",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "music",
    run: async (client, message, {MusicDB}) => {
      if (!message.member.voice.channel) return message.channel.send(`❌ | **You must be in a voice channel to play something!**`);
      if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`❌ | **You must be in the same voice channel as me to play something!**`);


      client.musicMessage = await message.channel.messages.fetch(MusicDB.musicMessageId);

      const res = await client.manager.search(
        message.content,
        message.author
      );

      // Create a new player. This will return the player if it already exists.
      const player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
      });

      // Connect to the voice channel.
      player.connect();

      // Adds the first track to the queue.
      player.queue.add(res.tracks[0]);
      if(player.queue.length == 1){
        content = client.musicMessage.content + `\n**[ ${player.queue.length} Songs in Queue ]**`;
        client.musicMessage.edit({content: content});
      } else if(player.queue.length > 1) {
        content = client.musicMessage.content.replace(`${(player.queue.length - 1)} Songs in Queue` , `${player.queue.length} Songs in Queue`);
        client.musicMessage.edit({content: content});
      }

      // Plays the player (plays the first track in the queue).
      // The if statement is needed else it will play the current track again
      if (!player.playing && !player.paused && !player.queue.size)
        player.play();

      // For playlists you'll have to use slightly different if statement
      if (
        !player.playing &&
        !player.paused &&
        player.queue.totalSize === res.tracks.length
      )
        player.play();
    }
};
