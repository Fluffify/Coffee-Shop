// DEPENDENCIES
require('dotenv').config()
const { Client, Intents } = require('discord.js');
const ytdl = require('ytdl-core');


// SETTING UP CONFIGS
const prefix = "!";
const token = `${process.env.BOT_TOKEN}`;


const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] })


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

    if (message.content.startsWith(`${prefix}play`.toLocaleLowerCase())) {
        execute(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}skip`.toLocaleLowerCase())) {
        skip(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}stop`.toLocaleLowerCase())) {
        stop(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}pause`.toLocaleLowerCase())) {
        pause(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}resume`.toLocaleLowerCase())) {
        resume(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}queue`.toLocaleLowerCase())) {
        showQueue(message, serverQueue);
        return;


    } else if (message.content.startsWith(`${prefix}help`.toLocaleLowerCase())) {
        message.channel.send("IDK ask Macks what to do.");

    } else {
        message.channel.send("You need to enter a valid command!");
    }

});

// TRACKS QUEUE
const queue = new Map();

// PROCESS COMMANDS
async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "Ask Macks to grant me permissions to use voice channels!"
        );
    }




    // FETCH SONG FROM YT
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    // ADD TO QUEUE
    if (!serverQueue) {

    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }

    // IDK REALLY MULTI SERVER STUFF
    // Creating the contract for our queue
    const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
    };
    // Setting the queue using our contract
    queue.set(message.guild.id, queueContruct);
    // Pushing the song to our songs array
    queueContruct.songs.push(song);

    try {
        // Here we try to join the voicechat and save our connection into our object.
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        // Calling the play function to start a song
        play(message.guild, queueContruct.songs[0]);
    } catch (err) {
        // Printing the error message if the bot fails to join the voicechat
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
    }


}
//  PLAY TRACKS
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        setTimeout(function () {
            serverQueue.voiceChannel.leave()
            queue.delete(guild.id);

        }, 1000);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Now playing: ${song.title}`);
}



// SKIP TRACKS
function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to use bot commands!"
        );
    if (!serverQueue)
        return message.channel.send("Queue is empty");
    serverQueue.connection.dispatcher.end();
}


// STOP TRACKS
function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to use bot commands!"
        );

    if (!serverQueue)
        return message.channel.send("Queue is empty");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

// PAUSE TRACKS
async function pause(message, serverQueue) {

    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to use bot commands!"
        );

    if (!serverQueue)
        return message.channel.send("Queue is empty");

    if (serverQueue.connection.dispatcher.paused)
        return message.channel.send("Queue is already paused");

    await serverQueue.connection.dispatcher.pause();
    message.channel.send("Player paused");
}


// RESUME TRACKS
async function resume(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to use bot commands!"
        );

    if (!serverQueue)
        return message.channel.send("Queue is empty");

    if (serverQueue.connection.dispatcher.resumed)
        return message.channel.send("Queue is already playing tracks");

    // SEEMS BUGGED AF
    await serverQueue.connection.dispatcher.pause();
    await serverQueue.connection.dispatcher.resume();
    await serverQueue.connection.dispatcher.pause();
    await serverQueue.connection.dispatcher.resume();
    message.channel.send("Player resumed");
}

//  SHOW QUEUE
function showQueue(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to use bot commands!"
        );
    if (!serverQueue)
        return message.channel.send("Queue is empty");

    
    message.channel.send("Songs in queue:")
    for (song in serverQueue.songs)
        message.channel.send(`${song} - ${serverQueue.songs[song]["title"]}`)
    
}


client.login(token);
