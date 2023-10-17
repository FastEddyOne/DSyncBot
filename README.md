# DSyncBot

DSyncBot is a Discord bot designed to provide interactive commands for server members. Built with Node.js and Discord.js, DSyncBot aims to improve user experience with fun and useful features.

## Features

Basic Commands:

- /say [message]: Repeats the message sent by the user.
- /dice: Rolls a dice and displays the outcome.
- /kick [username] [reason]: Allows moderators to kick a user with an optional reason.
- /ban [username] [reason]: Allows moderators to ban a user with an optional reason.
- /mute [username] [duration]: Mutes a user for a specified duration.
- /poll [question]: Initiates a poll where users can vote using reactions.
- /reminder [duration] [message]: Sets a reminder for the user and pings them after the specified duration.
- /fact: Shares a random fact.
- /joke: Shares a random joke.
- /ping: The bot will respond with "Pong!".

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YourGithubUsername/DSyncBot.git
    cd DSyncBot
2. npm install
3. Create a .env file in the root directory and add your bot token:
   ```DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN```

   ```JOIN_LEAVE_CHANNEL_NAME= The name of the channel where welcome and goodbye messages will be sent```

### Running the Bot
To start the bot, run the following command:
```node bot.js```

### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License
This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

### Acknowledgments
Thanks to Discord.js for the library.
