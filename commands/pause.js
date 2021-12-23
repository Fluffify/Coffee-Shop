module.exports = {
    name: 'pause',
    description: 'Pauses top track',

    async pause(message, serverQueue) {
        try {
            if (!message.member.voice.channel)
                return message.channel.send(
                    "You have to be in a voice channel to use the bot!"
                );

            if (!serverQueue || serverQueue.songs.length == 0)
                return message.channel.send("Queue is empty!");

            if (serverQueue.connection.dispatcher.paused)
                return message.channel.send("Queue is already paused!");

            await serverQueue.connection.dispatcher.pause();
            message.channel.send("Player on pause!");
        }
        catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong...", err);
        }
    }
}