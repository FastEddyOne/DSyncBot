module.exports = {
    name: 'poll',
    description: 'Initiates a poll where users can vote using reactions.',
    args: true,
    usage: '<question>',
    async execute(message, args) {
        const pollQuestion = args.join(' ');

        const pollMessage = await message.channel.send(`📊 **Poll:** ${pollQuestion}`);
        
        // Add reactions for voting
        await pollMessage.react('👍');  // thumbs up for yes
        await pollMessage.react('👎');  // thumbs down for no
    },
};
