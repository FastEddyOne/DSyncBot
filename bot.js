require("dotenv").config();
const fs = require("fs");
const { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");

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
  const commands = [];
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push({
        name: command.name,
        description: command.description, // Assuming your command files have a description
        options: command.options || [] // Assuming you may have command options
      });
  
      // This line adds the command to the client's command collection
      client.commands.set(command.name, command);
  }

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  
  try {
    console.log('Started refreshing application (/) commands.');

    // Register commands globally (you can also register them per guild, refer Discord.js guide)
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

client.once("ready", () => {
  console.log("Bot is online!");
  registerCommands(); // Register the slash commands when the bot starts
});

client.on("interactionCreate", async (interaction) => {
  console.log('Received interaction:', interaction.commandName); // Add this
  if (!interaction.isCommand()) return;

  await interaction.deferReply();

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.log('Command not found in collection:', interaction.commandName); // Add this
    return;
  }

  try {
    console.log('Attempting to execute command:', command.name); // Add this
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName} for user ${interaction.user.tag} in guild ${interaction.guild.name}:`, error);
    await interaction.editReply({ content: 'There was an error executing the command!', ephemeral: true });
  }
});


// Note: Cooldowns and role restrictions can be handled in the interactionCreate similar to the given code.

// Start Bot
client.login(TOKEN);
