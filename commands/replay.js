
const skip = require('./skip').skip

module.exports = {
    name: 'replay',
    description: 'Replays the top track',

    replay(message, serverQueue) {
        try {
            if (!message.member.voice.channel)
                return message.channel.send(
                    "You have to be in a voice channel to use the bot!"
                );
            if (!serverQueue || serverQueue.songs.length == 0)
                return message.channel.send("Queue is empty!");


            serverQueue.songs.splice(0, 0, serverQueue.songs[0])
            skip(message, serverQueue)
            message.channel.send(`Replaying ${serverQueue.songs[0]["title"]}`)
            return (serverQueue.songs)
        }
        catch (err) {
            console.log(err);
            return message.channel.send("Something went wrong...", err);
        }
    }
}