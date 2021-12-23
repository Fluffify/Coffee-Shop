module.exports = {
    name: 'repeat',
    description: 'Repeats the current track',

    repeat(message, serverQueue, loop) {
        try {
            if (!message.member.voice.channel)
                return message.channel.send(
                    "You have to be in a voice channel to use the bot!"
                );
            if (!serverQueue || serverQueue.songs.length == 0)
                return message.channel.send("Queue is empty!");

            loop = !loop
            if (loop == true) {
                if (serverQueue.songs[0] != serverQueue.songs[1]) {
                    serverQueue.songs.splice(1, 0, serverQueue.songs[0])
                }
                message.channel.send(`Repeating ON for: ${serverQueue.songs[0]["title"]}!`);
            }

            else {
                if (serverQueue.songs[0] == serverQueue.songs[1]) {
                    serverQueue.songs.splice(1, 1)
                    message.channel.send(`Repeating OFF for: ${serverQueue.songs[0]["title"]}!`);
                }

            }
            return loop
        }
        catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong...", err);
        }
    }
}