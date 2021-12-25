module.exports = {
    name: 'skip',
    description: 'Skips the current track',

    skip(message, serverQueue) {
        try {
            if (!message.member.voice.channel)
                return message.channel.send(
                    "You have to be in a voice channel to use the bot!"
                );
            if (!serverQueue || serverQueue.songs.length == 0)
                return message.channel.send("Queue is empty!");
            if (serverQueue.songs[0] == serverQueue.songs[1]) {
                serverQueue.songs.splice(1, 1)
            }
            serverQueue.connection.dispatcher.end();
        }

        catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong...", err);
        }
    }
}