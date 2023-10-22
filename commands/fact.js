const facts = [
    "Honey never spoils.",
    "The shortest war in history lasted 38 minutes.",
    "Polar bear fur is actually clear, not white.",
    // ... add more facts
];

module.exports = {
    name: 'fact',
    description: 'Shares a random fact.',
    async execute(interaction) {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        await interaction.reply(`📚 Fact: ${randomFact}`);
    },
};
