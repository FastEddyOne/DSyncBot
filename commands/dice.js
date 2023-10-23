module.exports = {
  name: "dice",
  description: "Rolls a 6-sided dice and displays the outcome.",
  async execute(interaction) {
    const outcome = Math.floor(Math.random() * 6) + 1;
    await interaction.editReply(`🎲 You rolled a ${outcome}!`);
  },
};
