require("dotenv").config();
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});
const TOKEN = process.env.DISCORD_BOT_TOKEN;

client.commands = new Collection();
client.cooldowns = new Collection();

async function registerCommands() {
  const commandsToRegister = [];
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commandsToRegister.push({
      name: command.name,
      description: command.description,
      options: command.options || [],
    });

    // Log the command name
    console.log(command.name);

    // This line adds the command to the client's command collection
    client.commands.set(command.name, command);
  }

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  // Delete all existing commands
  const existingCommands = await rest.get(
    Routes.applicationCommands(client.user.id)
  );
  for (const command of existingCommands) {
    await rest.delete(Routes.applicationCommand(client.user.id, command.id));
  }

  try {
    console.log("Started refreshing application (/) commands.");

    // Register commands globally
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands.map((command) => ({
        name: command.name,
        description: command.description,
        options: command.options || [],
      })),
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

client.once("ready", () => {
  console.log("Bot is online!");
  registerCommands(); // Register the slash commands when the bot starts
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.log("Command not found in collection:", interaction.commandName);
    return;
  }

  // Cooldown handling
  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return interaction.reply(
        `Please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }
  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  // Role restriction handling
  if (command.roles) {
    const memberRoles = interaction.member.roles.cache.map((role) => role.name);
    if (!command.roles.some((role) => memberRoles.includes(role))) {
      return interaction.reply(
        "You do not have the required role to use this command."
      );
    }
  }

  // Defer the reply, then execute the command
  await interaction.deferReply();

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(
      `Error executing command ${interaction.commandName} for user ${interaction.user.tag} in guild ${interaction.guild.name}:`,
      error
    );
    await interaction.editReply({
      content: "There was an error executing the command!",
      ephemeral: true,
    });
  }
});

// Start Bot
client.login(TOKEN);
