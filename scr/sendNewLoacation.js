import TelegramBot from "node-telegram-bot-api";
import askMySQL from "./askMySQL.js";
import variables from '../Кастомные штуки/Генератор квестов/Список переменных.json' assert { type: "json" };
import constants from '../Кастомные штуки/Константы.json' assert { type: "json" };
import { changeMyText, getMyText } from "./myText.js";
import { adminsGetError, adminsGetMessage, sendErrorToUser } from "./sendErrorMessage.js";
import fs from "fs";
import choiseCharacter from "./choiseCharacter.js";

export const keyTrack = {
    'Городская площадь': [
        { text: 'Идти в котельню', to: 'Холл котельни' },
        { text: 'Идти в гильдию', to: 'Гильдия' },
        { text: 'Идти на рынок', to: 'Рыночная площадь' },
        { text: 'Идти фармить', to: 'Перекресток добычи' }
    ],
    'Рыночная площадь': [
        { text: 'Купить что-нибудь', to: 'Покупка' },
        { text: 'Продать что-нибудь', to: 'Продажа' },
        { text: 'Поискать приключений', to: 'Приключение' },
        { text: 'Вернуться к котельной', to: 'Городская площадь' }
    ],
    'Холл котельни': [
        { text: 'Идти в исследовательскую комнату', to: 'Кабинет исследователя' },
        { text: 'Идти в зельеварню', to: 'Комната с котлами' },
        { text: 'Идти на склад', to: 'Склад' },
        { text: 'Назад к порталу', to: 'Городская площадь' }
    ],
    'Перекресток добычи': [
        { text: 'Вернуться к зельеварне', to: 'Городская площадь' },
        { text: 'Вернуться на развилку фарма', to: 'Перекресток добычи' }
    ],
    'Фарминг': [
        { text: 'Отменить фарминг', to: 'Фарминг' },
        { text: 'Обновить', to: 'Фарминг' }
    ],
    'Кабинет исследователя': [
        { text: 'Спонсировать исследования', to: 'Кабинет исследователя' },
        { text: 'Улучшить стол исследователя', to: 'Кабинет исследователя' },
        { text: 'Вернуться в холл зельеварни', to: 'Холл котельни' }
    ],
    'Комната с котлами': [
        { text: 'Подойти к котлу 1', to: 'Комната с котлами' },
        { text: 'Подойти к котлу 2', to: 'Комната с котлами' },
        { text: 'Подойти к котлу 3', to: 'Комната с котлами' },
        { text: 'Подойти к котлу 4', to: 'Комната с котлами' },
        { text: 'Вернуться в холл зельеварни', to: 'Холл котельни' },
        { text: 'Открыть книгу рецептов', to: 'Комната с котлами' },
        { text: 'Следующая страница', to: 'Комната с котлами' },
        { text: 'Закрыть книгу', to: 'Комната с котлами' }
    ],
    'Склад': [
        { text: 'Попросить свой сундук', to: 'Склад' },
        { text: 'Попросить другой сундук', to: 'Склад' },
        { text: 'Вернуться в холл зельеварни', to: 'Холл котельни' }
    ],
    'Продажа': [
        { text: 'Попросить свой сундук', to: 'Продажа' },
        { text: 'Попросить другой сундук', to: 'Продажа' },
        { text: 'Вернуться на рыночную площадь', to: 'Рыночная площадь' }
    ],
    'Покупка': [
        { text: 'Купить', to: 'Покупка' },
        { text: 'Подойти к другому прилавоку', to: 'Покупка' },
        { text: 'Вернуться на рыночную площадь', to: 'Рыночная площадь' }
    ],
    'Приключение': [
        { text: 'Согласиться на приключение', to: 'Приключение' },
        { text: 'Искать другое приключение', to: 'Приключение' },
        { text: 'Вернуться на рыночную площадь', to: 'Приключение' }
    ],
    'Котел': [
        { text: 'Добавить основу', to: 'Котел' },
        { text: 'Добавить ингредиент', to: 'Котел' },
        { text: 'Добавить катализатор', to: 'Котел' },
        { text: 'Очистить котел', to: 'Котел' },
        { text: 'Починить котел', to: 'Котел' },
        { text: 'Прочитать справочник', to: 'Котел' },
        { text: 'Отойти от котла', to: 'Комната с котлами' },
        { text: 'Улучшить котел', to: 'Котел' }
    ],
    'Гильдия': [
        { text: 'Узнать о себе', to: 'Гильдия' },
        { text: 'Просмотреть задания', to: 'Доска заданий' },
        { text: 'Купить зелья', to: 'Торговая лавка гильдии' },
        { text: 'Вернуться на площадь', to: 'Городская площадь' },
    ],
    'Торговая лавка гильдии': [
        { text: 'Отмена', to: 'Гильдия' }
    ],
    'Доска заданий': [
        { text: 'Принять задание', to: 'Задание' },
        { text: 'Следующее задание', to: 'Доска заданий' },
        { text: 'Отойти от доски', to: 'Гильдия' },
        { text: 'Предыдущее задание', to: 'Доска заданий' }
    ],
    'Задание': [
        { text: 'Отменить задание', to: 'Задание' },
        { text: 'Обновление', to: 'Задание' },
        { text: 'В атаку', to: 'Задание' },
        { text: 'Сбежать', to: 'Задание' },
        { text: 'Попытаться из последних сил', to: 'Задание' }
    ]
};

