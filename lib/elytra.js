import { promises as fs } from 'fs';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import path from 'path';
import { PingContext } from 'node-minecraft-status';


const configData = await fs.readFile(configFilePath, 'utf-8');
const config = JSON.parse(configData);

const { token, channelId, ip, port } = config;

let lastOnlinePlayers = [];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const clients = new PingContext();



client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    const channels = client.channels.cache.filter(channel => channel.isTextBased());
    channels.forEach(channel => {
        console.log(`Channel ID: ${channel.id}, Name: ${channel.name}`);
    });

    const channel = client.channels.cache.get(channelId);
    if (!channel) {
        console.error(`Failed to fetch channel. Channel ID: ${channelId}`);
        return;
    }

     


    setInterval(async () => {
        try {
            clients.ping(ip)
            .subscribe({
                next(response) {
                    console.log(response);
                },
                error(err) {
                    console.error(err);
                },
                complete() {
                    console.log('pong!');
                },
            });
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
            if (error instanceof SyntaxError) {
                console.error('Error parsing JSON from server data:', error);
            } else {
                console.error('Error fetching server data:', error);
            }
        }
    }, 1000);
});

client.login(token);
