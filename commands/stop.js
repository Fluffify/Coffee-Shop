module.exports = {
    name: 'stop',
    description: 'Stops player and clears queue',

    stop(message, serverQueue) {
        try {
            if (!message.member.voice.channel)
                return message.channel.send(
                    "You have to be in a voice channel to use the bot!"
                );

            if (!serverQueue || serverQueue.songs.length == 0)
                return message.channel.send("Queue is empty!");

            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            message.channel.send(`Player stopped and cleared queue!`);

        }
        catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong...", err);
        }
    }
}