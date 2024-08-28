require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Events } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ]
});

// Komutu kullanabilecek kullanıcıların ID'leri
const allowedUserIds = ['1031839669844987934', '1090594582133211227']; // Örneğin: ['123456789012345678', '987654321098765432']

client.on("ready", async () => {

    const { ActivityType } = require("discord.js")
    client.user.setActivity("ASL Bot's", { 
        type: ActivityType.Streaming, 
        url: "https://www.twitch.tv/aslxnn333"
    })
    
    })    

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, user } = interaction;

    // Yalnızca belirtilen kullanıcılar komutu kullanabilir
    if (!allowedUserIds.includes(user.id)) {
        return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok.', ephemeral: true });
    }

    if (commandName === 'verification') {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle("ASL Bot's Verification")
            .setDescription(
                '<:tr:1233279166762192976>  **Türkçe konuşuyorsanız aşağıdaki bayrağa tıklayın**\n' +
                '<:abd:1233279162404442123>  **Click on the flag below, if you speak English**\n' +
                '<:eng:1233279159778938920> **Нажмите на флаг ниже, если вы разговариваете по-русски**'
            );

        // Butonlar
        const buttonTurkish = new ButtonBuilder()
            .setCustomId('verifyTurkish')
            .setEmoji('<:tr:1233279166762192976>')
            .setStyle(ButtonStyle.Danger);

        const buttonEnglish = new ButtonBuilder()
            .setCustomId('verifyEnglish')
            .setEmoji('<:abd:1233279162404442123>')
            .setStyle(ButtonStyle.Danger);

        const buttonRussian = new ButtonBuilder()
            .setCustomId('verifyRussian')
            .setEmoji('<:eng:1233279159778938920>')
            .setStyle(ButtonStyle.Danger);

        // Butonları bir satıra ekleme
        const row1 = new ActionRowBuilder().addComponents(
            buttonTurkish,
            buttonEnglish,
            buttonRussian
        );

        // Yanıtı komutun gönderildiği kanalda gönder
        await interaction.channel.send({ embeds: [embed], components: [row1] });

        // Yanıtı komut kullanıcısına bildirim olarak gönder
        await interaction.reply({ content: 'Verify mesajı başarıyla gönderildi', ephemeral: true });
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    // Rol isimlerini ve customId'leri eşleştirin
    const roleMap = {
        'verifyTurkish': 'Türkçe',
        'verifyEnglish': 'English',
        'verifyRussian': 'Russian',
    };

    const buttonMap = {
        'verifyTurkish': '<:tr:1233279166762192976>',
        'verifyEnglish': '<:abd:1233279162404442123>',
        'verifyRussian': '<:eng:1233279159778938920>',
    };

    const roleName = roleMap[interaction.customId];
    if (!roleName) return;

    const role = interaction.guild.roles.cache.find(role => role.name === roleName);

    if (!role) {
        return interaction.reply({ content: 'Doğrulama rolü bulunamadı.', ephemeral: true });
    }

    if (interaction.member.roles.cache.has(role.id)) {
        await interaction.reply({ content: 'Zaten doğrulandınız!', ephemeral: true });
    } else {
        await interaction.member.roles.add(role);
        await interaction.reply({ content: `Başarıyla "${roleName}" rolü verildi!`, ephemeral: true });
    }

    // Yardımcı fonksiyon
    function getDisabledButtons(currentId) {
        // Butonları bir satıra ekleyin
        const rowButtons = Object.keys(buttonMap).map(id =>
            new ButtonBuilder()
                .setCustomId(id)
                .setEmoji(buttonMap[id])
                .setStyle(ButtonStyle.Danger)
                .setDisabled(id === currentId)
        );

        // Satır oluştur
        const row = new ActionRowBuilder().addComponents(rowButtons);

        return [row];
    }
});

client.login(process.env.DISCORD_TOKEN);
