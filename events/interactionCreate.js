module.exports = async (client, interaction) => {

  let MusicDB = await client.GetMusic(interaction.guildId);
  if(!MusicDB) return console.log('Guild not Found');

  //Initialize GuildDB
  if (!MusicDB) {
      MusicDB = await client.database.guild.set(interaction.guildId, {
          prefix: client.config.prefix,
          musicChannelId: null,
      });
  }

  if(interaction.isButton()){
    const [name, ...parms] = interaction.customId.split("-");

    const button = client.Buttons.get(name);

    if(!button) return;
    button.run(client, interaction, parms, { MusicDB });
  }

  const command = interaction.commandName;

  let cmd = client.SlashCommands.get(command);
  if(!cmd) return;

  const args = interaction.options._hoistedOptions[0];

  if (cmd.SlashCommand && cmd.SlashCommand.run)
      cmd.SlashCommand.run(client, interaction, args, { MusicDB });

  client.CommandsRan++;
};
