require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// Processing Memory
let processing = new Set();

// Backup API List
const apiServers = [
    "https://tikwm.com/api/?url=",
    "https://api.douyin.wtf/api?url=",
    "https://www.tikwm.org/api/?url="
];

// AI Style Backup Fetch System
async function fetchVideo(url) {

    for (let server of apiServers) {

        try {

            const res = await axios.get(server + encodeURIComponent(url), {
                timeout: 25000
            });

            if (res?.data?.data?.play) {
                return res.data.data.play;
            }

        } catch {
            continue;
        }
    }

    return null;
}

// Bot Message Listener
bot.on("message", async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.includes("http")) return;

    if (processing.has(chatId)) return;

    processing.add(chatId);

    try {

        await bot.sendMessage(chatId, "🔥 AI Processing Download...");

        const video = await fetchVideo(text);

        if (!video) {
            return bot.sendMessage(
                chatId,
                "❌ Video পাওয়া যায়নি\n👉 আবার চেষ্টা করুন"
            );
        }

        // Button System
        const buttons = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "📱 Telegram Admin",
                            url: "https://t.me/samim801"
                        }
                    ]
                ]
            }
        };

        await bot.sendVideo(chatId, video, {
            caption: "✅ Premium Download Ready",
            ...buttons
        });

    } catch (err) {

        bot.sendMessage(chatId, "❌ Server Error");

    }

    processing.delete(chatId);

});

console.log("🔥 Multi Backup AI Bot Running...");
