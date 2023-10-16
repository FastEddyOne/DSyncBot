// say.js
module.exports = {
    name: 'say',
    description: 'Repeats the message sent by the user.',
    execute(message, args) {
        if (!args.length) {
            return message.reply('You didn\'t provide any message to say!');
        }
        
        message.channel.send(args.join(' '));
    },
};
