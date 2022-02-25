require('dotenv').config();

module.exports = {
    Id: process.env.Discord_ClientID,
    prefix: process.env.PREFIX || '!',
    Admins: ["UserID", "UserID"],
    buildToken: process.env.BUILD_TOKEN || 'build token',
    Token: process.env.TOKEN || 'bot token',

    presence: {
        status: "active", // online, idle, and dnd(invisible too but it make people think the bot is offline)
        activities: [
            {
              name: "Music", //Status Text
              type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
            },
        ],
    },

    // lavalink server
    lavalink: {
      host: process.env.LAVALINK_HOST || 'localhost',
      port: process.env.LAVALINK_PORT || 3000,
      password: process.env.LAVALINK_PASSWORD || 'secret',
      secure: process.env.LAVALINK_SECURE || false,
    },

    mongooseURL: process.env.MONGOOSE_URL || "",
};
