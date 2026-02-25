require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// Processing Lock System
let userLock = new Set();

async function getVideo(url) {

    const apis = [
        "https://tikwm.com/api/?url=",
        "https://api.douyin.wtf/api?url="
    ];

    for (let api of apis) {

        try {

            const res = await axios.get(api + encodeURIComponent(url), {
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

bot.on("message", async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.startsWith("http")) return;

    if (userLock.has(chatId)) return;

    userLock.add(chatId);

    try {

        await bot.sendMessage(chatId, "🔥 Video Processing...");

        const video = await getVideo(text);

        if (!video) {
            return bot.sendMessage(chatId, "❌ Video পাওয়া যায়নি");
        }

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
            caption: "✅ Download Ready",
            ...buttons
        });

    } catch (error) {

        bot.sendMessage(chatId, "❌ Server Error");

    }

    // Lock release after 3 sec
    setTimeout(() => {
        userLock.delete(chatId);
    }, 3000);

});

console.log("✅ Bot Running");
