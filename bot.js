require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// Prevent multiple processing
let userBusy = new Set();

async function getVideo(url) {

    const apiList = [
        "https://tikwm.com/api/?url=",
        "https://api.douyin.wtf/api?url="
    ];

    for (let api of apiList) {

        try {

            const res = await axios.get(
                api + encodeURIComponent(url),
                { timeout: 40000 }
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

    if (userBusy.has(chatId)) return;

    userBusy.add(chatId);

    try {

        await bot.sendMessage(chatId, "🔥 Processing Video...");

        const video = await getVideo(text);

        if (!video) {
            return bot.sendMessage(chatId, "❌ Video পাওয়া যায়নি");
        }

        await bot.sendVideo(chatId, video, {
            caption: "✅ Download Ready"
        });

    } catch (error) {

        console.log(error.message);

        bot.sendMessage(chatId, "❌ Server Error — আবার চেষ্টা করুন");

    }

    setTimeout(() => {
        userBusy.delete(chatId);
    }, 5000);

});

console.log("✅ Bot Running");
