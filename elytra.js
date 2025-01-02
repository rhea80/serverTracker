const { Client, Events, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch'); 
const { token } = require('./config.json');
let lastOnlinePlayers = []; // Tracks the last known list of online players


const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.once(Events.ClientReady, readyClient => {
    
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    const channels = client.channels.cache.filter(channel => channel.isTextBased());
    channels.forEach(channel => {
        console.log(`Channel ID: ${channel.id}, Name: ${channel.name}`);
    });

    const channel = client.channels.cache.get(token.channelId);
    if (!channel) {
        console.error('Channel ID is invalid or bot lacks permissions.');
        return;
    }

    setInterval(async () => {
        try {
            const response = await fetch(`https://api.mcsrvstat.us/2/${config.ip}`);
            const serverInfo = await response.json();

            if (serverInfo.online) {
                const currentPlayers = serverInfo.players.list || [];
                const newPlayers = currentPlayers.filter(player => !lastOnlinePlayers.includes(player));

                // Send a message if new players are detected
                if (newPlayers.length > 0) {
                    channel.send(`New players online: ${newPlayers.join(', ')}`);
                }

                // Update the last known players
                lastOnlinePlayers = currentPlayers;
            } else {
                console.log('Minecraft server is offline.');
                lastOnlinePlayers = [];
            }
        } catch (error) {
            console.error('Error fetching server data:', error);
        }
    }, 60000);
});

client.login(token);
