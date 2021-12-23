// DEPENDENCIES
require('dotenv').config()
const { Client, Intents } = require('discord.js');

// SETTING UP CONFIGS
const prefix = "!";
const token = `${process.env.BOT_TOKEN}`;

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] })
const queue = new Map();
let loop = false

// COMMANDS
const enqueue = require('./commands/enqueue').enqueue
const play = require('./commands/play').play
const skip = require('./commands/skip').skip
const showQueue = require('./commands/queue').showQueue
const replay = require('./commands/replay').replay
const repeat = require('./commands/repeat').repeat
const stop = require('./commands/stop').stop
const pause = require('./commands/pause').pause
const resume = require('./commands/resume').resume


// LISTENERS
client.once('ready', () => {
    console.log('Ready!');
    client.user.setPresence({
        status: "online",
        game: {
            name: "!help",
            type: "PLAYING"
        }
    });
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});


// READ USER COMMANDS
client.on('message', async message => {

    // IGNORE BOT MESSAGES AND CHECK IF MESSAGE AIMED AT BOT
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    // EXTRACT COMMAND AND INVOKE CORRESPONDING FUNCTION
    if (message.content.startsWith(`${prefix}`)) {
        const command = (message.content.replace(`${prefix}`, "").split(" ")[0]);

        switch (command.toLowerCase()) {
            case 'play':
                enqueue(message, serverQueue, queue, loop);
                break;

            case 'skip':
                skip(message, serverQueue);
                break;

            case 'stop':
                stop(message, serverQueue);
                break;

            case 'pause':
                pause(message, serverQueue);
                break;

            case 'resume':
                resume(message, serverQueue);
                break;

            case 'queue':
                showQueue(message, serverQueue, queue);
                break;

            case 'replay':
                serverQueue.songs = replay(message, serverQueue, queue);
                break;

            case 'repeat':
                loop = repeat(message, serverQueue, loop);
                serverQueue.connection.on("finish", () => {play(message.guild, serverQueue.songs[0], queue, loop)});
                break;

            case 'help':
                message.channel.send("Available commands: [play, skip, stop, pause, resume, queue, replay, and repeat]");
                break;

            default:
                message.channel.send("You need to enter a valid command!");

        }

    }
});

client.login(token);
