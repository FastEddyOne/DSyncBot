const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "meme",
    description: "Get a random meme",
    async execute(interaction) {
        try {
            const response = await axios.get("https://www.reddit.com/r/memes/random/.json");
            const meme = response.data[0].data.children[0].data;

            if (meme.post_hint !== "image") {
                return interaction.editReply("The fetched meme is not an image. Please try again.");
            }

            const embed = new MessageEmbed()
                .setTitle(meme.title)
                .setImage(meme.url)
                .setColor("#0099ff")
                .setFooter(`👍 ${meme.ups} | 💬 ${meme.num_comments}`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching meme:", error);
            await interaction.editReply({ content: "An error occurred while fetching a meme. Please try again later.", ephemeral: true });
        }
    },
};
