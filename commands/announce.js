const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
  name: "announce",
  description: "Sends an announcement to a specified channel.",
  roles: ["Mod", "Admin"],
  options: [
    {
      name: "channel",
      type: 7, // Type 7 is for "channel"
      description: "The channel where you want to send the announcement.",
      required: true,
    },
    {
      name: "message",
      type: 3, // Type 3 is for "string"
      description: "The announcement message.",
      required: true,
    },
    {
      name: "title",
      type: 3, // Type 3 is for "string"
      description: "The title for the embed (optional).",
      required: false,
    },
    {
      name: "color",
      type: 3, // Type 3 is for "string"
      description: "The color for the embed (optional).",
      required: false,
    },
  ],

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const messageContent = interaction.options.getString("message");
    const title = interaction.options.getString("title");
    const color = interaction.options.getString("color");

    if (!channel.isText()) {
      await interaction.reply({
        content: "Selected channel is not a text channel!",
        ephemeral: true,
      });
      return;
    }

    // If title is provided, send an embed. Otherwise, send a plain message.
    if (title) {
      const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(messageContent)
        .setColor(color || "BLUE"); // Default color is BLUE if none provided

      await channel.send({ embeds: [embed] });
    } else {
      await channel.send(messageContent);
    }

    await interaction.reply({ content: "Announcement sent!", ephemeral: true });
  },
};
