const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a member from the server.",
  roles: ["Mod", "Admin"],
  options: [
    {
      name: "member",
      type: 6, // USER type
      description: "The member you want to ban.",
      required: true,
    },
    {
      name: "reason",
      type: 3, // STRING type
      description: "The reason for the ban.",
      required: false,
    },
    {
      name: "days",
      type: 4, // INTEGER type
      description: "Number of days of messages to delete (0-7).",
      required: false,
    },
  ],

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    const member = interaction.options.getMember("member");
    const reason =
      interaction.options.getString("reason") || "No reason provided.";
    const days = interaction.options.getInteger("days") || 0;

    // Check if the member is bannable
    if (!member.bannable) {
      await interaction.reply({
        content: "I cannot ban this user.",
        ephemeral: true,
      });
      return;
    }

    try {
      await member.ban({ days: days, reason: reason });
      await interaction.reply({
        content: `Banned ${member.user.tag} for: ${reason}`,
      });
    } catch (error) {
      console.error("Error banning member:", error);
      await interaction.reply({
        content: "There was an error trying to ban the user.",
        ephemeral: true,
      });
    }
  },
};
