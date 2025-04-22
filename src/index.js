import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'

const token = "7583381746:AAHWL17huYG8gl5Jce0gKr_JxilYY1yUbvU"
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
                            web_app: { url: webApp }
                        }
                    ]
                ]
            }
        })

    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            bot.sendMessage(chatId, "Спасибо за обратную связь")
            bot.sendMessage(chatId, "Ваша страна: " + data.country)
            bot.sendMessage(chatId, "Ваш город: " + data.sity)
            setTimeout(() => { bot.sendMessage(chatId, "Всю информацию вы получить в этом чате") }, 3000)
        } catch (e) {
            console.log(e)
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






// bot.onText(/\/echo (.+)/, (msg, match) => {


//     const chatId = msg.chat.id;
//     const resp = match[1];

//     bot.sendMessage(chatId, resp);
// });