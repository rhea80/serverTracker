const { Client, Events, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');
const { token, channelId, ip } = require('../config.json');
let lastOnlinePlayers = [];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);


    const channel = client.channels.cache.get(channelId); 
    if (!channel) {
        console.error(`Failed to fetch channel. Channel ID: ${channelId}`);
        return;
    }

    setInterval(async () => {
        try {
            const response = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
            const serverInfo = await response.json();

            if (serverInfo.online) {
                const currentPlayers = serverInfo.players.list || [];
                const newPlayers = currentPlayers.filter(player => !lastOnlinePlayers.includes(player));

                if (newPlayers.length > 0) {
                    channel.send(`New players online: ${newPlayers.join(', ')}`);
                }

                lastOnlinePlayers = currentPlayers;
            } else {
                console.log('Server is offline.');
                lastOnlinePlayers = [];
            }
        } catch (error) {
            console.error('Error fetching server data:', error);
        }
    }, 60000);
});

client.login(token);
