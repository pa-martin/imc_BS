const { Client, Intents } = require('discord.js');
const config = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.on('ready', () => {
    console.log(`started`);

    const date = new Date();
    const channel = client.channels.cache.get(config.CHANNEL_ID);
    const PAM = client.users.cache.get(config.PAM_ID);
/*
    channel.send("Bonjour !\n" +
        "Seront données dans ce channel les alertes relatives au début et à la fin des jours de guerre.\n" +
        "N'hésite pas à réagir à ce message pour te voir attribuer le rôle de guerre !")
        .then(msg => {
            msg.react(msg.guild.emojis.cache.find(emoji => emoji.name === 'bs').id);
            console.log(msg.id)
        });
*/
    channel.messages.fetch(config.MESSAGE_ID)
        .then(msg => msg.react(msg.guild.emojis.cache.find(emoji => emoji.name === 'bs')))
        .catch(e => console.log(`Le message n'existe plus.\n${e}`));

    setTimeout(() => {
        require(`./update.js`).run(channel, config.ROLE_ID);
        setInterval(async function(){ await require(`./update.js`).run(channel, config.ROLE_ID); }, 3600 * 1000);
    },(((59)%60) - date.getMinutes()) * 60 * 1000 + (60 - date.getSeconds()) * 1000 + (999 - date.getMilliseconds()));
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.id !== config.MESSAGE_ID) return;
    if (reaction.partial) {
        try { await reaction.fetch(); }
        catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            return;
        }
    }

    const USER = await reaction.message.guild.members.cache.get(user.id);

    if(USER.roles.cache.get(config.ROLE_ID))
        USER.roles.remove(config.ROLE_ID)
            .catch(e => console.log(`Impossible de retirer le rôle.\n${e}`));
    else
        USER.roles.add(config.ROLE_ID)
            .catch(e => console.log(`Impossible d'ajouter le rôle.\n${e}`));

    await reaction.users.remove(user.id);
});

// invite link: https://discord.com/api/oauth2/authorize?client_id=963769091196334120&permissions=8&scope=bot
let TOKEN;
try{ TOKEN = require(`./token.json`).token; } catch(e) {}
if(TOKEN === undefined) TOKEN = process.env.TOKEN;
try{ client.login(TOKEN); } catch(e) {}