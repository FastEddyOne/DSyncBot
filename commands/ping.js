module.exports = {
    name: 'ping',
    description: 'Ping command',
    cooldown: 5,
    execute(message, args) {
        message.channel.send('Pong!');
    },
};