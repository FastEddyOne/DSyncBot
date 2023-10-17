module.exports = {
    name: 'dice',
    description: 'Rolls a 6-sided dice and displays the outcome.',
    execute(message) {
        const outcome = Math.floor(Math.random() * 6) + 1;
        message.channel.send(`🎲 You rolled a ${outcome}!`);
    },
};