const sendNewLoacation = async (bot, pool, fromLocation, toLocation, dopState1, dopState2, dopState3, chatId, character, messageLine) => {
    //fromLocation, toLocation, dopState1, dopState2, dopState3, chatId, character = { id, name, silver, sienceLevel, sienceTimer, needGiverecipe, rang, living }, messageLine
    const keyboardConstructor = (location, messageLines, line1 = 0, line2 = 0, line3 = 0, line4 = 0) => {
        const M = [[], [], [], []], count = [line1, line2, line3, line4], sum = [0, 0, 0, 0];
        let row = 0, all = 0;
        for (let i = 0; i < count.length; i++) all += count[i];
        messageLines.forEach((val, ind) => {
            if (ind < all) {
                M[row][sum[row]] = { text: keyTrack[location][val].text };
                sum[row]++;
                if (sum[row] >= count[row]) row++;
            }
        });
        return M;
    };
    const sendImage = async (image, text, keyboard) => {
        return bot.sendPhoto(chatId, image, { caption: text, reply_markup: JSON.stringify({ keyboard: keyboard ?? [[]], resize_keyboard: true }) }).catch(async (result) => {
            await bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboard ?? [[]], resize_keyboard: true }) });
            return adminsGetError(bot, `Невозможно найти картинку ${image}`)
        })
    }
    const changeMoney = async (kolvo = 0, sign = '+') => {
        let textMoney = `Состояние кошелька: ${character.silver} монет`;
        if (sign == '+') {
            let resRows = await askMySQL(bot, pool, `UPDATE characters SET silver = ${character.silver + kolvo} WHERE id = ${character.id}`, 200)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            textMoney += `\nДобавили ${kolvo} монет\nСостояние кошелька:\n${character.silver + kolvo} монет`;
        } else if (sign == '-') {
            if (character.silver < kolvo) {
                textMoney += `\nНедостаточно монет для оплаты (${kolvo})`;
                await bot.sendMessage(chatId, textMoney);
                return -1;
            } else {
                let resRows = await askMySQL(bot, pool, `UPDATE characters SET silver = ${character.silver - kolvo} WHERE id = ${character.id}`, 201)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                textMoney += `\nОтняли ${kolvo} монет\nСостояние кошелька:\n${character.silver - kolvo} монет`;
            }
        } else {
            console.log("Неправильно вызвана функция смены денег");
            return -1;
        }
        await bot.sendMessage(chatId, textMoney);
        return 0;
    }
    const getInventory = async (limit, page, mode = 0) => {
        const M = [
            `SELECT name, type, element, sum, cost FROM characterIngredients JOIN baseIngredients ON id = idIngredient where idCharacter = ${character.id} AND sum > 0`,
            'SELECT id, name, type, element, market, cost FROM baseIngredients WHERE market > 0'
        ]
        let resRows = await askMySQL(bot, pool, `${M[mode]} LIMIT ${limit * (page - 1)}, ${limit}`, 220)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        if (resRows[0] === undefined) {
            if (page === 1) return -1;
            return getInventory(limit, 1, mode);
        }
        return { page: page, res: resRows };
    };
    const getRecipes = async (limit, page) => {
        let resRows = await askMySQL(bot, pool, `SELECT name, description, (SELECT name from baseIngredients where id = ingrBase) as ingrBase, (SELECT name from baseIngredients where id = ingr1) as ingr1, (SELECT name from baseIngredients where id = ingr2) as ingr2, (SELECT name from baseIngredients where id = ingr3) as ingr3, (SELECT name from baseIngredients where id = ingr4) as ingr4, (SELECT name from baseIngredients where id = ingr5) as ingr5, (SELECT name from baseIngredients where id = ingrKatal) as ingrKatal, (SELECT name from baseIngredients where id = result) as result from baseRecipes JOIN characterRecipes ON idRecipe = id where idCharacter = ${character.id}`, 224)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        if (!resRows[0]) {
            if (page === 1) return -1;
            return getRecipes(limit, 1);
        }
        return { page: page, res: resRows };
    };
    const changeIngredient = async (idItem, kolvo, plusMinus) => {
        let resRows = await askMySQL(bot, pool, `SELECT sum FROM characterIngredients WHERE idIngredient = ${idItem} AND idCharacter = ${character.id}`, 271)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        if (resRows[0]) {
            const sum = Number(resRows[0]?.sum);
            if (plusMinus === '-') {
                resRows = await askMySQL(bot, pool, `UPDATE characterIngredients SET sum = ${sum - kolvo} WHERE idCharacter = ${character.id} AND idIngredient = ${idItem}`, 272)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            } else if (plusMinus === '+') {
                resRows = await askMySQL(bot, pool, `UPDATE characterIngredients SET sum = ${sum + kolvo} WHERE idCharacter = ${character.id} AND idIngredient = ${idItem}`, 273)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            } else {
                console.log(`Вторым аргументом должен быть знак + или -`);
                return -1;
            }
        } else {
            if (plusMinus === '-') {
                resRows = await askMySQL(bot, pool, `INSERT INTO characterIngredients (idCharacter,idIngredient, sum) values (${character.id},${idItem},${0 - kolvo})`, 274)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            } else if (plusMinus === '+') {
                resRows = await askMySQL(bot, pool, `INSERT INTO characterIngredients (idCharacter,idIngredient, sum) values (${character.id},${idItem},${kolvo})`, 275)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            } else {
                console.log(`Вторым аргументом должен быть знак + или -`);
                return -1;
            }
        }
    }
    const getElementNumber = (elementText) => {
        switch (elementText) {
            case 'свет':
                return 0;
            case 'вода':
                return 1;
            case 'земля':
                return 2;
            case 'тьма':
                return 3;
            case 'огонь':
                return 4;
            case 'воздух':
                return 5;
            default:
                return -1;
        }
    }
    const getQuests = async (id, next, mode) => {
        // next -1 предыдущий 0 текущий 1 следующий
        //Берет все, какие есть id
        const dop = {
            'none': '',
            'allFreeAndTodayNotFree': 'where (dateStart = CURDATE() AND customMake is not null) OR (customMake is null)', // Получить квест из сгенереных сегодня и сгенереных не сегодня и не взятых
            'allTakes': 'where customMake is not null' // Получить все взятые задания
        };
        resRows = await askMySQL(bot, pool, `Select id FROM quests ${dop[mode]}`, 289)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        if (!resRows[0]) return -1; //Нет квестов
        if (id == -1) id = resRows[0].id;
        let flag = false;
        for (let i = 0; i < resRows.length; i++) {
            if (resRows[i].id == id) {
                flag = true;
                if (next == 1) {
                    if (i == resRows.length - 1) id = resRows[0].id;
                    else id = resRows[i + 1].id;
                } else if (next == -1) {
                    if (i == 0) id = resRows[resRows.length - 1].id;
                    else id = resRows[i - 1].id;
                }
                break;
            }
        }
        if (!flag) return -2; // Нет этого квеста
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord, customMake, (SELECT name FROM characters where id = customMake) as customName FROM quests where id = ${id}`, 290)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        return resRows[0]
    };
    let resRows = await askMySQL(bot, pool, `UPDATE characters SET location = "${toLocation}" WHERE id = ${character.id}`, 202)
    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
    let text = "";
    switch (toLocation) {
        case 'Городская площадь': {
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 324)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return sendImage('./Кастомные штуки/Картинки/Здание котельни.jpg', changeMyText(getMyText('Тексты/Городская площадь'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0, 1, 2, 3], 2, 2, 2))
            break;
        }
        case 'Холл котельни': {
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 323)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return sendImage('./Кастомные штуки/Картинки/Холл котельни.jpg', changeMyText(getMyText('Тексты/Холл котельни'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0, 1, 2, 3], 2, 2, 2))
            break;
        }
        case 'Кабинет исследователя': {
            const giveZelie = async () => {
                if (character.needGiverecipe && (character.sienceTimer - new Date() < 0)) {
                    resRows = await askMySQL(bot, pool, `SELECT id FROM baseRecipes WHERE canSearch = true AND id NOT IN (SELECT idRecipe FROM characterRecipes WHERE idCharacter = ${character.id})`, 211)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    if (!resRows[0]) return bot.sendMessage(chatId, getMyText('Тексты/Исследователь/Сообщение. Нет неоткрытых рецептов'));
                    resRows = await askMySQL(bot, pool, `SELECT * FROM baseRecipes WHERE id = ${resRows[Math.floor(Math.random() * resRows.length)].id}`, 212)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    const zelie = resRows[0];
                    resRows = await askMySQL(bot, pool, `SELECT (SELECT name FROM baseIngredients WHERE id = ${zelie.ingrBase}) as base,(SELECT name FROM baseIngredients WHERE id = ${zelie.ingr1}) as ingr1,(SELECT name FROM baseIngredients WHERE id = ${zelie.ingr2}) as ingr2,(SELECT name FROM baseIngredients WHERE id = ${zelie.ingr3}) as ingr3,(SELECT name FROM baseIngredients WHERE id = ${zelie.ingr4}) as ingr4,(SELECT name FROM baseIngredients WHERE id = ${zelie.ingr5}) as ingr5,(SELECT name FROM baseIngredients WHERE id = ${zelie.ingrKatal}) as katal,(SELECT name FROM baseIngredients WHERE id = ${zelie.result}) as result;`, 213)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    const ingrName = resRows[0];
                    resRows = await askMySQL(bot, pool, `INSERT INTO characterRecipes (idCharacter, idRecipe) VALUES (${character.id}, ${zelie.id})`, 214)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    if (!resRows.affectedRows) return bot.sendMessage(chatId, "Не могу добавить Вам рецепт");
                    resRows = await askMySQL(bot, pool, `UPDATE characters SET needGiverecipe = false where id = ${character.id}`, 215)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    text = changeMyText(
                        getMyText(`Тексты/Исследователь/Сообщение. Закончил исследование`),
                        ['ZelieName', 'BaseIngredient', 'Ingredients', 'KatalizatorIngredient', 'Result'],
                        [zelie.name, ingrName.base, `${ingrName.ingr1}${ingrName.ingr2 ? `, ${ingrName.ingr2}` : ""}${ingrName.ingr3 ? `, ${ingrName.ingr3}` : ""}${ingrName.ingr4 ? `, ${ingrName.ingr4}` : ""}${ingrName.ingr5 ? `, ${ingrName.ingr5}` : ""}`, ingrName.katal, ingrName.result]
                    )
                    return bot.sendMessage(chatId, text);
                }
            }
            if (fromLocation == toLocation) {
                switch (messageLine) {
                    case keyTrack[toLocation][0].text: {
                        if (character.sienceTimer - new Date() < 0 && !character.needGiverecipe) {
                            if (await changeMoney(constants.SilverToSience, '-') === 0) {
                                resRows = await askMySQL(bot, pool, `UPDATE characters SET needGiverecipe = true, sienceTimer = DATE_ADD(SYSDATE(), INTERVAL ${constants.TimeToSienceLevel0 - constants.TimeToSienceLevelNext * character.sienceLevel} HOUR) where id =${character.id}`, 204)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                if (!resRows.affectedRows) return bot.sendMessage(chatId, `Не могу обновить время изучения`);
                                text = getMyText(`Тексты/Исследователь/Сообщение. Исследование начинается`);
                                character.sienceTimer = new Date((new Date()).setHours((new Date()).getHours() + constants.TimeToSienceLevel0 - constants.TimeToSienceLevelNext * character.sienceLevel));
                            }
                            else text = getMyText(`Тексты/Исследователь/Сообщение. Нет денег на исследование`);
                        } else text = getMyText(`Тексты/Исследователь/Сообщение. Исследование уже в процессе`);
                        break;
                    }
                    case keyTrack[toLocation][1].text: {
                        if (character.sienceLevel === 10) text = getMyText(`Тексты/Исследователь/Сообщение. Нечего улучшать`);
                        else if (await changeMoney(constants.SilverToTableLevel0 * Math.pow(constants.SilverToTableKof, character.sienceLevel), '-') === 0) {
                            character.sienceLevel++;
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET sienceLevel = ${character.sienceLevel}, sienceTimer = DATE_SUB((SELECT sienceTimer FROM (SELECT sienceTimer FROM characters where id = ${character.id} LIMIT 1) as a), INTERVAL ${constants.TimeToSienceLevelNext} HOUR) where id = ${character.id}`, 204)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            if (!resRows.affectedRows) return bot.sendMessage(chatId, `Не могу обновить время изучения`);
                            text = getMyText(`Тексты/Исследователь/Сообщение. Получил ул ${character.sienceLevel}`) + '\n' + getMyText(`Тексты/Исследователь/Конец имеет ул ${character.sienceLevel}`);;
                            character.sienceTimer.setHours(character.sienceTimer.getHours() - constants.TimeToSienceLevelNext);
                        }
                        else text = getMyText(`Тексты/Исследователь/Сообщение. Нет денег на улучшение`);
                        break;
                    }
                    default:
                        text = getMyText(`Тексты/Исследователь/Сообщение. Непонятная комманда`);
                        break;
                }
                text = changeMyText(
                    text,
                    ['AvName', 'SilverToSience', 'TimeToSience', 'LevelSience', 'SilverToTable', 'EndTimeSience'],
                    [character.name, constants.SilverToSience, constants.TimeToSienceLevel0 - constants.TimeToSienceLevelNext * character.sienceLevel, character.sienceLevel + 1, constants.SilverToTableLevel0 * Math.pow(constants.SilverToTableKof, character.sienceLevel), Math.ceil((character.sienceTimer - new Date()) / 3600000)]
                )
                await bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 1, 2], 2, 2, 2), resize_keyboard: true }) });
            } else {
                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 322)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                text = getMyText(`Тексты/Исследователь/Начало имеет ул ${character.sienceLevel}`);
                if (character.sienceTimer < new Date()) text = text + '\n' + getMyText(`Тексты/Исследователь/Центр изучений нет`);
                else text = text + '\n' + getMyText(`Тексты/Исследователь/Центр изучается сейчас`);
                text = text + '\n' + getMyText(`Тексты/Исследователь/Конец имеет ул ${character.sienceLevel}`);
                text = changeMyText(text,
                    ['AvName', 'SilverToSience', 'TimeToSience', 'LevelSience', 'SilverToTable', 'EndTimeSience'],
                    [character.name, constants.SilverToSience, constants.TimeToSienceLevel0 - constants.TimeToSienceLevelNext * character.sienceLevel, character.sienceLevel + 1, constants.SilverToTableLevel0 * Math.pow(constants.SilverToTableKof, character.sienceLevel), Math.ceil((character.sienceTimer - new Date()) / 3600000)]
                )
                await sendImage('./Кастомные штуки/Картинки/Кабинет исследователя.jpg', text, keyboardConstructor(toLocation, [0, 1, 2], 2, 2, 2))
            }
            return giveZelie();
            break;
        }
        case 'Склад': {
            if (fromLocation == toLocation) {
                let page = 1;
                switch (messageLine) {
                    case keyTrack[toLocation][1].text:
                        resRows = await askMySQL(bot, pool, `SELECT dopState1 FROM characters where id = ${character.id}`, 217)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        page = resRows[0]?.dopState1 + 1;
                        if (!page) page = 1;
                    case keyTrack[toLocation][0].text:
                        const itog = await getInventory(9, page);
                        if (itog == -1) {
                            return bot.sendMessage(chatId, "У Вас нет предметов в инвентаре");
                        }
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = ${itog.page} WHERE id = ${character.id}`, 218)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        text = changeMyText(getMyText(`Тексты/Склад/Сундук верх`), ['SundukNumber'], [itog.page]);
                        itog.res.forEach((item) => {
                            text = text + '\n' + changeMyText(getMyText(`Тексты/Склад/Предмет`), ['NameIngr', 'SumIngr', 'TypeIngr', 'ElementIngr'], [item.name, item.sum, item.type, item.element]);
                        })
                        return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 2], 2, 2, 2), resize_keyboard: true }) });
                    default:
                        return bot.sendMessage(chatId, getMyText(`Тексты/Склад/Непонятная комманда`));
                }
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 321)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            await sendImage('./Кастомные штуки/Картинки/Склад.jpg', changeMyText(getMyText('Тексты/Склад/Первый заход'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0, 2], 2, 2, 2))
            break;
        }
        case 'Комната с котлами': {
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState3 = 0  WHERE id = ${character.id}`, 227)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            if (fromLocation == toLocation) {
                if (dopState2 == 0) {
                    switch (messageLine) {
                        case keyTrack[toLocation][5].text: {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 1 WHERE id = ${character.id}`, 225)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            const itog = await getRecipes(3, dopState2);
                            if (itog == -1) return bot.sendMessage(chatId, "Ваша книга рецептов пуста", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [7], 2, 2, 2), resize_keyboard: true }) });
                            text = changeMyText(getMyText(`Тексты/Зельеварня/Книга рецептов`), ['PageNumber'], [1]);
                            itog.res.forEach((item) => {
                                text = text + '\n' + changeMyText(getMyText(`Тексты/Зельеварня/Перечень рецептов`), ['recipeName', 'recipeDescription', 'BaseIngr', 'Ingredients', 'KatalIngr', 'Result'], [item.name, item.description, item.ingrBase, `${item.ingr1}${item.ingr2 == null ? "" : '\n' + item.ingr2}${item.ingr3 == null ? "" : '\n' + item.ingr3}${item.ingr4 == null ? "" : '\n' + item.ingr4}${item.ingr5 == null ? "" : '\n' + item.ingr5}`, item.ingrKatal, item.result]);
                            })
                            return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [6, 7], 2, 2, 2), resize_keyboard: true }) });
                            break;
                        }
                        case keyTrack[toLocation][0].text: {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 1 WHERE id = ${character.id}`, 227)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            return sendNewLoacation(bot, pool, toLocation, 'Котел', 1, dopState2, dopState3, chatId, character, messageLine);
                            break;
                        }
                        case keyTrack[toLocation][1].text: {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 2 WHERE id = ${character.id}`, 228)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            return sendNewLoacation(bot, pool, toLocation, 'Котел', 2, dopState2, dopState3, chatId, character, messageLine);
                            break;
                        }
                        case keyTrack[toLocation][2].text: {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 3 WHERE id = ${character.id}`, 229)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            return sendNewLoacation(bot, pool, toLocation, 'Котел', 3, dopState2, dopState3, chatId, character, messageLine);
                            break;
                        }
                        case keyTrack[toLocation][3].text: {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 4 WHERE id = ${character.id}`, 230)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            return sendNewLoacation(bot, pool, toLocation, 'Котел', 4, dopState2, dopState3, chatId, character, messageLine);
                            break;
                        }
                        default:
                            break;
                    }
                    return bot.sendMessage(chatId, getMyText('Тексты/Зельеварня/Неизвестная команда'), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 1, 2, 3, 5, 4], 2, 2, 2), resize_keyboard: true }) });
                } else {
                    if (messageLine === keyTrack[toLocation][6].text) {
                        const itog = await getRecipes(3, dopState2);
                        if (itog == -1) return bot.sendMessage(chatId, "Ваша книга рецептов пуста", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [7], 2, 2, 2), resize_keyboard: true }) });
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = ${itog.page} WHERE id = ${character.id}`, 226)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        text = changeMyText(getMyText(`Тексты/Зельеварня/Книга рецептов`), ['PageNumber'], [itog.page]);
                        itog.res.forEach((item) => {
                            text = text + '\n' + changeMyText(getMyText(`Тексты/Зельеварня/Перечень рецептов`), ['recipeName', 'recipeDescription', 'BaseIngr', 'Ingredients', 'KatalIngr', 'Result'], [item.name, item.description, item.ingrBase, `${item.ingr1}${item.ingr2 == null ? "" : '\n' + item.ingr2}${item.ingr3 == null ? "" : '\n' + item.ingr3}${item.ingr4 == null ? "" : '\n' + item.ingr4}${item.ingr5 == null ? "" : '\n' + item.ingr5}`, item.ingrKatal, item.result]);
                        })
                        return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [6, 7], 2, 2, 2), resize_keyboard: true }) });
                    }
                    if (messageLine === keyTrack[toLocation][7].text) {
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0 WHERE id = ${character.id}`, 221)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Зельеварня/Вход'), ['AvName'], [character.name]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 1, 2, 3, 5, 4], 2, 2, 2), resize_keyboard: true }) });
                    }
                    return bot.sendMessage(chatId, getMyText('Тексты/Зельеварня/Неизвестная команда'), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [6, 7], 2, 2, 2), resize_keyboard: true }) });
                }
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 320)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0 WHERE id = ${character.id}`, 227)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return sendImage('./Кастомные штуки/Картинки/Комната с котлами.jpg', changeMyText(getMyText('Тексты/Зельеварня/Вход'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0, 1, 2, 3, 5, 4], 2, 2, 2))
        }
        case 'Котел': {
            resRows = await askMySQL(bot, pool, `SELECT * FROM characterPots WHERE idCharacter=${character.id} AND idPot =${dopState1}`, 235)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            let kotel = resRows[0];
            if (!resRows[0]) {
                resRows = await askMySQL(bot, pool, `INSERT INTO characterPots (idCharacter, idPot, isBreak) VALUES (${character.id},${dopState1},${dopState1 == 1 ? false : true})`, 236)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                if (!resRows.affectedRows) return bot.sendMessage(chatId, `Не могу добавить котел`);
                kotel = {
                    idCharacter: character.id,
                    idPot: dopState1,
                    ingrBase: null,
                    ingr1: null,
                    ingr2: null,
                    ingr3: null,
                    ingr4: null,
                    ingr5: null,
                    ingrKatal: null,
                    timeToReady: new Date(),
                    isBreak: dopState1 == 1 ? false : true,
                    levelUpgrade: 0
                }
            }
            const find = async (id) => {
                resRows = await askMySQL(bot, pool, `SELECT id, name, element FROM baseIngredients WHERE id = ${kotel.ingrBase} UNION SELECT id, name, element FROM baseIngredients WHERE id = ${kotel.ingr1} UNION SELECT id, name, element FROM baseIngredients WHERE id = ${kotel.ingr2} UNION SELECT id, name, element FROM baseIngredients WHERE id = ${kotel.ingr3} UNION SELECT id, name, element FROM baseIngredients WHERE id = ${kotel.ingr4} UNION SELECT id, name, element FROM baseIngredients WHERE id = ${kotel.ingr5} UNION SELECT id, name, element FROM baseIngredients WHERE id = ${kotel.ingrKatal};`, 237)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                let itog = false;
                resRows.forEach((ingr) => {
                    if (ingr.id == id) itog = ingr;
                })
                return itog;
            }
            const getListIngr = async () => {
                let m = await find(kotel.ingrBase);
                if (m) text = text + '\n' + `Основа: ${m.name} (${m.element})`;
                else text = text + '\n' + `Основа: нет`;
                for (let i = 1; i < 6; i++) {
                    m = await find(kotel[`ingr${i}`]);
                    if (m) text = text + '\n' + `Ингредиент${i}: ${m.name} (${m.element})`;
                    else text = text + '\n' + `Ингредиент${i}: нет`;
                }
                m = await find(kotel[`ingrKatal`]);
                if (m) text = text + '\n' + `Катализатор: ${m.name} (${m.element})`;
                else text = text + '\n' + `Катализатор: нет`;
            }
            const getResult = async () => {
                let resRows = await askMySQL(bot, pool, `SELECT baseRecipes.id as idrecipe, baseRecipes.name as namerecipe, result as id, baseIngredients.name as name, baseIngredients.type as type, baseIngredients.element as element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = result WHERE ingrBase = ${kotel.ingrBase} AND ingr1 = ${kotel.ingr1} AND ingr2 ${kotel.ingr2 === null ? 'is null' : ` = ${kotel.ingr2}`} AND ingr3 ${kotel.ingr3 === null ? 'is null' : ` = ${kotel.ingr3}`} AND ingr4 ${kotel.ingr4 === null ? 'is null' : ` = ${kotel.ingr4}`} AND ingr5 ${kotel.ingr5 === null ? 'is null' : ` = ${kotel.ingr5}`} AND ingrKatal = ${kotel.ingrKatal};`, 238)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                if (!resRows[0]) {
                    text = text + '\n' + getMyText('Тексты/Котел/Неудачная варка');
                    await getListIngr();
                    resRows = await askMySQL(bot, pool, `SELECT * FROM baseIngredients where id = ${constants.PoisonId}`, 239)
                    if (resRows == -1) { await adminsGetError(bot, `Не суествует яда с id = ${constants.PoisonId}`) }
                    if (!resRows[0]) await changeIngredient(constants.PoisonId,1,'+')
                }
                else {
                    const idrecipe = resRows[0].idrecipe;
                    const idResult = resRows[0].id;
                    const namerecipe = resRows[0].namerecipe;
                    text = text + '\n' + changeMyText(getMyText('Тексты/Котел/Удачная варка'), ['ResultName'], [`${resRows[0].name} (${resRows[0].type}, ${resRows[0].element})`]);
                    await getListIngr();
                    resRows = await askMySQL(bot, pool, `SELECT * FROM characterRecipes where idCharacter = ${character.id} AND idRecipe = ${idrecipe}`, 239)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    if (!resRows[0]) {
                        resRows = await askMySQL(bot, pool, `INSERT INTO characterRecipes (idCharacter, idRecipe) VALUES (${character.id}, ${idrecipe});`, 240)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        text = text + '\n' + changeMyText(getMyText('Тексты/Котел/Новый рецепт'), ['namerecipe'], [namerecipe]);
                    }
                    await changeIngredient(idResult, 1, '+');
                }
                resRows = await askMySQL(bot, pool, `UPDATE characterPots SET ingrBase = null, ingr1 = null, ingr2 = null, ingr3 = null, ingr4 = null, ingr5 = null, ingrKatal = null, timeToReady = SYSDATE(), isBreak = false WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 241)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            }
            const brokeKotel = async () => {
                let resRows = await askMySQL(bot, pool, `UPDATE characterPots SET ingrBase = null, ingr1 = null, ingr2 = null, ingr3 = null, ingr4 = null, ingr5 = null, ingrKatal = null, timeToReady = SYSDATE(), isBreak = true WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 242)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 242)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                await bot.sendMessage(chatId, getMyText('Тексты/Котел/Котел ломается'));
                return sendNewLoacation(bot, pool, 'Холл котельни', 'Комната с котлами', 0, 0, 0, chatId, character, 'Идти в зельеварню');
            };
            const getAllIngredientByType = async (type) => {
                let resRows = await askMySQL(bot, pool, `SELECT id, sum,name, element FROM characterIngredients JOIN baseIngredients ON id = idIngredient WHERE sum >0 AND idCharacter = ${character.id} AND type = "${type}"`, 270)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                if (resRows.length === 0) text = changeMyText(getMyText('Тексты/Котел/Нет тип'), ['NameType'], [type]);
                else {
                    text = changeMyText(getMyText('Тексты/Котел/Добавить тип'), ['NameType'], [type]);
                    resRows.forEach((item) => {
                        text = text + '\n' + `${item.name} (${item.element}) - ${item.sum} штук`;
                    })
                }
                return resRows;
            }
            if (fromLocation === toLocation) {
                if (kotel.timeToReady - new Date() <= 0 && kotel.ingrKatal != null) {
                    text = getMyText('Тексты/Котел/Котел сварился');
                    await getResult();
                    keyboard = keyboardConstructor(toLocation, [0, 3, 5, 6], 1, 2, 1);
                    await bot.sendMessage(chatId, text);
                    return bot.sendMessage(chatId, getMyText('Тексты/Котел/Котел пуст'), { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                }
                const createKeboardAddIngr = async (itemList, page = 1) => {
                    let keyboard = [[]];
                    const row = 3;
                    let a = 0, b = 0;
                    if (itemList.length <= row * 3 * (page - 1)) {
                        page = 1;
                        await pool.execute(`UPDATE characters SET dopState3 = 1 WHERE id = ${character.id}`).catch(function (err) { CL("ERROR BD: ", err.message); });
                    };
                    for (let i = row * 3 * (page - 1); i < itemList.length && i < row * 3 * page; i++) {
                        if (a == 3) {
                            keyboard.push([])
                            a = 0;
                            b++;
                        }
                        keyboard[b].push({ text: itemList[i].name })
                        a++;
                    }
                    if (itemList.length <= row * 3) keyboard.push([{ text: 'Отмена' }]);
                    else keyboard.push([{ text: 'Отмена' }, { text: '--->' }]);
                    return keyboard;
                }
                switch (dopState2) {
                    case 0: {
                        switch (messageLine) {
                            case keyTrack[toLocation][0].text: {
                                if (kotel.timeToReady - new Date() > 0) return bot.sendMessage(chatId, "У Вас уже варится зелье");
                                if (kotel.ingrBase != null) return bot.sendMessage(chatId, "У Вас уже есть основа в котле");
                                if (kotel.isBreak) return bot.sendMessage(chatId, "Котел сломан. Нельзя налить в него основу");
                                const itemList = await getAllIngredientByType('основа');
                                if (itemList.length == 0) return bot.sendMessage(chatId, text);
                                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 1, dopState3 = 1 WHERE id = ${character.id}`, 243)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList, 1), resize_keyboard: true }) });
                            }
                            case keyTrack[toLocation][1].text: {
                                if (kotel.timeToReady - new Date() > 0) return bot.sendMessage(chatId, "У Вас уже варится зелье");
                                if (kotel.ingrBase == null) return bot.sendMessage(chatId, "У Вас не еще даже основы");
                                if (kotel.ingr5 != null) return bot.sendMessage(chatId, "У Вас в котле больше нет места под ингредиенты, только для катализатора");
                                if (kotel.isBreak) return bot.sendMessage(chatId, "Котел сломан. Нельзя ничего в него положить");
                                const itemList = await getAllIngredientByType('ингредиент');
                                if (itemList.length == 0) return bot.sendMessage(chatId, text);
                                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 2, dopState3 = 1 WHERE id = ${character.id}`, 244)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList, 1), resize_keyboard: true }) });
                            }
                            case keyTrack[toLocation][2].text: {
                                if (kotel.timeToReady - new Date() > 0) return bot.sendMessage(chatId, "У Вас уже варится зелье");
                                if (kotel.ingrBase == null) return bot.sendMessage(chatId, "У Вас не еще даже основы");
                                if (kotel.ingr1 == null) return bot.sendMessage(chatId, "У Вас в котле нет ни одного ингредиента");
                                if (kotel.isBreak) return bot.sendMessage(chatId, "Котел сломан. Нельзя ничего в него положить");
                                const itemList = await getAllIngredientByType('катализатор');
                                if (itemList.length == 0) return bot.sendMessage(chatId, text);
                                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 3, dopState3 = 1 WHERE id = ${character.id}`, 245)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList, 1), resize_keyboard: true }) });
                            }
                            case keyTrack[toLocation][3].text: {
                                if (kotel.timeToReady - new Date() > 0) return bot.sendMessage(chatId, "У Вас уже варится зелье");
                                if (kotel.isBreak) return bot.sendMessage(chatId, "Котел сломан. Его не надо чистить");
                                if (kotel.ingrBase == null) return bot.sendMessage(chatId, "Котел и так пуст");
                                if (kotel.ingrKatal != null) return bot.sendMessage(chatId, "В котле происходит реакция");
                                resRows = await askMySQL(bot, pool, `UPDATE characterPots SET ingrBase = null, ingr1 = null, ingr2 = null, ingr3 = null, ingr4 = null, ingr5 = null, ingrKatal = null, timeToReady = SYSDATE() WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 246)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Котел/Котел пуст') + (kotel.levelUpgrade >= 4 ? '' : getMyText('Тексты/Котел/Можно улучшить')), ['MoneyToKotelUpgrade', 'TimeToKotel'], [constants.KotelUpgradeSilver * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade), constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (kotel.levelUpgrade >= 4 ? [0, 5, 6] : [0, 5, 7, 6]), 2, 2, 2), resize_keyboard: true }) });
                            }
                            case keyTrack[toLocation][4].text: {
                                if (!kotel.isBreak) return bot.sendMessage(chatId, "Котел цел, его не надо чинить");
                                if (await changeMoney(constants.SilverToKotel * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade), '-') == -1) return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Котел/Не хватает денег на котел'), ['SilverToKotel'], [constants.SilverToKotel * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade)]), { is_persistent: true, resize_keyboard: true });
                                resRows = await askMySQL(bot, pool, `UPDATE characterPots SET ingrBase = null, ingr1 = null, ingr2 = null, ingr3 = null, ingr4 = null, ingr5 = null, ingrKatal = null, timeToReady = SYSDATE(), isBreak = false WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 247)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Котел/Котел чинится') + (kotel.levelUpgrade >= 4 ? '' : getMyText('Тексты/Котел/Можно улучшить')), ['MoneyToKotelUpgrade', 'TimeToKotel'], [constants.KotelUpgradeSilver * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade), constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (kotel.levelUpgrade >= 4 ? [0, 5, 6] : [0, 5, 7, 6]), 2, 2, 2), resize_keyboard: true }) });
                            }
                            case keyTrack[toLocation][5].text: {
                                return bot.sendMessage(chatId, getMyText('Тексты/Котел/Справочник'), { reply_markup: JSON.stringify({ is_persistent: true, resize_keyboard: true }) });
                            }
                            case keyTrack[toLocation][7].text: {
                                if (kotel.isBreak) return bot.sendMessage(chatId, "Котел должен быть целым");
                                if (kotel.ingrBase != null) return bot.sendMessage(chatId, "Котел должен быть пустым");
                                if (kotel.levelUpgrade >= 4) {
                                    resRows = await askMySQL(bot, pool, `UPDATE characterPots SET levelUpgrade = 4 WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 242)
                                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                    return bot.sendMessage(chatId, "Котел уже улучшен до максимума", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 5, 6], 2, 2, 2), resize_keyboard: true }) });
                                }
                                resRows = await askMySQL(bot, pool, `UPDATE characterPots SET levelUpgrade = ${kotel.levelUpgrade + 1} WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 242)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                kotel.levelUpgrade++;
                                return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Котел/Котел улучшен') + '\n' + getMyText('Тексты/Котел/Котел пуст') + (kotel.levelUpgrade >= 4 ? '' : getMyText('Тексты/Котел/Можно улучшить')), ['MoneyToKotelUpgrade', 'TimeToKotel'], [constants.KotelUpgradeSilver * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade), constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (kotel.levelUpgrade >= 4 ? [0, 5, 6] : [0, 5, 7, 6]), 2, 2, 2), resize_keyboard: true }) });
                            }
                            default: {
                                return bot.sendMessage(chatId, getMyText('Тексты/Котел/Непонятна команда'), { reply_markup: JSON.stringify({ is_persistent: true, resize_keyboard: true }) });
                            }
                        }
                        break;
                    }
                    case 1: {
                        const itemList = await getAllIngredientByType('основа');
                        if (messageLine == 'Отмена') return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Котел/Отмена класть') + (kotel.levelUpgrade >= 4 ? '' : getMyText('Тексты/Котел/Можно улучшить')), ['MoneyToKotelUpgrade', 'TimeToKotel'], [constants.KotelUpgradeSilver * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade), constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (kotel.levelUpgrade >= 4 ? [0, 5, 6] : [0, 5, 7, 6]), 2, 2, 2), resize_keyboard: true }) });
                        if (messageLine == '--->') {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState3 = ${dopState3 + 1} WHERE id = ${character.id}`, 248)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            return bot.sendMessage(chatId, "Следующая страница", { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList, dopState3 + 1), resize_keyboard: true }) });
                        }
                        let flag = -1;
                        itemList.forEach((item, index) => {
                            if (messageLine === item.name) flag = index;
                        });
                        if (flag == -1) return bot.sendMessage(chatId, "У Вас этого предмета нет", { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList), resize_keyboard: true }) });
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0 WHERE id = ${character.id}`, 249)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        kotel.ingrBase = itemList[flag].id;
                        resRows = await askMySQL(bot, pool, `UPDATE characterPots SET ingrBase = ${itemList[flag].id} WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 250)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        text = getMyText('Тексты/Котел/Котел не пуст');
                        await changeIngredient(itemList[flag].id, 1, '-');
                        await getListIngr();
                        return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 3, 5, 6], 1, 2, 1), resize_keyboard: true }) });
                    }
                    case 2: {
                        const itemList = await getAllIngredientByType('ингредиент');
                        if (messageLine == 'Отмена') return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Котел/Отмена класть') + (kotel.levelUpgrade >= 4 ? '' : getMyText('Тексты/Котел/Можно улучшить')), ['MoneyToKotelUpgrade', 'TimeToKotel'], [constants.KotelUpgradeSilver * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade), constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (kotel.levelUpgrade >= 4 ? [0, 5, 6] : [1, 5, 7, 6]), 2, 2, 2), resize_keyboard: true }) });
                        if (messageLine == '--->') {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState3 = ${dopState3 + 1} WHERE id = ${character.id}`, 251)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            return bot.sendMessage(chatId, "Следующая страница", { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList, dopState3 + 1), resize_keyboard: true }) });
                        }
                        const ingrNumber = (kotel.ingr1 == null ? 1 : kotel.ingr2 == null ? 2 : kotel.ingr3 == null ? 3 : kotel.ingr4 == null ? 4 : 5);
                        let flag = -1;
                        itemList.forEach((item, index) => {
                            if (messageLine === item.name) flag = index;
                        });
                        if (flag == -1) return bot.sendMessage(chatId, "У Вас этого предмета нет", { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList), resize_keyboard: true }) });
                        const lastIngr = (ingrNumber == 1 ? 'ingrBase' : `ingr${ingrNumber - 1}`);
                        resRows = await askMySQL(bot, pool, `SELECT element FROM baseIngredients where id = ${kotel[lastIngr]}`, 252)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        const raz = Math.abs(getElementNumber(resRows[0].element) - getElementNumber(itemList[flag].element));
                        if (raz == 3 || raz == 0) return brokeKotel();
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0 WHERE id = ${character.id}`, 253)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        kotel[`ingr${ingrNumber}`] = itemList[flag].id;
                        resRows = await askMySQL(bot, pool, `UPDATE characterPots SET ingr${ingrNumber} = ${itemList[flag].id} WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 254)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        await changeIngredient(itemList[flag].id, 1, '-');
                        text = getMyText('Тексты/Котел/Котел не пуст');
                        await getListIngr();
                        return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 2, 3, 5, 6], 2, 2, 1), resize_keyboard: true }) });
                    }
                    case 3: {
                        const itemList = await getAllIngredientByType('катализатор');
                        if (messageLine == 'Отмена') return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Котел/Отмена класть') + (kotel.levelUpgrade >= 4 ? '' : getMyText('Тексты/Котел/Можно улучшить')), ['MoneyToKotelUpgrade', 'TimeToKotel'], [constants.KotelUpgradeSilver * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade), constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (kotel.levelUpgrade >= 4 ? [0, 5, 6] : [2, 5, 7, 6]), 2, 2, 2), resize_keyboard: true }) });
                        if (messageLine == '--->') {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState3 = ${dopState3 + 1} WHERE id = ${character.id}`, 255)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            return bot.sendMessage(chatId, "Следующая страница", { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList, dopState3 + 1), resize_keyboard: true }) });
                        }
                        let flag = -1;
                        itemList.forEach((item, index) => {
                            if (messageLine === item.name) flag = index;
                        });
                        if (flag == -1) return bot.sendMessage(chatId, "У Вас этого предмета нет", { reply_markup: JSON.stringify({ keyboard: await createKeboardAddIngr(itemList), resize_keyboard: true }) });
                        const lastIngr = (kotel.ingr5 != null ? 'ingr5' : kotel.ingr4 != null ? 'ingr4' : kotel.ingr3 != null ? 'ingr3' : kotel.ingr2 != null ? 'ingr2' : 'ingr1');
                        resRows = await askMySQL(bot, pool, `SELECT element FROM baseIngredients where id = ${kotel[lastIngr]}`, 256)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        const raz = Math.abs(getElementNumber(resRows[0].element) - getElementNumber(itemList[flag].element));
                        if (raz == 3 || raz == 0) return brokeKotel();
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0 WHERE id = ${character.id}`, 257)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        kotel.ingrKatal = itemList[flag].id;
                        resRows = await askMySQL(bot, pool, `UPDATE characterPots SET ingrKatal = ${itemList[flag].id}, timeToReady = DATE_ADD(SYSDATE(), INTERVAL ${constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)} MINUTE) WHERE idCharacter = ${character.id} AND idPot = ${dopState1}`, 258)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        await changeIngredient(itemList[flag].id, 1, '-');
                        text = changeMyText(getMyText('Тексты/Котел/Начинает вариться'), ['TimeToCooking'], [constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)]);
                        await getListIngr();
                        return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [6], 1), resize_keyboard: true }) });
                    }
                    default: {
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0 WHERE id = ${character.id}`, 259)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        await bot.sendMessage(chatId, "Вы попали туда, куда не должны были попасть, вернем Вас в комнату с котлами");
                        return sendNewLoacation(bot, pool, 'Холл котельни', 'Комната с котлами', 0, 0, 0, chatId, character, 'Идти в зельеварню');
                    }
                }
            }
            else {
                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 319)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; } let keyboard = {};
                text = changeMyText(getMyText('Тексты/Котел/Вход. Верхушка'), ['AvName', 'KotelName'], [character.name, dopState1]);
                if (kotel.isBreak) {
                    text = text + '\n' + changeMyText(getMyText('Тексты/Котел/Котел сломан'), ['SilverToKotel'], [constants.SilverToKotel * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade)]);
                    keyboard = keyboardConstructor(toLocation, [4, 6], 2);
                }
                else if (kotel.ingrKatal != null) {
                    if (kotel.timeToReady - new Date() > 0) {
                        text = changeMyText(text + '\n' + getMyText('Тексты/Котел/Котел варится'), ['TimeToZelie'], [(kotel.timeToReady - new Date()) / (60000)]);
                        await getListIngr();
                        keyboard = keyboardConstructor(toLocation, [6], 1);
                    }
                    else {
                        text = text + '\n' + getMyText('Тексты/Котел/Котел сварился');
                        await getResult();
                        keyboard = keyboardConstructor(toLocation, [0, 3, 5, 6], 1, 2, 1);
                        await sendImage('./Кастомные штуки/Картинки/Котел.jpg', text)
                        return bot.sendMessage(chatId, getMyText('Тексты/Котел/Котел пуст'), { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                    }
                }
                else if (kotel.ingrBase != null) {
                    text = text + '\n' + getMyText('Тексты/Котел/Котел не пуст');
                    await getListIngr();
                    if (kotel.ingr1 == null) keyboard = keyboardConstructor(toLocation, [1, 3, 5, 6], 1, 2, 1);
                    else if (kotel.ingr5 == null) keyboard = keyboardConstructor(toLocation, [1, 2, 3, 5, 6], 2, 2, 1);
                    else keyboard = keyboardConstructor(toLocation, [2, 3, 5, 6], 1, 2, 1);
                }
                else {
                    text = text + '\n' + changeMyText(getMyText('Тексты/Котел/Котел пуст') + '\n' + (kotel.levelUpgrade >= 4 ? '' : getMyText('Тексты/Котел/Можно улучшить')), ['MoneyToKotelUpgrade', 'TimeToKotel'], [constants.KotelUpgradeSilver * Math.pow(constants.KotelUpgradeKof, kotel.levelUpgrade), constants.TimeToCooking / Math.pow(constants.СookingKof, kotel.levelUpgrade)]);
                    keyboard = keyboardConstructor(toLocation, (kotel.levelUpgrade >= 4 ? [0, 5, 6] : [0, 5, 7, 6]), 2, 2, 2);
                }
                return sendImage('./Кастомные штуки/Картинки/Котел.jpg', text, keyboard);
            }
            break;
        }
        case 'Гильдия': {
            if (toLocation === fromLocation) {
                switch (messageLine) {
                    case keyTrack[toLocation][0].text:
                        const rangBonus = constants.Rang[character.rang].bonus;
                        const livingBonus = constants.Living[character.living].bonus;
                        text = changeMyText(getMyText('Тексты/Гильдия/О себе'), ['AvName', 'RangName', 'LivingName', 'UserdieNum'], [character.name, `${constants.Rang[character.rang].name}(${rangBonus > 0 ? '+' + rangBonus : rangBonus})`, `${constants.Living[character.living].name}(${livingBonus > 0 ? '+' + livingBonus : livingBonus})`, (livingBonus + rangBonus) > 0 ? '+' + (livingBonus + rangBonus) : livingBonus + rangBonus]);
                        const items = constants.MasObjHealfZelii;
                        for (let i = 0; i < items.length; i++) {
                            resRows = await askMySQL(bot, pool, `SELECT (SELECT name FROM baseIngredients where id = ${items[i].id}) as name, (SELECT sum FROM characterIngredients WHERE idIngredient = ${items[i].id} AND idCharacter = ${character.id}) as sum`, 282)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            if (resRows.length != 0) text = text + '\n' + changeMyText(getMyText('Тексты/Гильдия/О себе. Зелье'), ['ZelieName', 'ZelieSum'], [resRows[0].name, resRows[0].sum == null ? 0 : resRows[0].sum]);
                        }
                        return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 1, 2, 3], 2, 2, 2), resize_keyboard: true }) });
                }
                return bot.sendMessage(chatId, getMyText('Тексты/Зельеварня/Неизвестная команда'), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 1, 2, 3], 2, 2, 2), resize_keyboard: true }) });
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 305)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return sendImage('./Кастомные штуки/Картинки/welk.jpg', changeMyText(getMyText('Тексты/Гильдия/Вход'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0, 1, 2, 3], 2, 2, 2))
        }
        case 'Торговая лавка гильдии': {
            if (toLocation === fromLocation) {
                const num = Number(messageLine);
                if (isNaN(num)) {
                    await bot.sendMessage(chatId, getMyText('Тексты/Гильдия/Зелье/Неправильное число'));
                    return sendNewLoacation(bot, pool, "Торговая лавка гильдии", "Гильдия", dopState1, dopState2, dopState3, chatId, character, messageLine);
                }
                resRows = await askMySQL(bot, pool, `SELECT cost from baseIngredients where id = ${constants.MasObjHealfZelii[0].id}`, 283)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                if (!resRows[0]) {
                    await bot.sendMessage(chatId, `К сожалению, у нас произошло чп`);
                    return sendNewLoacation(bot, pool, "Торговая лавка гильдии", "Гильдия", dopState1, dopState2, dopState3, chatId, character, messageLine);
                }
                const cost = resRows[0].cost * num;
                const a = await changeMoney(cost, '-')
                if (a == -1) {
                    await bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Гильдия/Зелье/Не хватает денег'), ['Money'], [cost]));
                    return sendNewLoacation(bot, pool, "Торговая лавка гильдии", "Гильдия", dopState1, dopState2, dopState3, chatId, character, messageLine);
                }
                else {
                    await bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Гильдия/Зелье/Успешно заплатил'), ['Money', 'SumZelii'], [cost, num]));
                    await changeIngredient(constants.MasObjHealfZelii[0].id, num, '+');
                    return sendNewLoacation(bot, pool, "Торговая лавка гильдии", "Гильдия", dopState1, dopState2, dopState3, chatId, character, messageLine);
                }
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 317)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            resRows = await askMySQL(bot, pool, `SELECT cost, name from baseIngredients where id = ${constants.MasObjHealfZelii[0].id}`, 284)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            if (!resRows[0]) return bot.sendMessage(chatId, `К сожалению, у нас произошло чп`, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 1, 2, 3], 2, 2, 2), resize_keyboard: true }) });
            return sendImage('./Кастомные штуки/Картинки/Торговая лавка гильдии.jpg', changeMyText(getMyText('Тексты/Гильдия/Зелье/Продажа зелий'), ['CostZelia', 'nameZelia'], [resRows[0].cost, resRows[0].name]), [[{ text: 1 }, { text: 2 }, { text: 5 }], [{ text: 10 }, { text: 15 }, { text: 20 }], [{ text: 35 }, { text: 50 }, { text: 'Отмена' }]])
        }
        case 'Доска заданий': {
            const generateQuests = async () => {
                let resRows = await askMySQL(bot, pool, `SELECT * from quests where (dateStart = CURDATE() AND customMake is not null) OR (customMake is null)`, 286)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                const nowQuests = resRows.length;
                if (nowQuests < constants.NumQuestsGenerate) {
                    const fileNames = [];
                    try {
                        for (const item of fs.readdirSync('./Кастомные штуки/Генератор квестов/Текста')) if (fs.lstatSync(`./Кастомные штуки/Генератор квестов/Текста/${item}`).isFile()) fileNames.push(item)
                    } catch (err) {
                        await adminsGetError(bot, "Не могу прочесть папку с генератором квестов" + err.message)
                    }
                    if (fileNames.length == 0) return bot.sendMessage(chatId, "Мы не можем выдать квесты сейчас, у нас нехнические работы");
                    for (let i = 0; i < constants.NumQuestsGenerate - nowQuests; i++) {
                        const textForChange = [], textToChange = [];
                        for (let set of Object.keys(variables.TextVariables)) {
                            textForChange.push(set);
                            textToChange.push(variables.TextVariables[set][Math.floor(Math.random() * variables.TextVariables[set].length)]);
                        }
                        let rangSum = 0;
                        const rangWeight = [];
                        let rangKolvo = -1;
                        for (let rangNum of Object.keys(constants.Rang)) {
                            rangWeight.push({ num: rangNum, weight: variables.Rang[rangNum].weight });
                            rangKolvo++;
                            if (rangWeight[rangKolvo].weight) rangSum += rangWeight[rangKolvo].weight;
                            else {
                                rangSum += 1;
                                rangWeight[rangKolvo].weight = 1;
                            }
                        }
                        let rang = Math.floor(Math.random() * rangSum) + 1;
                        rangSum = 0;
                        for (let i = 0; i < rangWeight.length; i++) {
                            rangSum += rangWeight[i].weight;
                            if (rangSum >= rang) {
                                rang = rangWeight[i].num;
                                break;
                            }
                        }
                        const days = Math.floor(Math.random() * (variables.MaxDayQuest - variables.MinDayQuest + 1)) + (variables.MinDayQuest);
                        let itemRevord = false, recipeRevord = false, relicvRevord = false;
                        if (rang != 0) {
                            if (Math.random() * 100 < variables.ChanseToItem) itemRevord = true;
                            else if (Math.random() * 100 < variables.ChanseTorecipe) recipeRevord = true;
                            else if (Math.random() * 100 < variables.ChanseToRelicv) relicvRevord = true;
                        }
                        resRows = await askMySQL(bot, pool, `INSERT INTO quests (text, dayToComplite, rang, coinsRevord, xpRevord, itemRevord, recipeRevord, relicvRevord) VALUES ("${changeMyText(getMyText(`Генератор квестов/Текста/${fileNames[Math.floor(Math.random() * fileNames.length)]}`, false), textForChange, textToChange)}", ${days}, ${rang}, ${constants.Rang[rang].money * days}, ${constants.Rang[rang].xp * days}, ${itemRevord ? variables.Rang[rang].items[Math.floor(Math.random() * variables.Rang[rang].items.length)] : "null"}, ${recipeRevord ? variables.recipes[Math.floor(Math.random() * variables.recipes.length)] : "null"}, ${relicvRevord})`, 288)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    }
                }
            }
            await generateQuests();
            if (toLocation === fromLocation) {
                switch (messageLine) {
                    case keyTrack[toLocation][1].text: {
                        let itog = await getQuests(dopState1, 1, 'allFreeAndTodayNotFree');
                        if (itog == -1) return bot.sendMessage(chatId, "На доске нет заданий");
                        if (itog == -2) { // Нет этого задания
                            itog = await getQuests(-1, 0, 'allFreeAndTodayNotFree');
                            if (itog == -1) return bot.sendMessage(chatId, "На доске нет заданий");
                        }
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = ${itog.id} WHERE id = ${character.id}`, 285)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        text = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [itog.id, itog.text, constants.Rang[itog.rang].name, itog.dayToComplite, itog.coinsRevord, itog.xpRevord, (itog.itemRevord != null ? itog.itemName : itog.recipeRevord != null ? `рецепт ${itog.recipeName}` : itog.relicvRevord ? 'необычный предмет' : 'нет'), (itog.customMake != null ? `Это задание выполняет ${itog.customName}` : "")]);
                        return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (itog.customMake ? [3, 1, 2] : [0, 3, 1, 2]), (itog.customMake ? 2 : 1), 2, 2), resize_keyboard: true }) });
                    }
                    case keyTrack[toLocation][3].text: {
                        let itog = await getQuests(dopState1, -1, 'allFreeAndTodayNotFree');
                        if (itog == -1) return bot.sendMessage(chatId, "На доске нет заданий");
                        if (itog == -2) { // Нет этого задания
                            itog = await getQuests(-1, 0, 'allFreeAndTodayNotFree');
                            if (itog == -1) return bot.sendMessage(chatId, "На доске нет заданий");
                        }
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = ${itog.id} WHERE id = ${character.id}`, 285)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        text = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [itog.id, itog.text, constants.Rang[itog.rang].name, itog.dayToComplite, itog.coinsRevord, itog.xpRevord, (itog.itemRevord != null ? itog.itemName : itog.recipeRevord != null ? `рецепт ${itog.recipeName}` : itog.relicvRevord ? 'необычный предмет' : 'нет'), (itog.customMake != null ? `Это задание выполняет ${itog.customName}` : "")]);
                        return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (itog.customMake ? [3, 1, 2] : [0, 3, 1, 2]), (itog.customMake ? 2 : 1), 2, 2), resize_keyboard: true }) });
                    }
                    default:
                        let itog = await getQuests(dopState1, 0, 'allFreeAndTodayNotFree');
                        if (itog == -1) return bot.sendMessage(chatId, "На доске нет заданий");
                        if (itog == -2) return bot.sendMessage(chatId, "На доске нет этого задания");
                        return bot.sendMessage(chatId, getMyText('Тексты/Гильдия/Доска/Непонятная команда'), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (itog.customMake ? [3, 1, 2] : [0, 3, 1, 2]), (itog.customMake ? 2 : 1), 2, 2), resize_keyboard: true }) });
                        break;
                }
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 316)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            const itog = await getQuests(-1, 0, 'allFreeAndTodayNotFree');
            if (itog == -1) return bot.sendMessage(chatId, "На доске нет заданий");
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = ${itog.id} WHERE id = ${character.id}`, 286)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            text = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [itog.id, itog.text, constants.Rang[itog.rang].name, itog.dayToComplite, itog.coinsRevord, itog.xpRevord, (itog.itemRevord != null ? itog.itemName : itog.recipeRevord != null ? `рецепт ${itog.recipeName}` : itog.relicvRevord ? 'необычный предмет' : 'нет'), (itog.customMake != null ? `Это задание выполняет ${itog.customName}` : "")]);
            return bot.sendMessage(chatId, text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, (itog.customMake ? [3, 1, 2] : [0, 3, 1, 2]), (itog.customMake ? 2 : 1), 2, 2), resize_keyboard: true }) });
        }
        case 'Задание': {
            const quest = await getQuests(dopState1, 0, 'none');
            if (quest == -1 || quest == -2) {
                await bot.sendMessage(chatId, "В бд нет этого задания\nБез раздумий снимаем Вас с него и отправляем в гильдию");
                return sendNewLoacation(bot, pool, toLocation, "Гильдия", dopState1, dopState2, dopState3, chatId, character, "Вернули в гильдию");
            }
            if (quest.stat == constants.Deaf) {
                resRows = await askMySQL(bot, pool, `UPDATE users SET activeCharacter = null where id = ${chatId}`, 287)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                await bot.sendMessage(chatId, `Ты погиб, больше тебе ничего не доступно`);
                return choiseCharacter(bot, pool, chatId);
            }
            if (quest.stat == constants.Sucsess) {
                await bot.sendMessage(chatId, "Ты уже успешно завершил это задание");
                return sendNewLoacation(bot, pool, toLocation, "Гильдия", dopState1, dopState2, dopState3, chatId, character, "Вернули в гильдию");
            }
            if (quest.stat == constants.RunSucsess) {
                await bot.sendMessage(chatId, "Ты уже успешно сбежал с этого задания");
                return sendNewLoacation(bot, pool, toLocation, "Гильдия", dopState1, dopState2, dopState3, chatId, character, "Вернули в гильдию");
            }
            if (quest.stat == 0) {
                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0 WHERE id = ${character.id}`, 290)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            }
            if (toLocation === fromLocation || fromLocation == 'Загрузка') {
                const hardQuest = constants.Rang[quest.rang].hard;
                const levelRazBonus = ((character.rang >= quest.rang) ? 1 : 2) * (quest.rang - character.rang);
                const userdieBonus = constants.Rang[character.rang].bonus + constants.Living[character.living].bonus;
                const items = [];
                let messageLineIsZelieName = -1;
                for (let zelie of constants.MasObjHealfZelii) {
                    resRows = await askMySQL(bot, pool, `SELECT (SELECT name FROM baseIngredients where id = ${zelie.id}) as name, (SELECT sum FROM characterIngredients WHERE idIngredient = ${zelie.id} AND idCharacter = ${character.id}) as sum`, 289)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    if (!resRows[0].name) await sendErrorAdmin(`Id зелья здоровья ${zelie.id} не существует`)
                    else {
                        items.push({
                            kolvoZdor: zelie.kolvoZdor,
                            id: zelie.id,
                            sum: resRows[0].sum == null ? 0 : resRows[0].sum,
                            name: resRows[0].name
                        });
                        if (messageLine === resRows[0].name) {
                            messageLineIsZelieName = items.length - 1;
                            items[messageLineIsZelieName].sum--;
                        }
                    }
                }
                let zelia = '';
                const keyboard = [];
                let a = 2, b = -1;
                for (let zel of items) {
                    zelia += `${zel.name} ${zel.sum} штук (считается за ${zel.kolvoZdor})\n`;
                    if (a >= 2) {
                        a = 0;
                        b++;
                        keyboard.push([])
                    }
                    a++;
                    keyboard[b].push({ text: zel.name })
                }
                keyboard.push([{ text: keyTrack[toLocation][2].text }, { text: keyTrack[toLocation][4].text }, { text: keyTrack[toLocation][3].text }])
                const figth = async (dice) => {
                    text += `\nСложность броска ${hardQuest + levelRazBonus + dopState2}`;
                    if (dice + userdieBonus >= hardQuest + levelRazBonus + dopState2) {
                        //Успешное завершение задания
                        resRows = await askMySQL(bot, pool, `UPDATE quests SET stat = ${constants.Sucsess} WHERE id = ${quest.id}`, 295)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        await bot.sendMessage(chatId, text + '\n' + changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Успешно выполнил`), ['QuestId', 'RangName', 'CoinsRevord', 'XPRevord', 'DopRevord'], [quest.id, constants.Rang[quest.rang].name, quest.coinsRevord, quest.xpRevord, (quest.itemRevord != null ? quest.itemName : quest.recipeRevord != null ? `рецепт ${quest.recipeName}` : quest.relicvRevord ? 'необычный предмет' : 'не дадут')]));
                        await changeMoney(quest.coinsRevord, '+');
                        if (quest.itemRevord != null) await changeIngredient(quest.itemRevord, 1, '+');
                        if (quest.recipeRevord != null) {
                            resRows = await askMySQL(bot, pool, `INSERT INTO characterRecipes (idCharacter, idRecipe) VALUES (${character.id}, ${zelia.id})`, 296)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        }
                        await adminsGetMessage(bot, `Персонаж ${character.name} выполнил задание №${quest.id}:\nРанг задания ${constants.Rang[quest.rang].name}\nПолучено денег ${quest.coinsRevord}\nПолучено опыта ${quest.xpRevord}\n${(quest.itemRevord != null ? `Дали дополнительно ингредиент ${quest.itemName}` : quest.recipeRevord != null ? `Дали дополнительно рецепт ${quest.recipeName}` : quest.relicvRevord ? '\nНЕОБХОДИМО ВЫДАТЬ НЕОБЫЧНЫЙ ПРЕДМЕТ' : '')}`);
                        return sendNewLoacation(bot, pool, toLocation, "Гильдия", dopState1, dopState2, dopState3, chatId, character, "Вернули в гильдию");
                    } else {
                        //Проверка провалена
                        switch (quest.stat) {
                            //Переходим в побег
                            case constants.FinalCheck: {
                                resRows = await askMySQL(bot, pool, `UPDATE quests SET stat = ${constants.RunCheck} WHERE id = ${quest.id}`, 297)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                return bot.sendMessage(chatId, text + '\n' + changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Неудачная финальная проверка`), ['RollHard'], [constants.Rang[quest.rang].run + levelRazBonus]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [3], 2, 2, 2), resize_keyboard: true }) });
                                break;
                            }
                            default: {
                                resRows = await askMySQL(bot, pool, `UPDATE quests SET stat = 2 WHERE id = ${quest.id}`, 298)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = ${dopState2 + 1} WHERE id = ${character.id}`, 299)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                return bot.sendMessage(chatId, text + '\n' + changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Неудачная обычная проверка`), ['RollHard', 'Zelia', 'KolvoZelii', 'Userdie'], [hardQuest + levelRazBonus + dopState2 + 1, zelia, constants.Rang[quest.rang].zelie, userdieBonus]), { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                                break;
                            }
                        }
                    }
                }
                switch (messageLine) {
                    //Отмена
                    case keyTrack[toLocation][0].text: {
                        if (quest.dateStart.getDate() == (new Date).getDate() && quest.dateStart.getMonth() == (new Date).getMonth() && quest.dateStart.getFullYear() == (new Date).getFullYear()) {
                            resRows = await askMySQL(bot, pool, `UPDATE quests SET customMake = null, stat = 0 WHERE id = ${quest.id}`, 300)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            await bot.sendMessage(chatId, getMyText(`Тексты/Гильдия/Выполнение задания/Отменяем задание`));
                            await adminsGetMessage(bot, `Персонаж ${character.name} отменил задание ${dopState1}`);
                            return sendNewLoacation(bot, pool, toLocation, "Гильдия", dopState1, dopState2, dopState3, chatId, character, "Вернули в гильдию");
                        }
                        await bot.sendMessage(chatId, getMyText(`Тексты/Гильдия/Выполнение задания/Не можем отменить задание`));
                    }
                    //Обновление
                    case 'Загрузка':
                    case keyTrack[toLocation][1].text: {
                        switch (quest.stat) {
                            case 0: {
                                const endDate = new Date(quest.dateStart);
                                endDate.setDate(endDate.getDate() + quest.dayToComplite);
                                if (endDate - (new Date) <= 0) {
                                    resRows = await askMySQL(bot, pool, `UPDATE quests SET stat = 1 WHERE id = ${quest.id}`, 301)
                                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                    return bot.sendMessage(chatId, changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Добрался до роллов`), ['HardQuest', 'Userdie'], [hardQuest + levelRazBonus, userdieBonus]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [2], 2, 2, 2), resize_keyboard: true }) });
                                }
                                return bot.sendMessage(chatId, changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Взял задание`), ['QuestId', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'DateTake', 'DayComplite'], [quest.id, constants.Rang[quest.rang].name, quest.dayToComplite, quest.coinsRevord, quest.xpRevord, (quest.itemRevord != null ? quest.itemName : quest.recipeRevord != null ? `рецепт ${quest.recipeName}` : quest.relicvRevord ? 'необычный предмет' : 'не дадут'), `${quest.dateStart.getDate()}-${(quest.dateStart.getMonth() + 1)}-${quest.dateStart.getFullYear()}`, `${endDate.getDate()}-${(endDate.getMonth() + 1)}-${endDate.getFullYear()}`]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 0], 2, 2, 2), resize_keyboard: true }) });
                            }
                            case 1: {
                                return bot.sendMessage(chatId, changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Добрался до роллов`), ['HardQuest', 'Userdie'], [hardQuest + levelRazBonus, userdieBonus]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [2], 2, 2, 2), resize_keyboard: true }) });
                            }
                            case 2: {
                                let zelia = '';
                                for (let zel of items) {
                                    zelia += `${zel.name} ${zel.sum} штук (считается за ${zel.kolvoZdor})\n`
                                }
                                return bot.sendMessage(chatId, changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Неудачная обычная проверка`), ['RollHard', 'Zelia'], [hardQuest + levelRazBonus + dopState2 + 1, zelia]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [2, 3], 2, 2, 2), resize_keyboard: true }) });
                            }
                            case constants.FinalCheck: {
                                return bot.sendMessage(chatId, 'Бросай последнюю проверку', { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [4], 2, 2, 2), resize_keyboard: true }) });
                                //Делаем последнюю проверку, это когда не хватает зелий
                                return 0;
                                break;
                            }
                            case constants.RunCheck: {
                                return bot.sendMessage(chatId, changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Неудачная финальная проверка`), ['RollHard'], [constants.Rang[quest.rang].run + levelRazBonus]), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [3], 2, 2, 2), resize_keyboard: true }) });
                                break;
                            }
                            default:
                                break;
                        }
                        break;
                    }
                    //В атаку
                    case keyTrack[toLocation][2].text: {
                        switch (quest.stat) {
                            case constants.FinalCheck:
                            case constants.RunCheck:
                            case 0: {
                                return bot.sendMessage(chatId, "Ты не можешь атаковать из этого состояния")
                                break;
                            }
                            case 2: {
                                if (dopState3 < constants.Rang[quest.rang].zelie)
                                    return bot.sendMessage(chatId, "У Вас недостаточно зелий выпито");
                            }
                            case 1: {
                                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState3 = 0 WHERE id = ${character.id}`, 390)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                const dice = Math.ceil(Math.random() * 20);
                                text = `Ваш бросок ${dice}\n\n${dice} ${userdieBonus > 0 ? `+ ${userdieBonus}` : `- ${Math.abs(userdieBonus)}`} = ${dice + userdieBonus}`;
                                //Обрабатываем бросок 
                                return figth(dice);
                            }
                        }
                    }
                    //Сбежать
                    case keyTrack[toLocation][3].text: {
                        switch (quest.stat) {
                            case constants.FinalCheck:
                            case 0:
                            case 1: {
                                return bot.sendMessage(chatId, "Ты не можешь сбежать из этого состояния")
                                break;
                            }
                            case constants.RunCheck:
                            case 2: {
                                resRows = await askMySQL(bot, pool, `UPDATE quests SET stat = ${constants.RunCheck} WHERE id = ${quest.id}`, 302)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                quest.stat = constants.RunCheck;
                                const dice = Math.ceil(Math.random() * 20);
                                text = `Ваш бросок ${dice}\n\n${dice} ${userdieBonus > 0 ? `+ ${userdieBonus}` : `- ${Math.abs(userdieBonus)}`} = ${dice + userdieBonus}\nСложность броска ${constants.Rang[quest.rang].run + levelRazBonus}`;
                                if (dice + userdieBonus >= constants.Rang[quest.rang].run + levelRazBonus) {
                                    //Успешный побег
                                    resRows = await askMySQL(bot, pool, `UPDATE quests SET stat = ${constants.RunSucsess} WHERE id = ${quest.id}`, 291)
                                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                    await bot.sendMessage(chatId, text + '\n' + getMyText(`Тексты/Гильдия/Выполнение задания/Успешно убежал`));
                                    return sendNewLoacation(bot, pool, toLocation, "Гильдия", dopState1, dopState2, dopState3, chatId, character, "Вернули в гильдию");
                                } else {
                                    //Смерть
                                    resRows = await askMySQL(bot, pool, `UPDATE quests SET stat = ${constants.Deaf} WHERE id = ${quest.id}`, 292)
                                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                    await bot.sendMessage(chatId, text + '\n' + changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Смерть`), ['QuestId', 'RangName'], [quest.id, constants.Rang[quest.rang].name]), { reply_markup: JSON.stringify({ remove_keyboard: true }) });
                                    resRows = await askMySQL(bot, pool, `UPDATE characters SET host = 0 WHERE id = ${character.id}`, 293)
                                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                    resRows = await askMySQL(bot, pool, `UPDATE users SET activeCharacter = null WHERE id = ${chatId}`, 294)
                                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                    await adminsGetMessage(bot, `Персонаж ${character.name} Погиб на задании\n` + changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Смерть`), ['QuestId', 'RangName', 'CoinsRevord', 'XPRevord', 'DopRevord'], [quest.id, constants.Rang[quest.rang].name, quest.coinsRevord, quest.xpRevord, (quest.itemRevord != null ? quest.itemName : quest.recipeRevord != null ? `рецепт ${quest.recipeName}` : quest.relicvRevord ? 'необычный предмет' : 'не дадут')]));
                                    return choiseCharacter(bot, pool, chatId)
                                }
                            }
                        }
                    }
                    //Попытаться из последних сил
                    case keyTrack[toLocation][4].text: {
                        switch (quest.stat) {
                            case constants.RunCheck:
                            case 0:
                            case 1: {
                                return bot.sendMessage(chatId, "Ты не можешь попытаться из последних сил из этого состояния")
                                break;
                            }
                            case constants.FinalCheck:
                            case 2: {
                                resRows = await askMySQL(bot, pool, `UPDATE quests SET stat = ${constants.FinalCheck} WHERE id = ${quest.id}`, 302)
                                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                quest.stat = constants.FinalCheck;
                                const dice = Math.ceil(Math.random() * 20);
                                text = `Ваш бросок ${dice}\n\n${dice} ${userdieBonus > 0 ? `+ ${userdieBonus}` : `- ${Math.abs(userdieBonus)}`} = ${dice + userdieBonus}`;
                                //Обрабатываем бросок
                                return figth(dice);
                            }
                        }
                    }
                    default: {
                        if (messageLineIsZelieName != -1) {
                            switch (quest.stat) {
                                case constants.FinalCheck:
                                case constants.RunCheck:
                                case 0:
                                case 1: {
                                    return bot.sendMessage(chatId, "Ты не можешь выпить зелье из этого состояния")
                                    break;
                                }
                                case 2: {
                                    if (items[messageLineIsZelieName].sum < 0)
                                        return bot.sendMessage(chatId, `У Вас нет ${items[messageLineIsZelieName].name}`)
                                    resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState3 = ${dopState3 + items[messageLineIsZelieName].kolvoZdor} WHERE id = ${character.id}`, 390)
                                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                    resRows = await askMySQL(bot, pool, `UPDATE characterIngredients SET sum = ${items[messageLineIsZelieName].sum} WHERE idIngredient = ${items[messageLineIsZelieName].id} AND idCharacter = ${character.id}`, 289)
                                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                                    return bot.sendMessage(chatId, text + '\n' + changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Выпил зелье`), ['RollHard', 'Zelia', 'KolvoZelii', 'Userdie', 'ThisZelie'], [hardQuest + levelRazBonus + dopState2, zelia, constants.Rang[quest.rang].zelie - dopState3 - items[messageLineIsZelieName].kolvoZdor <= 0 ? '(Хватит бухать уже!!!)' : constants.Rang[quest.rang].zelie - dopState3 - items[messageLineIsZelieName].kolvoZdor, userdieBonus, items[messageLineIsZelieName].name, userdieBonus, items[messageLineIsZelieName].name]), { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                                }
                            }
                        }
                        return bot.sendMessage(chatId, getMyText('Тексты/Гильдия/Выполнение задания/Непонятная команда'), { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 0], 2, 2, 2), resize_keyboard: true }) });
                    }
                }
            } else {
                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 315)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                if (quest.customMake != null) {
                    await bot.sendMessage(chatId, changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Вас опередили`), ['CustomName'], [quest.customName]));
                    return sendNewLoacation(bot, pool, toLocation, "Гильдия", dopState1, dopState2, dopState3, chatId, character, "Вернули в гильдию");
                } else {
                    //Ставим выполнение задания
                    resRows = await askMySQL(bot, pool, `UPDATE quests SET customMake = ${character.id}, dateStart = CURDATE() WHERE id = ${quest.id}`, 303)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    quest.dateStart = new Date();
                    const endDate = new Date(quest.dateStart);
                    endDate.setDate(endDate.getDate() + quest.dayToComplite)
                    const t = changeMyText(getMyText(`Тексты/Гильдия/Выполнение задания/Взял задание`), ['QuestId', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'DateTake', 'DayComplite'], [quest.id, constants.Rang[quest.rang].name, quest.dayToComplite, quest.coinsRevord, quest.xpRevord, (quest.itemRevord != null ? quest.itemName : quest.recipeRevord != null ? `рецепт ${quest.recipeName}` : quest.relicvRevord ? 'необычный предмет' : 'не дадут'), `${quest.dateStart.getDate()}-${(quest.dateStart.getMonth() + 1)}-${quest.dateStart.getFullYear()}`, `${endDate.getDate()}-${(endDate.getMonth() + 1)}-${endDate.getFullYear()}`]);
                    await adminsGetMessage(bot, `Персонаж ${character.name} начал выполнение задания\n${t}`);
                    return bot.sendMessage(chatId, t, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 0], 2, 2, 2), resize_keyboard: true }) });
                }
            }
            break;
        }
        case 'Рыночная площадь': {
            if (toLocation === fromLocation) {
                return bot.sendMessage(chatId, "Неизвестная команда", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 1, 3], 2, 2, 2), resize_keyboard: true }) });
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 314)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return sendImage('./Кастомные штуки/Картинки/Рыночная площадь.jpg', changeMyText(getMyText('Тексты/Рынок/Рыночная площадь'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0, 1, 3], 2, 2, 2))
        }
        case 'Продажа': {
            if (toLocation === fromLocation) {
                const keyboard = [];
                const getKeyboardSell = async (itog) => {
                    if (itog == -1) return bot.sendMessage(chatId, "В ваших сундуках ничего нет, Вам нечего продавать", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [2], 2, 2, 2), resize_keyboard: true }) });
                    text = '';
                    let a = 3, b = -1;
                    for (let item of itog.res) {
                        if (item.sum < 1) continue;
                        if (a >= 3) {
                            a = 0;
                            b++;
                            keyboard.push([]);
                        }
                        keyboard[b].push({ text: `Продать ${item.name}` })
                        a++;
                        text += `${item.name} - ${Math.floor(item.cost / constants.SellKof)} серебра (${item.sum} штук)\n`;
                    }
                    keyboard.push([{ text: keyTrack[toLocation][1].text }, { text: keyTrack[toLocation][2].text }])
                    resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = ${itog.page} WHERE id = ${character.id}`, 307)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    return bot.sendMessage(chatId, `В вашем сундуке №${itog.page}:\n${text}`, { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                }
                if (keyTrack[toLocation][1].text == messageLine || keyTrack[toLocation][0].text == messageLine) {
                    const itog = await getInventory(9, dopState1 + 1);
                    return getKeyboardSell(itog);
                }
                if (messageLine.split(' ')[0] == 'Продать') {
                    const myItem = messageLine.split(' ').slice(1).join(' ');
                    let resRows = await askMySQL(bot, pool, `SELECT id, name, type, element, sum, cost, market FROM characterIngredients JOIN baseIngredients ON id = idIngredient where idCharacter = ${character.id} AND name = "${myItem}"`, 220)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    if (resRows.length < 1 || resRows[0].sum < 1) await bot.sendMessage(chatId, `Вы не можете продать этот предмет, потому что у Вас его нет в инвенторе`);
                    else {
                        if (await changeMoney(Math.floor(resRows[0].cost / constants.SellKof), '+') == -1) await bot.sendMessage(chatId, `Не могу добавить Вам денег почему-то :(`);;
                        if (await changeIngredient(resRows[0].id, 1, '-') == -1) await bot.sendMessage(chatId, `Не могу забрать у Вас предмет почему-то :(`);
                        await bot.sendMessage(chatId, `Вы продали 1 предмет ${resRows[0].name}`);
                        resRows = await askMySQL(bot, pool, `UPDATE baseIngredients SET market = ${resRows[0].market + 1} WHERE id = ${resRows[0].id}`, 307)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    }
                    const itog = await getInventory(9, dopState1);
                    return getKeyboardSell(itog);
                }
                return bot.sendMessage(chatId, "Неизвестная команда", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 2], 2, 2, 2), resize_keyboard: true }) });
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 307)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return sendImage('./Кастомные штуки/Картинки/Рынок.jpg', changeMyText(getMyText('Тексты/Рынок/Продать'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0, 2], 2, 2, 2))
        }
        case 'Покупка': {
            if (toLocation === fromLocation) {
                const keyboard = [];
                const getKeyboardSell = async (itog) => {
                    if (itog == -1) return bot.sendMessage(chatId, "Дварф в ужасе глядит на свои прилавки: Наш рынок пуст! Мне нечего тебе продать :(", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [2], 2, 2, 2), resize_keyboard: true }) });
                    text = '';
                    let a = 3, b = -1;
                    for (let item of itog.res) {
                        if (item.sum < 1) continue;
                        if (a >= 3) {
                            a = 0;
                            b++;
                            keyboard.push([]);
                        }
                        keyboard[b].push({ text: `Купить ${item.name}` })
                        a++;
                        text += `${item.name} - ${item.cost} серебра (${item.market} штук)\n`;
                    }
                    keyboard.push([{ text: keyTrack[toLocation][1].text }, { text: keyTrack[toLocation][2].text }])
                    resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = ${itog.page} WHERE id = ${character.id}`, 307)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    return bot.sendMessage(chatId, `На прилавке №${itog.page}:\n${text}`, { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                }
                if (keyTrack[toLocation][1].text == messageLine || keyTrack[toLocation][0].text == messageLine) {
                    const itog = await getInventory(9, dopState1 + 1, 1);
                    return getKeyboardSell(itog);
                }
                if (messageLine.split(' ')[0] == 'Купить') {
                    const myItem = messageLine.split(' ').slice(1).join(' ');
                    let resRows = await askMySQL(bot, pool, `SELECT id, name, type, element, cost, market FROM baseIngredients where name = "${myItem}"`, 220)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    if (resRows.length < 1 || resRows[0].market < 1) await bot.sendMessage(chatId, `Вы не можете купить этот предмет, потому что его нет на рынке`);
                    else {
                        if (await changeMoney(resRows[0].cost, '-') == -1) await bot.sendMessage(chatId, `Не могу отнять у Вас денег почему-то :(`);;
                        if (await changeIngredient(resRows[0].id, 1, '+') == -1) await bot.sendMessage(chatId, `Не могу дать Вам предмет почему-то :(`);
                        await bot.sendMessage(chatId, `Вы купили 1 предмет ${resRows[0].name}`);
                        resRows = await askMySQL(bot, pool, `UPDATE baseIngredients SET market = ${resRows[0].market - 1} WHERE id = ${resRows[0].id}`, 307)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    }
                    const itog = await getInventory(9, dopState1, 1);
                    return getKeyboardSell(itog);
                }
                return bot.sendMessage(chatId, "Неизвестная команда", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 2], 2, 2, 2), resize_keyboard: true }) });
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 306)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return sendImage('./Кастомные штуки/Картинки/Рынок.jpg', changeMyText(getMyText('Тексты/Рынок/Купить'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0, 2], 2, 2, 2))
        }
        case 'Приключение': {
            await bot.sendMessage(chatId, getMyText('Тексты/Ведутся работы'));
            return sendNewLoacation(bot, pool, 'Приключение', "Рыночная площадь", dopState1, dopState2, dopState3, chatId, character, "Вернули на рыночную площадь");
            if (toLocation === fromLocation) {
                return bot.sendMessage(chatId, "Неизвестная команда", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [0, 1, 2], 2, 2, 2), resize_keyboard: true }) });
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 305)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return sendImage('./Кастомные штуки/Картинки/Рыночная площадь.jpg', changeMyText(getMyText('Тексты/Рыночная площадь'), ['AvName'], [character.name]), keyboardConstructor(toLocation, [0], 2, 2, 2))
        }
        case 'Перекресток добычи': {
            if (toLocation === fromLocation) {
                if (dopState1 == 0) {
                    if (messageLine == keyTrack[toLocation][0].text) {
                        return sendNewLoacation(bot, pool, toLocation, 'Городская площадь', dopState1, dopState2, dopState3, chatId, character, "Вернули на рыночную площадь");
                    }
                    const keyboard = [];
                    let a = 3, b = -1;
                    for (let i = 0; i < Object.keys(constants.Farming).length; i++) {
                        if (a >= 2) {
                            a = 0;
                            b++;
                            keyboard.push([]);
                        }
                        keyboard[b].push({ text: Object.keys(constants.Farming)[i] })
                        a++;
                        if (messageLine == Object.keys(constants.Farming)[i]) {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = ${i + 1}, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 305)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            const keyboard = [];
                            let a = 3, b = -1;
                            for (let j = 0; j < Object.keys(constants.Farming[Object.keys(constants.Farming)[i]]).length; j++) {
                                if (a >= 2) {
                                    a = 0;
                                    b++;
                                    keyboard.push([]);
                                }
                                keyboard[b].push({ text: Object.keys(constants.Farming[Object.keys(constants.Farming)[i]])[j] })
                                a++;
                            }
                            keyboard.push([{ text: keyTrack[toLocation][1].text }])
                            return bot.sendMessage(chatId, "Выбери свой путь", { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                        }
                    }
                    keyboard.push([{ text: keyTrack[toLocation][0].text }])
                    return bot.sendMessage(chatId, "Неизвестная команда", { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                } else {
                    if (messageLine == keyTrack[toLocation][1].text) {
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 305)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        return sendNewLoacation(bot, pool, 'Городская площадь', toLocation, 0, 0, 0, chatId, character, "Идем на развилку фарминга");
                    }
                    if (constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]] == undefined) {
                        resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 305)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        await bot.sendMessage(chatId, "Этого фарминга больше не существует");
                        return sendNewLoacation(bot, pool, 'Городская площадь', toLocation, 0, 0, 0, chatId, character, "Идем на развилку фарминга");
                    }
                    const keyboard = [];
                    let a = 3, b = -1;
                    for (let i = 0; i < Object.keys(constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]]).length; i++) {
                        if (a >= 2) {
                            a = 0;
                            b++;
                            keyboard.push([]);
                        }
                        keyboard[b].push({ text: Object.keys(constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]])[i] })
                        a++;
                        if (messageLine == Object.keys(constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]])[i]) {
                            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState2 = ${i + 1}, dopState3 = 0, characterTimer = DATE_ADD(SYSDATE(), INTERVAL ${constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]][Object.keys(constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]])[i]].time} HOUR) WHERE id = ${character.id}`, 305)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                            return sendNewLoacation(bot, pool, toLocation, 'Фарминг', dopState1, i + 1, 0, chatId, character, "Идем на фарминг");
                        }
                    }
                    keyboard.push([{ text: keyTrack[toLocation][1].text }])
                    return bot.sendMessage(chatId, "Неизвестная команда", { reply_markup: JSON.stringify({ keyboard: keyboard, resize_keyboard: true }) });
                }
            }
            resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 313)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            const keyboard = [];
            let a = 3, b = -1;
            for (let i = 0; i < Object.keys(constants.Farming).length; i++) {
                if (a >= 2) {
                    a = 0;
                    b++;
                    keyboard.push([]);
                }
                keyboard[b].push({ text: Object.keys(constants.Farming)[i] })
                a++;
            }
            keyboard.push([{ text: keyTrack[toLocation][0].text }])
            return sendImage('./Кастомные штуки/Картинки/Фарминг.jpg', changeMyText(getMyText('Тексты/Перекресток добычи'), ['AvName'], [character.name]), keyboard)
        }
        case 'Фарминг': {
            if (constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]] == undefined) {
                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 305)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                await bot.sendMessage(chatId, "Этого фарминга больше не существует");
                return sendNewLoacation(bot, pool, 'Городская площадь', toLocation, 0, 0, 0, chatId, character, "Идем на развилку фарминга");
            } else if (constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]][Object.keys(constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]])[dopState2 - 1]] == undefined) {
                resRows = await askMySQL(bot, pool, `UPDATE characters SET dopState1 = 0, dopState2 = 0, dopState3 = 0 WHERE id = ${character.id}`, 305)
                if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                await bot.sendMessage(chatId, "Этого фарминга больше не существует");
                return sendNewLoacation(bot, pool, 'Городская площадь', toLocation, 0, 0, 0, chatId, character, "Идем на развилку фарминга");
            }
            const getChances = async () => {
                for (let idItem of Object.keys(items)) {
                    resRows = await askMySQL(bot, pool, `SELECT * FROM baseIngredients where id = ${idItem}`, 220)
                    if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                    text += `\n${Math.ceil(items[idItem] / constants.MaxChance * 100)}% ${resRows[0].name} (${resRows[0].type}, ${resRows[0].element}) ${resRows[0].cost} серебра`;
                    // if (constants.MaxChance / items[idItem] <= 1) text += `\nТочно найдете ${resRows[0].name} (${resRows[0].type}, ${resRows[0].element}) ${resRows[0].cost} серебра`;
                    // else if (constants.MaxChance / items[idItem] <= 1.25) text += `\nСкорее всего найдете ${resRows[0].name} (${resRows[0].type}, ${resRows[0].element}) ${resRows[0].cost} серебра`;
                    // else if (constants.MaxChance / items[idItem] <= 2) text += `\nМожет быть найдете ${resRows[0].name} (${resRows[0].type}, ${resRows[0].element}) ${resRows[0].cost} серебра`;
                    // else if (constants.MaxChance / items[idItem] <= 8) text += `\nМожет быть найдете ${resRows[0].name} (${resRows[0].type}, ${resRows[0].element}) ${resRows[0].cost} серебра`;
                    // else text += `\nМизерный шанс ${resRows[0].name} (${resRows[0].type}, ${resRows[0].element}) ${resRows[0].cost} серебра`;
                }
                return bot.sendMessage(chatId, changeMyText(getMyText('Тексты/Фарминг'), ['AvName', 'GoToFarmLocation', 'TimeToFarm'], [character.name, (Object.keys(constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]])[dopState2 - 1]).toLowerCase(), `Не более ${Math.ceil((characterTimer - new Date()) / 60000)} минут`]) + text, { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 0], 2, 2, 2), resize_keyboard: true }) });
            }
            resRows = await askMySQL(bot, pool, `SELECT characterTimer FROM characters where id = ${character.id}`, 220)
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            const characterTimer = resRows[0].characterTimer;
            const items = constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]][Object.keys(constants.Farming[Object.keys(constants.Farming)[dopState1 - 1]])[dopState2 - 1]].items;
            if (toLocation === fromLocation) {
                if (characterTimer - new Date() < 0) {
                    for (let idItem of Object.keys(items)) {
                        resRows = await askMySQL(bot, pool, `SELECT chance FROM chanceToItem where dopState1 = ${dopState1} AND dopState2 = ${dopState2} AND idIngredient = ${idItem}`, 220)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        let chance = items[idItem];
                        if (resRows[0]) {
                            chance += resRows[0].chance;
                        } else {
                            resRows = await askMySQL(bot, pool, `INSERT INTO chanceToItem (dopState1, dopState2, idIngredient) VALUES(${dopState1},${dopState2},${idItem}) `, 220)
                            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        }
                        resRows = await askMySQL(bot, pool, `SELECT * FROM baseIngredients where id = ${idItem}`, 220)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        let ingr = resRows[0];
                        let dice = Math.ceil(Math.random() * constants.MaxChance);
                        let kolvo = 0;
                        while (dice <= chance) {
                            chance -= dice;
                            kolvo++;
                            dice = Math.ceil(Math.random() * constants.MaxChance);
                        }
                        resRows = await askMySQL(bot, pool, `UPDATE chanceToItem SET chance = ${chance} where dopState1 = ${dopState1} AND dopState2 = ${dopState2} AND idIngredient = ${idItem} `, 220)
                        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
                        if (await changeIngredient(idItem, kolvo, '+') == -1) await bot.sendMessage(chatId, `Не могу дать Вам предмет почему-то :(`);
                        else if (kolvo > 0) text += `Получено: ${ingr.name} (${ingr.type}, ${ingr.element}) ${ingr.cost} серебра - ${kolvo} штук\n`
                    }
                    await bot.sendMessage(chatId, text == '' ? 'Вам не удалось ничего найти' : text);
                    return sendNewLoacation(bot, pool, toLocation, 'Перекресток добычи', dopState1, dopState2, dopState3, chatId, character, "Вернули на перекресток");
                }
                if (messageLine == keyTrack[toLocation][0].text) return sendNewLoacation(bot, pool, toLocation, 'Перекресток добычи', dopState1, dopState2, dopState3, chatId, character, "Вернули на перекресток");
                if (messageLine == 'Обновить') return getChances()
                return bot.sendMessage(chatId, "Неизвестная команда", { reply_markup: JSON.stringify({ keyboard: keyboardConstructor(toLocation, [1, 0], 2, 2, 2), resize_keyboard: true }) });
            }
            if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
            return getChances()
        }
        default:
            break;
    }
}

export default sendNewLoacation;