require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

let processing = new Set();

bot.on("message", async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.includes("tiktok")) return;

    if (processing.has(chatId)) {
        return bot.sendMessage(chatId, "⚡ Processing...");
    }

    processing.add(chatId);

    try {

        await bot.sendMessage(chatId, "🔥 Video Fetching...");

        const response = await axios.get(
            `https://tikwm.com/api/?url=${text}`,
            {
                timeout: 25000
            }
        );

        if (!response.data || !response.data.data || !response.data.data.play) {
            throw new Error("Video Not Found");
        }

        const video = response.data.data.play;

        await bot.sendVideo(chatId, video, {
            caption: "✅ Download Ready"
        });

    } catch (error) {

        console.log(error.message);

        bot.sendMessage(
            chatId,
            "❌ Server Busy বা Video পাওয়া যায়নি\n👉 আবার চেষ্টা করুন"
        );

    }

    processing.delete(chatId);

});
