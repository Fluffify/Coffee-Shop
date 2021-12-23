module.exports = {
    name: 'resume',
    description: 'Resumes paused track',

    async resume(message, serverQueue) {
        try {
            if (!message.member.voice.channel)
                return message.channel.send(
                    "You have to be in a voice channel to use the bot!"
                );

            if (!serverQueue || serverQueue.songs.length == 0)
                return message.channel.send("Queue is empty!");

            if (!serverQueue.connection.dispatcher.paused)
                return message.channel.send("Queue is already playing tracks");

            // DON'T ASK BUGGED AF
            await serverQueue.connection.dispatcher.pause();
            await serverQueue.connection.dispatcher.resume();
            await serverQueue.connection.dispatcher.pause();
            await serverQueue.connection.dispatcher.resume();
            message.channel.send("Player resumed!");
        }

        catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong...", err);
        }
    }
}