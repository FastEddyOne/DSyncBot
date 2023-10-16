const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'userembed',
    description: 'Displays user information in an embed',
    execute(message, args) {
        const user = message.mentions.users.first() || message.author;

        const embed = new MessageEmbed()
            .setTitle(user.username + "'s Info")
            .setColor('#0099ff')
            .setThumbnail(user.avatarURL())
            .addField('Username:', user.username, true)
            .addField('User ID:', user.id, true)
            .addField('Creation Date:', user.createdAt, true)
            .setTimestamp()
            .setFooter('User Info', message.guild.iconURL());

        message.channel.send({ embeds: [embed] });
    },
};
