const ytdl = require('ytdl-core');
const yts = require('yt-search');

const play = require('./play').play

module.exports = {
    name: 'enqueue',
    description: 'Adds a song to the track queue and plays it',

    async enqueue(message, serverQueue, queue, loop) {
        try {
            const args = message.content.split(" ");

            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel)
                return message.channel.send(
                    "You have to be in a voice channel to use the bot!"
                );

            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return message.channel.send(
                    "You need to grant me permissions to connect and speak in a voice channel!"
                );
            }

            // FETCH SONG FROM YT
            // URL 
            try {
                const songInfo = await ytdl.getInfo(args[1]);
                const song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                };

                // ADD TO QUEUE
                if (!serverQueue) {

                    const queueContruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true,
                    };

                    queue.set(message.guild.id, queueContruct);

                    queueContruct.songs.push(song);

                    try {

                        let connection = await voiceChannel.join();
                        queueContruct.connection = connection;

                        play(message.guild, queueContruct.songs[0], queue, loop);
                    } catch (err) {

                        console.log(err);
                        queue.delete(message.guild.id);
                        return message.channel.send("Something went wrong...", err);
                    }

                } else {
                    serverQueue.songs.push(song);
                    console.log(serverQueue.songs);
                    message.channel.send(`${song.title} has been added to the queue!`);
                    try {

                        if (serverQueue.songs.length == 1)
                            return play(message.guild, serverQueue.songs[0], queue, loop);
                    }
                    catch (err) {
                        console.log(err);
                        queue.delete(message.guild.id);
                        return message.channel.send("Something went wrong...", err);
                    }
                }


            }
            // SEARCH
            catch {
                const songInfo = await yts(args.slice(1).join(" "));
                const song = {
                    title: songInfo["all"][0]["title"],
                    url: songInfo["all"][0]["url"],
                };
                // ADD TO QUEUE
                if (!serverQueue) {

                    const queueContruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true,
                    };

                    queue.set(message.guild.id, queueContruct);

                    queueContruct.songs.push(song);

                    try {

                        let connection = await voiceChannel.join();
                        queueContruct.connection = connection;

                        return play(message.guild, queueContruct.songs[0], queue, loop);

                    } catch (err) {
                        console.log(err);
                        queue.delete(message.guild.id);
                        return message.channel.send("Something went wrong...", err);
                    }

                } else {
                    serverQueue.songs.push(song);
                    message.channel.send(`${song.title} has been added to the queue!`);
                    try {
                        if (serverQueue.songs.length == 1)
                            return play(message.guild, serverQueue.songs[0], queue, loop);
                    }
                    catch (err) {
                        console.log(err);
                        queue.delete(message.guild.id);
                        return message.channel.send("Something went wrong...", err);
                    }
                }


            }
        }
        catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong...", err);
        }
    }
}