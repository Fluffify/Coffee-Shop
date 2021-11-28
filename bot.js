import DiscordJS, { Intents, Message } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

let prefix = '!'
client.on('ready', () => {
    client.user.setActivity('!help')
    console.log('ready')
})

client.on('messageCreate', (message) => {
    if (message.content === prefix + 'help'){
        message.reply({
            content: "you need help"
        })
    } 
})

client.login(process.env.TOKEN)