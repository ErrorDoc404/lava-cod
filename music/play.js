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
      let SearchString = message.content;
      let CheckNode = client.manager.nodes.get(client.config.lavalink.host);

      if (!CheckNode || !CheckNode.connected) message.channel.send(`❌ | **Lavalink node not connected**`);

      client.musicMessage = await message.channel.messages.fetch(MusicDB.musicMessageId);

      // Create a new player. This will return the player if it already exists.
      const player = client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          selfDeafen: true,
      });

      if (!player) return message.channel.send(`❌ | **Nothing is playing right now...**`);

      // Connect to the voice channel.
      if (player.state != "CONNECTED") await player.connect();

      try{
        if (SearchString.match(client.Lavasfy.spotifyPattern)){
          await client.Lavasfy.requestToken();
          let node = client.Lavasfy.nodes.get(client.config.lavalink.host);
          let Searched = await node.load(SearchString);

          if (Searched.loadType === "PLAYLIST_LOADED") {
            let songs = [];
            for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i], message.author));
            player.queue.add(songs);
            if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
          } else if (Searched.loadType.startsWith("TRACK")) {
            player.queue.add(TrackUtils.build(Searched.tracks[0], message.author));
            if (!player.playing && !player.paused && !player.queue.size) player.play();
          } else {
            return message.channel.send(`**No matches found for -** ${SearchString}`);
          }
        }else {
          let Searched = await client.manager.search(SearchString, message.author);
          if (!player) return message.channel.send(`❌ | **Nothing is playing right now...**`);

          if (Searched.loadType === "NO_MATCHES") return message.channel.send(`**No matches found for -** ${SearchString}`);
          else if (Searched.loadType == "PLAYLIST_LOADED") {
             player.queue.add(Searched.tracks);
             if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
          } else {
            player.queue.add(Searched.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.size) player.play();
          }
        }

        if(player.queue.length == 1){
          content = client.musicMessage.content + `\n**[ ${player.queue.length} Songs in Queue ]**`;
          client.musicMessage.edit({content: content});
        } else if(player.queue.length > 1) {
          content = client.musicMessage.content.replace(`${(player.queue.length - 1)} Songs in Queue` , `${player.queue.length} Songs in Queue`);
          client.musicMessage.edit({content: content});
        }
      } catch (e) {
            message.channel.send(`**No matches found for - ** ${SearchString} with ${e}`);
      }
    }
};
