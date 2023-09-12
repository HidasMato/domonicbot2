
import inf from '../tokens.json'  assert { type: "json" };

export const sendErrorToUser = async (bot, chatId, text = `Произошла ошибка в бд, мы уже отправили сообщение администратору по ошибкам`) => {
    return bot.sendMessage(chatId, text)

}

export const adminsGetError = async (bot, text) => {
    for (let admin of inf.adminsGetError)
        await bot.sendMessage(admin, text);
}

export const adminsGetMessage = async (bot, text) => {
    await bot.sendMessage(inf.adminGetMessages, text);
}
