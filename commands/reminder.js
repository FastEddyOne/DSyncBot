module.exports = {
    name: 'reminder',
    description: 'Sets a reminder for the user.',
    args: true,
    usage: '<duration in minutes> <message>',
    execute(message, args) {
        const duration = parseInt(args[0]);

        if (isNaN(duration)) {
            return message.reply('Please provide a valid duration in minutes.');
        }

        const reminderMessage = args.slice(1).join(' ');

        message.reply(`I will remind you in ${duration} minutes about: "${reminderMessage}"`);

        setTimeout(() => {
            message.author.send(`🔔 Reminder: ${reminderMessage}`);
        }, duration * 60000);  // Convert minutes to milliseconds
    },
};
