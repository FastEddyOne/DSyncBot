module.exports = {
  name: "8ball",
  description: "Ask the magic 8-ball a question",
  options: [
    {
      name: "question",
      type: 3, // Use 3 instead of 'STRING'
      description: "The question you want to ask",
      required: true,
    },
  ],
  async execute(interaction) {
    const answers = [
      "It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes – definitely.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don’t count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful.",
    ];

    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
    await interaction.editReply(`🎱 ${randomAnswer}`);
  },
};
