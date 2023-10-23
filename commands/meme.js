const { CommandInteraction } = require("discord.js");
const axios = require("axios");
require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  name: "meme",
  description: "Get a random meme",
  async execute(interaction) {
    try {
      // Set up the headers for the RapidAPI request using the environment variable
      const headers = {
        "X-RapidAPI-Host": "humor-jokes-and-memes.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, // Use the environment variable
      };

      // Make the request to the RapidAPI endpoint
      const response = await axios.get(
        "https://humor-jokes-and-memes.p.rapidapi.com/memes/random",
        { headers }
      );

      const meme = response.data;

      // Modify this condition based on the response format
      if (!meme || !meme.url) {
        return interaction.editReply("No meme found. Please try again.");
      }

      const messageContent = `${meme.url}`;

      await interaction.editReply(messageContent);
    } catch (error) {
      console.error("Error fetching meme:", error);
      await interaction.editReply({
        content:
          "An error occurred while fetching a meme. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
