const { CommandInteraction, Client, Permissions } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Clears a specified number of messages from the channel.",
  roles: ["Mod", "Admin"],
  options: [
    {
      name: "amount",
      type: 4,
      description: "The number of messages you want to delete.",
      required: true,
    },
    {
      name: "member",
      type: 6,
      description:
        "The member whose messages you want to delete. Leave empty to clear any user's messages.",
      required: false,
    },
  ],

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const member = interaction.options.getMember("member");

    // Check for MANAGE_MESSAGES permission
    if (
      !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
    ) {
      await interaction.reply({
        content: "You don't have permission to manage messages!",
        ephemeral: true,
      });
      return;
    }

    // Validate amount
    if (amount < 1 || amount > 100) {
      await interaction.reply({
        content: "Please specify an amount between 1 and 100.",
        ephemeral: true,
      });
      return;
    }

    try {
      if (member) {
        const messages = await interaction.channel.messages.fetch({
          limit: amount,
        });
        const userMessages = messages.filter(
          (msg) => msg.author.id === member.id
        );
        await interaction.channel.bulkDelete(userMessages, true);
        await interaction.reply({
          content: `Successfully deleted ${userMessages.size} messages from ${member.user.tag}.`,
        });
      } else {
        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({
          content: `Successfully deleted ${amount} messages.`,
        });
      }
    } catch (error) {
      console.error("Error deleting messages:", error);
      await interaction.reply({
        content: "There was an error trying to delete messages.",
        ephemeral: true,
      });
    }
  },
};
