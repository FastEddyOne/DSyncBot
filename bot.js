require("dotenv").config();
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");

const TOKEN = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

async function loadCommands() {
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
  }
}

async function refreshCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  // Delete all existing commands
  const existingCommands = await rest.get(
    Routes.applicationCommands(client.user.id)
  );
  for (const command of existingCommands) {
    await rest.delete(Routes.applicationCommand(client.user.id, command.id));
  }

  // Register commands globally
  await rest.put(Routes.applicationCommands(client.user.id), {
    body: client.commands.map((cmd) => ({
      name: cmd.name,
      description: cmd.description,
      options: cmd.options || [],
    })),
  });
}

async function handleCooldown(interaction, command) {
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
}

async function handleRoleRestriction(interaction, command) {
  if (command.roles) {
    const memberRoles = interaction.member.roles.cache.map((role) => role.name);
    if (!command.roles.some((role) => memberRoles.includes(role))) {
      return interaction.reply(
        "You do not have the required role to use this command."
      );
    }
  }
}

async function handleInteraction(interaction) {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(
      `Command not registered in collection: ${interaction.commandName}`
    );
    return;
  }

  // Cooldown handling
  const cooldownResponse = await handleCooldown(interaction, command);
  if (cooldownResponse) return; // If there's a cooldown response, we exit early

  // Role restriction handling
  const roleRestrictionResponse = await handleRoleRestriction(
    interaction,
    command
  );
  if (roleRestrictionResponse) return; // If there's a role restriction response, we exit early

  // Execute the command
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
}
client.once("ready", async () => {
  console.log("Bot is online!");

  await loadCommands();
  await refreshCommands();
});

client.on("interactionCreate", handleInteraction);

// Start Bot
client.login(TOKEN);
