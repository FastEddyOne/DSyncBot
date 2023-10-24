// kick.js
const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kicks a member from the server.",
  roles: ["Mod", "Admin"],
  options: [
    {
      name: "member",
      type: 6,
      description: "The member you want to kick.",
      required: true,
    },
    {
      name: "reason",
      type: 3,
      description: "The reason for the kick.",
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

    // Check if the member is kickable
    if (!member.kickable) {
      await interaction.reply({
        content: "I cannot kick this user.",
        ephemeral: true,
      });
      return;
    }

    try {
      await member.kick(reason);
      await interaction.reply({
        content: `Kicked ${member.user.tag} for: ${reason}`,
      });
    } catch (error) {
      console.error("Error kicking member:", error);
      await interaction.reply({
        content: "There was an error trying to kick the user.",
        ephemeral: true,
      });
    }
  },
};
