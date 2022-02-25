const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require('node-fetch');
const { DiscordTogether } = require('discord-together');
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

module.exports = {
    name: "setup",
    description: "setup your music channel",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "music",
    SlashCommand: {
        options: [
          {
            name: "channel",
            description: "Select channel to setup music",
            value: "command",
            type: 7,
            required: true,
          },
        ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
        run: async (client, interaction, args, { MusicDB }) => {
          if(!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.reply(`you dont have manage guild permission to run this command`).catch(err => {client.error(err)});
          const music_channel = args.channel;
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

          const row = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId('pause')
              .setLabel('⏸️ Pause')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('play')
              .setLabel('▶️ Play')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('skip')
              .setLabel('⏭️ Skip')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('stop')
              .setLabel('⏹️ Stop')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('fix')
              .setLabel('⚒️ Fix')
              .setStyle('SECONDARY'),
          ]);

          music_channel.send({content: `**[ Nothing Playing ]**\nJoin a voice channel and queue songs by name or url in here.`, embeds: [embed], components: [row]})
            .then(async (data) => {
              const channelId = music_channel.id;
              const messageId = data.id;
              await GuildConfig.findOneAndUpdate({guildId: MusicDB.guildId},{
                musicChannelId: channelId,
                musicMessageId: messageId
              });
            });
          return interaction.reply(`setup complete`).catch(err => {client.error(err)});
        },
    },
};
