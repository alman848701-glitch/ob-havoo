// Telegram Ob-havo Boti
// Muallif: Alman

const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Botni yaratish
const bot = new Telegraf(process.env.BOT_TOKEN);

// Asosiy klaviatura
const mainKeyboard = Markup.keyboard([
    ['📍 Mening joyim', '🌆 Toshkent'],
    ['🌇 Samarqand', '🏙️ Buxoro'],
    ['🌃 Andijon', '📅 Prognoz'],
    ['ℹ️ Yordam']
]).resize();

// Start komandasi
bot.start((ctx) => {
    const welcomeMessage = `
🌤️ *Ob-havo Botiga Xush Kelibsiz!*

*Shahar tanlang yoki joylashuvingizni yuboring:*
    `;
    
    ctx.replyWithMarkdown(welcomeMessage, mainKeyboard);
});

// Yordam komandasi
bot.help((ctx) => {
    const helpText = `
*📚 Foydalanish qo'llanmasi:*

1. *📍 Mening joyim* - GPS orqali ob-havo
2. Shahar nomini tanlang yoki yozing
3. *📅 Prognoz* - Kelgusi ob-havo

*🏙️ Mavjud shaharlar:*
Toshkent, Samarqand, Buxoro, Andijon, Farg'ona, Namangan, Qarshi
    `;
    
    ctx.replyWithMarkdown(helpText);
});

// Joylashuv so'ralganda
bot.hears('📍 Mening joyim', (ctx) => {
    ctx.reply('📍 Joylashuvingizni yuboring:', 
        Markup.keyboard([
            Markup.button.locationRequest('📍 Joylashuv yuborish'),
            ['🔙 Orqaga']
        ]).resize()
    );
});

// Shaharlar uchun javoblar
const cityResponses = {
    '🌆 Toshkent': '🌆 *Toshkent ob-havosi:*\n🌡️ Harorat: 25°C\n☁️ Holat: Ochiq osmon\n💧 Namlik: 65%',
    '🌇 Samarqand': '🌇 *Samarqand ob-havosi:*\n🌡️ Harorat: 28°C\n☁️ Holat: Quyoshli\n💧 Namlik: 55%',
    '🏙️ Buxoro': '🏙️ *Buxoro ob-havosi:*\n🌡️ Harorat: 30°C\n☁️ Holat: Issiq\n💧 Namlik: 40%',
    '🌃 Andijon': '🌃 *Andijon ob-havosi:*\n🌡️ Harorat: 26°C\n☁️ Holat: Ozgina bulutli\n💧 Namlik: 60%'
};

// Shaharlar uchun handler
bot.hears(Object.keys(cityResponses), (ctx) => {
    ctx.replyWithMarkdown(cityResponses[ctx.message.text], mainKeyboard);
});

// Joylashuv qabul qilish
bot.on('location', (ctx) => {
    ctx.replyWithMarkdown(`
📍 *Joylashuvingiz qabul qilindi!*

🌡️ Harorat: 24°C
☁️ Holat: Yog'ingarchilik
💧 Namlik: 75%
🌬️ Shamol: 5 m/s

*Haqiqiy ma\'lumotlar uchun API kalit sozlang*
    `, mainKeyboard);
});

// Prognoz
bot.hears('📅 Prognoz', (ctx) => {
    ctx.replyWithMarkdown(`
📅 *5 kunlik prognoz (Toshkent):*

1. 🟢 *Bugun:* 25°C, Quyoshli
2. 🔵 *Ertaga:* 24°C, Bulutli
3. 🌦️ *3-kun:* 22°C, Yog'ingarchilik
4. ☀️ *4-kun:* 26°C, Ochiq osmon
5. ⛅ *5-kun:* 23°C, Ozgina bulutli
    `, mainKeyboard);
});

// Orqaga tugmasi
bot.hears('🔙 Orqaga', (ctx) => {
    ctx.reply('Asosiy menyu:', mainKeyboard);
});

// Har qanday matn uchun (shahar nomi yozilsa)
bot.on('text', (ctx) => {
    const text = ctx.message.text;
    
    // Agar shahar nomi yozilgan bo'lsa
    if (text && text.length > 2 && !text.startsWith('/')) {
        ctx.replyWithMarkdown(`
🔍 *${text} ob-havosi:*

🌡️ Harorat: 22°C
☁️ Holat: Normal
💧 Namlik: 68%

*Haqiqiy ma\'lumotlar uchun:\n.env fayliga API kalit qo\'ying*
        `, mainKeyboard);
    }
});

// Botni ishga tushirish
bot.launch()
    .then(() => {
        console.log('✅ Bot ishga tushdi!');
        console.log('🤖 Bot foydalanishi uchun:');
        console.log('1. .env faylida BOT_TOKEN sozlang');
        console.log('2. OpenWeatherMap API kalit oling');
    })
    .catch((err) => {
        console.error('❌ Xatolik:', err.message);
        console.log('💡 Yechim: .env faylida BOT_TOKEN ni tekshiring');
    });

// Server to'xtashini qayta ishlash
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
