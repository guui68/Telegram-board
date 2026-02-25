require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

async function fetchVideo(url) {

    const apiList = [
        "https://tikwm.com/api/?url=",
        "https://api.douyin.wtf/api?url=",
        "https://www.tikwm.org/api/?url="
    ];

    for (let api of apiList) {

        try {

            const res = await axios.get(
                api + encodeURIComponent(url),
                { timeout: 30000 }
            );

            if (res?.data?.data?.play) {
                return res.data.data.play;
            }

        } catch {
            continue;
        }
    }

    return null;
}

bot.on("message", async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.startsWith("http")) return;

    try {

        await bot.sendMessage(chatId, "🔥 Processing Video...");

        const video = await fetchVideo(text);

        if (!video) {
            return bot.sendMessage(
                chatId,
                "❌ ভিডিও পাওয়া যায়নি\n👉 আবার চেষ্টা করুন"
            );
        }

        await bot.sendVideo(chatId, video, {
            caption: "✅ Download Ready"
        });

    } catch {

        bot.sendMessage(chatId, "❌ Server Error");

    }

});

console.log("✅ Bot Running");
