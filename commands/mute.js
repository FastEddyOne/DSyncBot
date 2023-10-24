const { CommandInteraction, Client, Permissions } = require("discord.js");

module.exports = {
  name: "mute",
  description: "Mutes a member in the server.",
  roles: ["Mod", "Admin"],
  options: [
    {
      name: "member",
      type: 6, // USER type
      description: "The member you want to mute.",
      required: true,
    },
    {
      name: "duration",
      type: 4, // INTEGER type
      description: "Duration (in minutes) to mute the member.",
      required: true,
    },
    {
      name: "reason",
      type: 3, // STRING type
      description: "The reason for the mute.",
      required: false,
    },
  ],

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction) {
    const member = interaction.options.getMember("member");
    const duration = interaction.options.getInteger("duration");
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    // Check if bot has permission to manage roles
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      await interaction.reply({
        content: "I don't have the required permission to manage roles.",
        ephemeral: true,
      });
      return;
    }

    // Check if there's a 'Muted' role
    let mutedRole = interaction.guild.roles.cache.find(
      (r) => r.name === "Muted"
    );
    if (!mutedRole) {
      // You can uncomment the following lines if you want the bot to automatically create a 'Muted' role
      /*
            try {
                mutedRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    color: '#818386',
                    reason: 'Muted role for muting users',
                    permissions: []
                });
                // Ensure the 'Muted' role is below the bot's highest role and above the member's highest role
                const botPosition = interaction.guild.me.roles.highest.position;
                await mutedRole.setPosition(botPosition - 1);
            } catch (error) {
                console.error("Error creating 'Muted' role:", error);
                await interaction.reply({ content: "There was an error creating a 'Muted' role.", ephemeral: true });
                return;
            }
            */
      await interaction.reply({
        content: "There's no 'Muted' role in the server. Please create one.",
        ephemeral: true,
      });
      return;
    }

    try {
      await member.roles.add(mutedRole, reason);
      await interaction.reply({
        content: `Muted ${member.user.tag} for ${duration} minutes for: ${reason}`,
      });

      // Unmute after the duration
      setTimeout(async () => {
        if (member.roles.cache.has(mutedRole.id)) {
          await member.roles.remove(mutedRole, "Mute duration expired");
        }
      }, duration * 60 * 1000);
    } catch (error) {
      console.error("Error muting member:", error);
      await interaction.reply({
        content: "There was an error trying to mute the user.",
        ephemeral: true,
      });
    }
  },
};
