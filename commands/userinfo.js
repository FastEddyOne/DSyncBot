module.exports = {
    name: 'userinfo',
    description: 'Get info about a user.',
    execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        message.channel.send(`Name: ${user.username}\nID: ${user.id}\nJoined: ${member.joinedAt}`);
    },
};
