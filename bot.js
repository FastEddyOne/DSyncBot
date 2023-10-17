require("dotenv").config();
const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

// Bot Initialization
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const JOIN_LEAVE_CHANNEL_NAME =
  process.env.JOIN_LEAVE_CHANNEL_NAME || "default-channel-name";

client.commands = new Collection();
client.cooldowns = new Collection();

// Load Commands
function loadCommands() {
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`Loading command: ${command.name}`);
    client.commands.set(command.name, command);
  }
}

// Event Handlers
client.once("ready", () => {
  console.log("Bot is online!");
});

client.on("messageCreate", handleIncomingMessage);

function handleIncomingMessage(message) {
  console.log(
    `Received message: ${message.content} from ${message.author.username}`
  );

  if (!message.content.startsWith("/") || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  console.log(`Processed command: /${commandName}`);

  executeCommand(message, commandName, args);
}

client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === JOIN_LEAVE_CHANNEL_NAME
  );

  if (!channel) return;

  channel.send(`Welcome ${member} to the server!`);
});

client.on("guildMemberRemove", (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === JOIN_LEAVE_CHANNEL_NAME
  );

  if (!channel) return;

  channel.send(`${member} has left the server.`);
});

function executeCommand(message, commandName, args) {
  const command = client.commands.get(commandName);

  if (!command) {
    console.log(`Command ${commandName} not found.`);
    return;
  }

  // Role-based restriction
  if (
    commandName === "restrictedCommandName" &&
    !message.member.roles.cache.some((role) => role.name === "Moderator")
  ) {
    return message.reply("You can't use this command!");
  }

  // Cooldown handling
  handleCooldowns(command, message);

  // Execute the command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    message.reply("There was an error trying to execute that command!");
  }
}

function handleCooldowns(command, message) {
  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 5) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `Please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
}

// Start Bot
loadCommands();
client.login(TOKEN);
