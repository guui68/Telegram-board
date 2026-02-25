require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "🔥 Ultra TikTok Downloader Bot\n\n📌 TikTok Link পাঠাও"
    );
});

bot.on("message", async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.includes("tiktok")) return;

    try {

        bot.sendMessage(chatId, "⚡ Processing...");

        const response = await axios.get(
            `https://tikwm.com/api/?url=${text}`
        );

        if (!response.data?.data?.play) {
            return bot.sendMessage(chatId, "❌ ভিডিও পাওয়া যায়নি");
        }

        await bot.sendVideo(
            chatId,
            response.data.data.play,
            {
                caption: "✅ Premium Download Ready"
            }
        );

    } catch (err) {
        bot.sendMessage(chatId, "❌ Server Error");
    }

});
