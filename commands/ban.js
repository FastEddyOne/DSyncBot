module.exports = {
    name: 'ban',
    description: 'Ban a user from the server.',
    args: true,
    usage: '<user> [reason]',
    execute(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('You don\'t have the permissions to ban members!');
        }

        const userToBan = message.mentions.users.first();

        if (!userToBan) {
            return message.reply('You need to mention a user to ban them!');
        }

        let reason = args.slice(1).join(' ');
        reason = reason || 'No reason provided';

        message.guild.members.ban(userToBan, { reason: reason })
            .then(() => {
                message.channel.send(`Successfully banned ${userToBan.tag} for reason: ${reason}.`);
            })
            .catch(err => {
                message.reply('I was unable to ban the member');
                console.error(err);
            });
    },
};
