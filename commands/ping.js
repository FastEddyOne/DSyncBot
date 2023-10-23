module.exports = {
  name: "ping",
  description: "Ping command",
  cooldown: 5,
  async execute(interaction) {
    await interaction.editReply("Pong!");
  },
};
