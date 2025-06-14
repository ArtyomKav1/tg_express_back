import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'

const token = "7532248685:AAFmHSPBqhwegFa6waN0V8PPgXTCMDN15p8"
const webApp = "https://tg-react-lands.netlify.app/"



const myIp = {
    v0: "https://v0.personal-website.ru/",
    v2: "https://v2.personal-website.ru/",
    v4: "https://v4.personal-website.ru/",
    v6: "https://v6.personal-website.ru/",
    vue: "https://mail.personal-website.ru/"

}



const PORT = 8000

const bot = new TelegramBot(token, { polling: true });
const app = express()


app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text


    if (text === "/start") {
        console.log("start")

        await bot.sendMessage(chatId, 'site:', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "v0",
                            web_app: { url: myIp.v0 }
                        },
                        {
                            text: "v2",
                            web_app: { url: myIp.v2 }
                        },
                        {
                            text: "v4",
                            web_app: { url: myIp.v4 }
                        },
                    ],
                    [

                        {
                            text: "v6",
                            web_app: { url: myIp.v6 }
                        },
                        {
                            text: "vue-tg",
                            web_app: { url: myIp.vue }
                        },
                        {
                            text: "Сделать заказ",
                            web_app: { url: "https://tg-react-lands.netlify.app/form" }
                        }

                    ],
                ]
            },

        })

        // await bot.sendMessage(chatId, 'с ссылкой', {

        //     reply_markup: {
        //         inline_keyboard: [
        //             [

        //             ]
        //         ]
        //     }
        // })
        // await bot.sendMessage(chatId, 'myweb', {

        //     reply_markup: {
        //         inline_keyboard: [
        //             [
        //                 {
        //                     text: "Сделать заказ",
        //                     web_app: { url: "https://tg-react-lands.netlify.app/form" }
        //                 }
        //             ]
        //         ]
        //     }
        // })
    }
    if (msg?.web_app_data?.data) {
        console.log(msg?.web_app_data?.data)
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            if (!data.country || !data.sity) {
                return bot.sendMessage(chatId, "Ошибка: не все данные заполнены");
            }

            await bot.sendMessage(
                chatId,
                `✅ Спасибо за обратную связь!\n` +
                `🌍 Страна: ${data.country}\n` +
                `🏙️ Город: ${data.sity}\n` +
                `📋 Тип: ${data.subject === 'physical' ? 'Физ. лицо' : 'Юр. лицо'}\n\n`

            )
            setTimeout(() => { bot.sendMessage(chatId, "Всю информацию вы получить в этом чате") }, 3000)
        } catch (e) {
            console.error("Ошибка обработки данных:", e);
            if (msg?.chat?.id) {
                await bot.sendMessage(msg.chat.id, "⚠️ Произошла ошибка при обработке данных");
            }
        }
    }

});




app.post("/web-data", async (req, res) => {
    const { products, totalPrice, queryId } = req.body
    try {
        await bot.answerWebAppQuery(chatId, {
            type: "article",
            id: queryId,
            title: "Успешная покупка",
            input_message_content: { messge_text: "Поздравляю с покупкой, выприобрели товар на сумму" + totalPrice }
        })
        return res.status(200).json({})
    } catch (e) {
        await bot.answerWebAppQuery(chatId, {
            type: "article",
            id: queryId,
            title: "Не удалось приобрести товар",
            input_message_content: { messge_text: "Не удалось приобрести товар" }
        })
        return res.status(500).json({})
    }
})
app.listen(PORT, () => console.log("Server started on PORT" + PORT))


