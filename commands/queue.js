module.exports = {
    name: 'showQueue',
    description: 'Sends queued track list',

    showQueue(message, serverQueue) {
        try {
            if (!message.member.voice.channel)
                return message.channel.send(
                    "You have to be in a voice channel to use the bot!"
                );
            if (!serverQueue || serverQueue.songs.length == 0)
                return message.channel.send("Queue is empty!");

            message.channel.send("Songs in queue:")
            if (serverQueue.songs[0] == serverQueue.songs[1]) {
                message.channel.send(` 1 - ${serverQueue.songs[0]["title"]} - (on repeat)!`)
                for (let song = 2; song < serverQueue.songs.length; song++)
                    message.channel.send(`${song} - ${serverQueue.songs[song]["title"]}`)
            }

            else {
                for (let song = 0; song < serverQueue.songs.length; song++)
                    message.channel.send(`${song + 1} - ${serverQueue.songs[song]["title"]}`)
            }
        }
        catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong...", err);
        }
    }
}