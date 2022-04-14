module.exports.run = async (channel, ROLE_ID) => {
    const date = new Date();
    const START = [3, 5, 0];
    const END = [4, 6, 1];

    if(START.includes(date.getUTCDay()) && date.getUTCHours() === 14) {
        supr();
        channel.send(`<@&${ROLE_ID}> Début de la guerre !`);
    }else if(END.includes(date.getUTCDay()) && date.getUTCHours() === 10) {
        supr();
        channel.send(`<@&${ROLE_ID}> Fin de la guerre dans ${14 - date.getUTCHours()} heure(s) !`);
    }

    function supr() {
        channel.messages.fetch(channel.lastMessageId)
            .then(m => m.delete())
            .catch();
    }
}