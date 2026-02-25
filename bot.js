require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// Fast Cache Memory
let processingUsers = new Set();

bot.on("message", async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.includes("tiktok")) return;

    // Spam Protection
    if (processingUsers.has(chatId)) {
        return bot.sendMessage(chatId, "⚡ Processing চলতেছে...");
    }

    processingUsers.add(chatId);

    try {

        await bot.sendMessage(chatId, "🔥 Video Processing Fast...");

        const response = await axios.get(
            `https://tikwm.com/api/?url=${text}`,
            { timeout: 15000 }
        );

        const video = response?.data?.data?.play;

        if (!video) {
            processingUsers.delete(chatId);
            return bot.sendMessage(chatId, "❌ Video পাওয়া যায়নি");
        }

        // Button System
        const buttons = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "📱 Telegram", url: "https://t.me/YOUR_BOT_USERNAME" },
                        { text: "🌐 Website", url: "YOUR_WEBSITE_LINK" }
                    ]
                ]
            }
        };

        await bot.sendVideo(chatId, video, {
            caption: "✅ Download Ready",
            ...buttons
        });

    } catch (error) {

        bot.sendMessage(chatId, "❌ Server Error — আবার চেষ্টা করুন");

    }

    processingUsers.delete(chatId);

});
