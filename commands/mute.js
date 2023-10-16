module.exports = {
    name: 'mute',
    description: 'Mute a user for a specified duration.',
    args: true,
    usage: '<user> <duration in seconds>',
    execute(message, args) {
        if (!message.member.permissions.has('MUTE_MEMBERS')) {
            return message.reply('You don\'t have the permissions to mute members!');
        }

        const userToMute = message.mentions.members.first();

        if (!userToMute) {
            return message.reply('You need to mention a user to mute them!');
        }

        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole) {
            return message.reply('Muted role not found in the server. Please create one.');
        }

        let duration = parseInt(args[1]);

        if (isNaN(duration)) {
            return message.reply('Please provide a valid duration in seconds.');
        }

        userToMute.roles.add(muteRole)
            .then(() => {
                message.channel.send(`Successfully muted ${userToMute.displayName} for ${duration} seconds.`);
                setTimeout(() => {
                    userToMute.roles.remove(muteRole).catch(console.error);
                }, duration * 1000);
            })
            .catch(err => {
                message.reply('I was unable to mute the member');
                console.error(err);
            });
    },
};
