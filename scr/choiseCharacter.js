import askMySQL from "./askMySQL.js";
import { sendErrorToUser } from "./sendErrorMessage.js";


const choiseCharacter = async (bot, pool, chatId) => {
    let resRows = await askMySQL(bot, pool, `SELECT id, name FROM characters WHERE host = ${chatId}`, 104)
    if (resRows == -1) return sendErrorToUser();
    if (resRows.length < 1) return bot.sendMessage(chatId, "У Вас нет персонажей для игры");
    const customsList = [[]];
    let a = 0, b = 0;
    resRows.forEach((val) => {
        if (a >= 3) {
            b++;
            a = 0;
            customsList.push([]);
        }
        customsList[b].push({ text: `${val.name}` })
        a++;
    })
    return bot.sendMessage(chatId, `Выбери персонажа для игры`, { reply_markup: JSON.stringify({ keyboard: customsList, resize_keyboard: true, input_field_placeholder: "Выбери персонажа для игры :В" }) });


    com.forEach((val, ind) => {
        if (ind < all) {
            M[row][sum[row]] = { text: keyTrack[location][val].text };
            sum[row]++;
            if (sum[row] >= count[row]) row++;
        }
    });


}

export default choiseCharacter;