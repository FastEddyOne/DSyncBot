const jokes = [
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the chicken join a band? Because it had the drumsticks!",
    // ... add more jokes
];

module.exports = {
    name: 'joke',
    description: 'Shares a random joke.',
    async execute(interaction) {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        await interaction.editReply(`😂 Joke: ${randomJoke}`);
    },
};
