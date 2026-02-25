require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// Processing memory
let processing = new Set();

bot.on("message", async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.includes("http")) return;

    if (processing.has(chatId)) return;

    processing.add(chatId);

    try {

        await bot.sendMessage(chatId, "🔥 Processing Video...");

        // Primary API
        let response;

        try {
            response = await axios.get(
                `https://tikwm.com/api/?url=${text}`,
                { timeout: 30000 }
            );
        } catch {
            response = null;
        }

        if (!response || !response.data?.data?.play) {
            return bot.sendMessage(
                chatId,
                "❌ Video পাওয়া যায়নি\n👉 আবার চেষ্টা করুন"
            );
        }

        const video = response.data.data.play;

        await bot.sendVideo(chatId, video, {
            caption: "✅ Download Ready"
        });

    } catch (err) {

        bot.sendMessage(
            chatId,
            "❌ Server Error\n👉 আবার চেষ্টা করুন"
        );

    }

    processing.delete(chatId);

});

console.log("Bot Running...");
