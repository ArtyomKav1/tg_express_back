import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'

const token = "7770490584:AAG5Y24T_a1IwfntHTxwxTcaV-CUSwcZsDo"
const webApp = "https://tg-react-lands.netlify.app/"
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

        await bot.sendMessage(chatId, 'с выпадающей формой', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "open web site form",
                            web_app: { url: "https://tg-react-lands.netlify.app/form" }
                        },
                        {
                            text: "open web site ProductsList",
                            web_app: { url: webApp }
                        }
                    ],
                ]
            },

        })

        await bot.sendMessage(chatId, 'с ссылкой', {

            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Сделать заказ",
                            web_app: { url: "https://tg-react-lands.netlify.app/form" }
                        }
                    ]
                ]
            }
        })

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

bot.on('web_app_data', (msg) => {
    console.log('WebApp data received:', msg);
});



// bot.onText(/\/echo (.+)/, (msg, match) => {


//     const chatId = msg.chat.id;
//     const resp = match[1];

//     bot.sendMessage(chatId, resp);
// });