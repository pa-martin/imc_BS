module.exports.run = async (channel, ROLE_ID, PAM) => {
    const date = new Date();
    const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const START = [3, 5, 0];
    const END = [4, 6, 1];
    // 2 pour l'heure d'été, 1 pour l'heure d'hiver
    const UTC_OFFSET = (date.getMonth() >= 3 || date.getMonth() >= 2 && date.getDate() + (7 - date.getDay()) > 31) && (date.getMonth() <= 8 || date.getMonth() === 9 && date.getDate() + (7 - date.getDay()) <= 31) ? 2 : 1;

    if(START.includes(date.getUTCDay()) && date.getUTCHours() === 14) {
        supr();
        channel.send(`<@&${ROLE_ID}> Début d'une nouvelle bataille !`);
    }else if(END.includes(date.getUTCDay()) && date.getUTCHours() === 12 - UTC_OFFSET) {
        supr();
        channel.send(`<@&${ROLE_ID}> Fin de la bataille dans ${14 - date.getUTCHours()} heures !`);
    }else if(END.includes(date.getUTCDay()) && date.getUTCHours() === 13 - UTC_OFFSET & date.getMinutes() === 30) {
        await PAM.lastMessage.delete().catch();
        PAM.send("Il te reste 30min trou de balle.")
    }else if(END.includes(date.getUTCDay()) && date.getUTCHours() === 14) {
        supr();
        channel.send(`La bataille est terminée, rendez-vous ${DAYS[(date.getDay()+(date.getUTCDay() === 1 ? 2 : 1))%7]}, ${date.getUTCHours() + UTC_OFFSET} heure, pour une nouvelle bataille !`);
    }

    function supr() {
        channel.messages.fetch(channel.lastMessageId)
            .then(m => m.delete())
            .catch();
    }
}