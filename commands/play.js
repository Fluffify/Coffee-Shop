const ytdl = require('ytdl-core');


function play(guild, song, queue, loop) {
    try {
        const serverQueue = queue.get(guild.id);

        if (!song) {
            console.log("IDLE, SET A TIME OUT");
        }

        else {
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url, { quality: "highestaudio", filter: "audioonly", }))
                .on("finish", () => {
                    if (!loop && serverQueue.songs[0] != serverQueue.songs[1])
                        serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0], queue, loop);
                })
                .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            return serverQueue.textChannel.send(`Now playing: ${song.title}`);
        }
    }
    catch (err) {
        console.log(err);
        return message.channel.send("Something went wrong...", err);
    }
}

module.exports = {
    name: 'play',
    description: 'Plays a song',
    play
}
