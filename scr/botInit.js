import TelegramBot from "node-telegram-bot-api";
import inf from '../tokens.json'  assert { type: "json" };

import constants from '../Кастомные штуки/Константы.json' assert { type: "json" };
import variables from '../Кастомные штуки/Генератор квестов/Список переменных.json' assert { type: "json" };
import mySQLInit from "./mySQLInit.js";
import { createPool } from "mysql2";
import adminCommands from "./adminCommands.js";
import askMySQL from "./askMySQL.js";
import choiseCharacter from "./choiseCharacter.js";
import sendNewLoacation, { keyTrack } from "./sendNewLoacation.js";
import { changeMyText, getMyText } from "./myText.js";
import { sendErrorToUser } from "./sendErrorMessage.js";

const botInit = async () => {
    const bot = new TelegramBot(inf.token, { polling: true });
    if (await mySQLInit(bot, { login: inf.login, pass: inf.pass, bd: inf.dataBaseName }) == 0) console.log("База данных успешно иницализирована");
    bot.on('text', async ({ chat, text }) => {
        const messageMas = text.split(' ')[0] === inf.botName ? text.split(' ').slice(1) : text.split(' ');
        const messageLine = messageMas.join(' ');
        const pool = createPool({ connectionLimit: 1, host: "localhost", user: inf.login, password: inf.pass, database: inf.dataBaseName }).promise();
        if (messageMas[0] === '/admin') return adminCommands(bot, pool, messageMas, chat.id, chat);
        let userExists = false;
        let activeCharacter = null;
        let resRows = await askMySQL(bot, pool, `SELECT activeCharacter FROM users WHERE id = ${chat.id}`, 101)
        if (resRows == -1) return sendErrorToUser(bot, chat.id);
        if (resRows.length != 0) { userExists = true; activeCharacter = resRows[0].activeCharacter; }
        if (messageMas[0] == '/choise_character') {
            if (userExists) {
                resRows = await askMySQL(bot, pool, `UPDATE users SET activeCharacter = null WHERE id = ${chat.id}`, 108)
                if (resRows == -1) return sendErrorToUser(bot, chat.id);
                return choiseCharacter(bot, pool, chat.id);
            } else return bot.sendMessage(chat.id, `Вы пока не зарегестрированы и не можете использовать эту команду`);
        }
        if (messageMas[0] == '/info') { 
            if (userExists) return bot.sendMessage(chat.id, getMyText('Тексты/Информация для пользователей'));
            else return bot.sendMessage(chat.id, getMyText('Тексты/Информация для гостей'));
        }
        if (messageMas[0] == '/send_message_dm') {
            if (messageMas.length == 1) return bot.sendMessage(chat.id, 'Нажми на эту кнопку и пропиши свое сообщение дму, мы обязательно его отправим', { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: `Послать сообщение дму`, switch_inline_query_current_chat: `/send_message_dm \nТут твое сообщение` }]] }) })
            let text = ''
            if (userExists) {
                resRows = await askMySQL(bot, pool, `SELECT name FROM users  WHERE id = ${chat.id}`, 99)
                if (resRows == -1) return sendErrorToUser(bot, chat.id);
                text = `Сообщение от пользователя ${resRows[0].name} (${chat.id}):`
            }
            else {
                resRows = await askMySQL(bot, pool, `SELECT userName FROM guests  WHERE id = ${chat.id}`, 99)
                if (resRows == -1) return sendErrorToUser(bot, chat.id);
                text = `Сообщение от гостя ${resRows[0].userName} (${chat.id}):`
            }
            await bot.sendMessage(inf.adminGetMessages, text + '\n' + messageMas.slice(1).join(' '));
            return bot.sendMessage(chat.id, `Отправили сообщение Дму`);
        }
        if (userExists) {
            await bot.setMyCommands([{ command: '/choise_character', description: 'Меню выбора персонажа' }, { command: '/info', description: 'Как работать с ботом' }, { command: '/send_message_dm', description: 'Написать дму' }], { scope: JSON.stringify({ type: "chat", chat_id: chat.id }) });
            if (activeCharacter === null) {
                resRows = await askMySQL(bot, pool, `SELECT id, name FROM characters WHERE host = ${chat.id}`, 104)
                if (resRows == -1) return sendErrorToUser(bot, chat.id);
                if (resRows.length === 0) return bot.sendMessage(chat.id, `У Вас нет ни одного персонажа`, { reply_markup: JSON.stringify({ remove_keyboard: true }) });
                for (let i = 0; i < resRows.length; i++) {
                    if (messageLine === resRows[i].name.split(' ').join(' ')) {
                        const id = resRows[i].id;
                        resRows = await askMySQL(bot, pool, `UPDATE users SET activeCharacter = ${id} WHERE id = ${chat.id}`, 105)
                        if (resRows == -1) return sendErrorToUser(bot, chat.id);
                        resRows = await askMySQL(bot, pool, `SELECT * FROM characters WHERE id = ${id}`, 106)
                        if (resRows == -1) return sendErrorToUser(bot, chat.id);
                        return sendNewLoacation(bot, pool, 'Загрузка', resRows[0].location, resRows[0].dopState1, resRows[0].dopState2, resRows[0].dopState3, chat.id, { id: resRows[0].id, name: resRows[0].name, silver: resRows[0].silver, sienceLevel: resRows[0].sienceLevel, sienceTimer: resRows[0].sienceTimer, needGiverecipe: resRows[0].needGiverecipe, rang: resRows[0].rang, living: resRows[0].living }, 'Загрузка');
                    }
                }
                return choiseCharacter(bot, pool, chat.id);
            } else {
                //Переходим к персонажу
                resRows = await askMySQL(bot, pool, `SELECT * FROM characters WHERE host = ${chat.id} AND id = ${activeCharacter}`, 107)
                if (resRows == -1) return sendErrorToUser(bot, chat.id);
                if (resRows.length === 0) {
                    resRows = await askMySQL(bot, pool, `UPDATE users SET activeCharacter = null WHERE id = ${chat.id}`, 108)
                    if (resRows == -1) return sendErrorToUser(bot, chat.id);
                    if (resRows.affectedRows) return bot.sendMessage(chat.id, `Чот не могу найти у Вас выбранного перса, давай-ка сначала`);
                    else return bot.sendMessage(chat.id, `Что-то пошло не так, не могу найти у Вас выбранного перса и не могу сбросить выбор`);
                }
                const character = resRows[0];
                if (!keyTrack[character.location]) {
                    return sendNewLoacation(bot, pool, 'Городская площадь', 'Городская площадь', character.dopState1, character.dopState2, character.dopState3, chat.id, { id: character.id, name: character.name, silver: character.silver, sienceLevel: character.sienceLevel, sienceTimer: character.sienceTimer, needGiverecipe: character.needGiverecipe, rang: character.rang, living: character.living }, messageLine);
                }
                for (let i = 0; i < keyTrack[character.location].length; i++) {
                    if (keyTrack[character.location][i].text === messageLine) return sendNewLoacation(bot, pool, character.location, keyTrack[character.location][i].to, character.dopState1, character.dopState2, character.dopState3, chat.id, { id: character.id, name: character.name, silver: character.silver, sienceLevel: character.sienceLevel, sienceTimer: character.sienceTimer, needGiverecipe: character.needGiverecipe, rang: character.rang, living: character.living }, messageLine);
                }
                return sendNewLoacation(bot, pool, character.location, character.location, character.dopState1, character.dopState2, character.dopState3, chat.id, { id: character.id, name: character.name, silver: character.silver, sienceLevel: character.sienceLevel, sienceTimer: character.sienceTimer, needGiverecipe: character.needGiverecipe, rang: character.rang, living: character.living }, messageLine);
            }
        } else {
            await bot.setMyCommands([{ command: '/registr', description: 'Регистрация' }, { command: '/info', description: 'Как работать с ботом' }, { command: '/send_essage_dm', description: 'Написать дму' }], { scope: JSON.stringify({ type: "chat", chat_id: chat.id }) });
            if (messageMas[0] == '/start') { await bot.sendMessage(chat.id, `Добро пожаловать в котельню`); }
            resRows = await askMySQL(bot, pool, `SELECT * FROM guests WHERE id = ${chat.id}`, 102)
            if (resRows == -1) return sendErrorToUser(bot, chat.id);
            if (resRows.length != 0) return bot.sendMessage(chat.id, `Вы у нас не зарегестрированы, но мы уже отправили сообщение дму/nПожалуйста подождите ответа`);
            if (messageMas[0] == '/registr' || messageMas.join(' ') === "Хочу зарегестрироваться") {
                resRows = await askMySQL(bot, pool, `INSERT INTO guests (id, firstName, lastName, userName, firstTime) VALUES (${chat.id},"${chat.first_name}", "${chat.last_name}", "${chat.username}", SYSDATE())`, 103)
                if (resRows == -1) return sendErrorToUser(bot, chat.id);
                if (resRows.affectedRows) {
                    await bot.sendMessage(inf.adminGetMessages, `Подключен новый гость\nid: ${chat.id}\nusername: ${chat.username}\nfirst_name: ${chat.first_name}\nlast_name: ${chat.last_name}`, { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: `Добавить пользователя`, switch_inline_query_current_chat: `/admin addNewUser ${chat.id} ${chat.username} Новое_примечание` }]] }) });
                    return bot.sendMessage(chat.id, `Отправили сообщение дму`);
                }
            }
            return bot.sendMessage(chat.id, `Вы у нас не зарегестрированы!\nОтправте /registr и мы сообщим дму, что Вы хотите присоединиться`, { reply_markup: JSON.stringify({ keyboard: [[{ text: `Хочу зарегестрироваться` }]], is_persistent: true, resize_keyboard: true }) });
        }

    })
}
export default botInit;