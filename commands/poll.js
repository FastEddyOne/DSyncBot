const { CommandInteraction, Client, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "poll",
    description: "Creates a quick poll.",
    roles: ["Mod", "Admin"], // This limits the command to mods and admins, remove or adjust as needed
    options: [
        {
            name: "question",
            type: 3, // STRING
            description: "The poll question.",
            required: true,
        },
        {
            name: "choices",
            type: 3, // STRING
            description: "Choices for the poll separated by commas (e.g., Yes,No,Maybe).",
            required: true,
        },
        {
            name: "duration",
            type: 4, // INTEGER
            description: "Duration of the poll in minutes.",
            required: true,
        },
    ],

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction) {
        const question = interaction.options.getString("question");
        const choicesStr = interaction.options.getString("choices");
        const duration = interaction.options.getInteger("duration") * 60 * 1000; // Convert minutes to milliseconds

        const choices = choicesStr.split(",").map(choice => choice.trim());

        if (choices.length < 2 || choices.length > 10) {
            return await interaction.reply({ content: "You can have between 2 and 10 choices.", ephemeral: true });
        }

        const embed = new MessageEmbed()
            .setTitle(question)
            .setDescription(choices.map((choice, index) => `${index + 1}. ${choice}`).join("\n"))
            .setColor("BLUE")
            .setFooter(`Poll will end in ${duration / 60000} minutes.`);

        const row = new MessageActionRow()
            .addComponents(choices.map((_, index) => (
                new MessageButton()
                    .setCustomId(`poll_vote_${index + 1}`)
                    .setLabel(index + 1)
                    .setStyle('PRIMARY')
            )));

        const message = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true,
        });

        // End the poll after the specified duration
        setTimeout(async () => {
            const updatedEmbed = new MessageEmbed(embed)
                .setFooter("Poll ended!")
                .setColor("RED");

            // Remove the buttons after the poll has ended
            await message.edit({ embeds: [updatedEmbed], components: [] });
        }, duration);
    },
};
