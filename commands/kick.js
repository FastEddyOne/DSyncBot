module.exports = {
    name: 'kick',
    description: 'Kick a user from the server.',
    args: true,
    usage: '<user> [reason]',
    execute(message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('You don\'t have the permissions to kick members!');
        }

        const userToKick = message.mentions.users.first();

        if (!userToKick) {
            return message.reply('You need to mention a user to kick them!');
        }

        let reason = args.slice(1).join(' ');
        reason = reason || 'No reason provided';

        message.guild.members.kick(userToKick, reason)
            .then(() => {
                message.channel.send(`Successfully kicked ${userToKick.tag} for reason: ${reason}.`);
            })
            .catch(err => {
                message.reply('I was unable to kick the member');
                console.error(err);
            });
    },
};
