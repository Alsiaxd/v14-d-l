require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'verification',
        description: 'Doğrulama rolü almak için kullanılır.',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Slash komutları güncelleniyor...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Slash komutları başarıyla yüklendi.');
    } catch (error) {
        console.error(error);
    }
})();
