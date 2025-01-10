const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [
    {
        name: 'players',
        description: 'Get the list of online players on the Minecraft server',
    },

    {
        name: 'status',
        description: 'Check server availability',
    }
];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('Registering commands...');
        await rest.put(
            Routes.applicationCommands('YOUR_CLIENT_ID'),
            { body: commands },
        );
        console.log('Commands registered successfully.');
    } catch (error) {
        console.error(error);
    }
})();


