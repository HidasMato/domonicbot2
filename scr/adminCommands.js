import inf from '../tokens.json'  assert { type: "json" };
import choiseCharacter from './choiseCharacter.js';
import variables from '../Кастомные штуки/Генератор квестов/Список переменных.json' assert { type: "json" };
import constants from '../Кастомные штуки/Константы.json' assert { type: "json" };
import { adminsGetError, adminsGetMessage } from "./sendErrorMessage.js";
import askMySQL from './askMySQL.js';
import sendNewLoacation from './sendNewLoacation.js';
import { changeMyText, getMyText } from './myText.js';



const adminCommands = async (bot, pool, messageMas, chatId, chat) => {
    let resRows;
    const questAdmin = inf.adminsQuests.find(item => item == chatId);
    if (!inf.admins.find(item => item == chatId) && !questAdmin) return adminsGetError(bot, `Пользователь с id ${chatId} пытается вызвать админские команды\n${chat.username}\n${chat.first_name}\n${chat.last_name}`)
    const a = [
    /*0*/[{ text: `получить список всех гостей`, switch_inline_query_current_chat: "/admin getAllGuests" }],
    /*1*/[{ text: `получить список всех пользователей`, switch_inline_query_current_chat: "/admin getAllUsers" }],
    /*2*/[{ text: `изменить имя пользователя`, switch_inline_query_current_chat: "/admin changeNameUser текущее_имя_пользователя новое_имя_пользователя" }],
    /*3*/[{ text: `изменить примечание пользователя`, switch_inline_query_current_chat: "/admin changePrimUser имя_пользователя текст_с_примечаниеми" }],
    /*4*/[{ text: `получить список всех персонажей`, switch_inline_query_current_chat: "/admin getAllCharacter" }],
    /*5*/[{ text: `получить список всех персонажей пользователя`, switch_inline_query_current_chat: "/admin getAllCharacterOfUser имя_пользователя" }],
    /*6*/[{ text: `добавить нового персонажа`, switch_inline_query_current_chat: "/admin addNewCharacter имя_пользователя имя_персонажа" }],
    /*7*/[{ text: `сменить имя персонажа`, switch_inline_query_current_chat: "/admin changeNameCharacter имя_пользователя старое_имя_персонажа новое_имя_персонажа" }],
    /*8*/[{ text: `сменить хозяина персонажа`, switch_inline_query_current_chat: "/admin changeUserCharacter имя_текущего_пользователя имя_персонажа имя_нового_пользователя" }],
    /*9*/[{ text: `ресторнуть персонажа`, switch_inline_query_current_chat: "/admin restoreCharacter имя_персонажа" }],
    /*10*/[{ text: `посмотреть локацию персонажа`, switch_inline_query_current_chat: "/admin getLocationCharacter имя_персонажа" }],
    /*11*/[{ text: `посмотреть исследование персонажа`, switch_inline_query_current_chat: "/admin getSienseCharacter имя_персонажа" }],
    /*12*/[{ text: `обнулить исследование персонажа`, switch_inline_query_current_chat: "/admin setNullSiencseCharacter имя_персонажа" }],
    /*13*/[{ text: `посмотреть котел персонажа`, switch_inline_query_current_chat: "/admin getPotCharacter имя_персонажа номер котла" }],
    /*14*/[{ text: `очистить котел персонажа`, switch_inline_query_current_chat: "/admin clearPotCharacter имя_персонажа номер котла" }],
    /*15*/[{ text: `сменить уровень котла персонажа`, switch_inline_query_current_chat: "/admin setPotLevelCharacter имя_персонажа номер котла номер улучшения" }],
    /*16*/[{ text: `обнулить время котла персонажа`, switch_inline_query_current_chat: "/admin setNullPotTimeCharacter имя_персонажа номер котла" }],
    /*17*/[{ text: `посмотреть ранг, проживание и зелья персонажа`, switch_inline_query_current_chat: "/admin getRangLivingCharacter имя_персонажа" }],
    /*18*/[{ text: `сменить ранг персонажа`, switch_inline_query_current_chat: "/admin setRangCharacter имя_персонажа буква_ранга(Больш Англ)" }],
    /*19*/[{ text: `сменить проживание персонажа`, switch_inline_query_current_chat: "/admin setLivingCharacter имя_персонажа проживание цифрой" }],
    /*20*/[{ text: `поменять монеты персонажу, где знак:[+,-]`, switch_inline_query_current_chat: "/admin changeMoneyCharacter имя_персонажа знак монеты" }],
    /*21*/[{ text: `поменять предмет персонажу, где знак:[+,-]`, switch_inline_query_current_chat: "/admin changeInventoryCharacter имя_персонажа id_предмета знак количество" }],
    /*22*/[{ text: `поменять рецепт персонажу, где знак:[+,-] (добавить, отнять)`, switch_inline_query_current_chat: "/admin changeRecipeCharacter имя_персонажа id_рецепта знак" }],
    /*23*/[{ text: `получить список всех ингредиентов`, switch_inline_query_current_chat: "/admin getAllIngredients [описание]" }],
    /*24*/[{ text: `получить инвентарь персонажа`, switch_inline_query_current_chat: "/admin getCharacterInventory имя_персонажа" }],
    /*25*/[{ text: `получить список всех рецептов`, switch_inline_query_current_chat: "/admin getAllrecipes [описание]" }],
    /*26*/[{ text: `получить список всех рецептов персонажа`, switch_inline_query_current_chat: "/admin getCharacterrecipes имя_персонажа" }],
    /*27*/[{ text: `сменить название ингредиента`, switch_inline_query_current_chat: "/admin changeNameIngredient id_ингредиента новое_имя" }],
    /*28*/[{ text: `сменить тип ингредиента`, switch_inline_query_current_chat: "/admin changeTypeIngredient id_ингредиента новый_тип_предмета[основа, ингредиент, катализатор]" }],
    /*29*/[{ text: `сменить элемент ингредиента`, switch_inline_query_current_chat: "/admin changeElementIngredient id_ингредиента новый_элемент_предмета[свет, вода, земля, тьма, огонь, воздух]" }],
    /*30*/[{ text: `сменить описание ингредиента`, switch_inline_query_current_chat: "/admin changeDescriptionIngredient id_ингредиента новое описание" }],
    /*31*/[{ text: `сменить название рецепта`, switch_inline_query_current_chat: "/admin changeNamerecipe id_рецепта новое имя" }],
    /*32*/[{ text: `сменить описание рецепта`, switch_inline_query_current_chat: "/admin changeDescriptionrecipe id_рецепта новое описание" }],
    /*33*/[{ text: `сменить состав рецепта`, switch_inline_query_current_chat: "/admin changeInRecipe id_рецепта id_основы id_ингр1 [id_ингр2] [id_ингр3] [id_ингр4] [id_ингр5] id_катализатора" }],
    /*34*/[{ text: `сменить результат рецепта`, switch_inline_query_current_chat: "/admin changeItogrecipe id_рецепта id_предмета" }],
    /*35*/[{ text: `удалить рецепт`, switch_inline_query_current_chat: "/admin deleteRecipe id_рецепта" }],
    /*36*/[{ text: `добавить рецепт`, switch_inline_query_current_chat: "/admin addNewrecipe id_основы id_ингр1 [id_ингр2] [id_ингр3] [id_ингр4] [id_ингр5] id_катализатора id_результата" }],
    /*37*/[{ text: `добавить ингредиент`, switch_inline_query_current_chat: "/admin addNewIngredient тип элемент имя_ингредиента" }],
    /*38*/[{ text: `послать персонажу сообщение через бота`, switch_inline_query_current_chat: "/admin sendMessageToCharacter имя_персонажа сообщение" }],
    /*39*/[{ text: `добавить квест`, switch_inline_query_current_chat: "/admin addNewQuest ранг длительность серебро опыт -_или_id_ингредиента -_или_id_рецепта -_или_+_ака_необычный_предмент текст_задания" }],
    /*40*/[{ text: `сменить ранг квеста`, switch_inline_query_current_chat: "/admin setRangQuest id_квеста буква_ранга(Больш Англ)" }],
    /*41*/[{ text: `сменить длительность квеста`, switch_inline_query_current_chat: "/admin setLongQuest id_квеста колво_дней" }],
    /*42*/[{ text: `сменить деньги квеста`, switch_inline_query_current_chat: "/admin setMoneyQuest id_квеста колво_денег" }],
    /*43*/[{ text: `сменить опыт квеста`, switch_inline_query_current_chat: "/admin setXPQuest id_квеста колво_опыта" }],
    /*44*/[{ text: `сменить награду квеста`, switch_inline_query_current_chat: "/admin setDopQuest id_квеста -_или_id_ингредиента -_или_id_рецепта -_или_+_ака_необычный_предмент" }],
    /*45*/[{ text: `сменить текст квеста`, switch_inline_query_current_chat: "/admin setTextQuest id_квеста текст" }],
    /*46*/[{ text: `скипнуть время квеста`, switch_inline_query_current_chat: "/admin setDateStartQuest id_квеста" }],
    /*47*/[{ text: `изменить исследование персонажа`, switch_inline_query_current_chat: "/admin setSienseCharacter имя_персонажа уровень_исследования" }],
    /*48*/[{ text: `получить информацию о квесте`, switch_inline_query_current_chat: "/admin getQuest id_квеста" }],
    /*49*/[{ text: `дублировать квест`, switch_inline_query_current_chat: "/admin doubleQuest id_квеста" }],
    /*50*/[{ text: `послать пользователю сообщение через бота`, switch_inline_query_current_chat: "/admin sendMessageToUser имя_пользователя сообщение" }],
    /*51*/[{ text: `поменять предмет на рынке, где знак:[+,-]`, switch_inline_query_current_chat: "/admin changeMarketItem id_предмета знак количество" }],
    /*52*/[{ text: `получить список рынка`, switch_inline_query_current_chat: "/admin getMarketItems" }],
    /*53*/[{ text: `обнулить фарм персонажа`, switch_inline_query_current_chat: "/admin setNullFarmCharacter имя_персонажа" }],
    ];
    if (questAdmin && !["doubleQuest", "addNewQuest", "setTextQuest", "getQuest", "getAllIngredients"].find(item => item == messageMas[1]) && messageMas.length != 1) {
        await adminsGetError(bot, `Админ по квестам с id ${chatId} пытается вызвать админские команды\n${chat.username}\n${chat.first_name}\n${chat.last_name}\n${messageMas.join(' ')}`)
        return bot.sendMessage(chatId, `Вы не можете использовать эту команду`)
    }
    if (messageMas?.[1] === 'help' || messageMas.length === 1) {
        if (questAdmin) return bot.sendMessage(chatId, `Команды админа по квестам:`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [a[39], a[49], a[45], a[48], a[23]] }) });
        if (messageMas[2] === 'all')
            return bot.sendMessage(chatId, `Все aдминские команды:`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: a }) });
        else if (messageMas[2] === 'users')
            return bot.sendMessage(chatId, `Админские команды пользователей`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [a[0], a[1], a[2], a[3], a[4], a[5], a[8]] }) });
        else if (messageMas[2] === 'customs')
            return bot.sendMessage(chatId, `Админские команды персонажей`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[47], a[12], a[17], a[18], a[19], a[20], a[53], a[24]] }) });
        else if (messageMas[2] === 'pots')
            return bot.sendMessage(chatId, `Админские команды котлов`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [a[4], a[13], a[14], a[15], a[16]] }) });
        else if (messageMas[2] === 'inventory')
            return bot.sendMessage(chatId, `Админские команды инвентарей`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [a[23], a[24], a[25], a[26], a[21], a[22]] }) });
        else if (messageMas[2] === 'redact')
            return bot.sendMessage(chatId, `Админские команды ингредиентов и рецептов`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [a[23], a[25], a[27], a[28], a[29], a[30], a[31], a[32], a[33], a[34], a[35], a[36], a[37], a[51], a[52]] }) });
        else if (messageMas[2] === 'quests')
            return bot.sendMessage(chatId, `Админские команды квестов`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [a[48], a[39], a[40], a[41], a[42], a[43], a[44], a[45], a[46], a[49]] }) });
        else
            return bot.sendMessage(chatId, `Админские команды помощи:`, {
                reply_markup: JSON.stringify({
                    remove_keyboard: true, inline_keyboard:
                        [
                            [{ text: `Редактирование пользователей`, switch_inline_query_current_chat: "/admin help users" }],
                            [{ text: `Редактирование персонажей`, switch_inline_query_current_chat: "/admin help customs" }],
                            [{ text: `Редактирование инвентарей`, switch_inline_query_current_chat: "/admin help inventory" }],
                            [{ text: `Редактирование котлов`, switch_inline_query_current_chat: "/admin help pots" }],
                            [{ text: `Редактирование ингредиентов и рецептов`, switch_inline_query_current_chat: "/admin help redact" }],
                            [{ text: `Редактирование квестов`, switch_inline_query_current_chat: "/admin help quests" }],
                            [{ text: `Все команды`, switch_inline_query_current_chat: "/admin help all" }],
                            [{ text: `Послать персонажу личное сообщение через бота`, switch_inline_query_current_chat: "/admin sendMessageToCharacter имя_персонажа сообщение" }],
                            [{ text: `Послать пользователю личное сообщение через бота`, switch_inline_query_current_chat: "/admin sendMessageToUser имя_пользователя сообщение" }],
                        ]
                })
            });
    }
    else if (messageMas[1] === 'addNewUser') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно хотя бы id и имя пользователя`);
        const userId = Number(messageMas[2]);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `Неправильно указан id`);
        resRows = await askMySQL(bot, pool, `SELECT COUNT(*) FROM users WHERE id=${userId}`, 500)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]['COUNT(*)']) return bot.sendMessage(chatId, `Такой id у нас уже зарегестрирован`);
        resRows = await askMySQL(bot, pool, `SELECT COUNT(*) FROM users WHERE name="${messageMas[3]}"`, 501)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]['COUNT(*)']) return bot.sendMessage(chatId, `У нас уже есть пользователь с таким никнеймом`);
        resRows = await askMySQL(bot, pool, `INSERT INTO users (id, name, prim) VALUES (${userId}, "${messageMas[3]}", "${messageMas.slice(4).join(' ')}");`, 502)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) {
            await bot.sendMessage(userId, `Вас авторизовали в качестве пользователя!\n Подождите пока Вам дадут персонажа`);
            return bot.sendMessage(chatId, `Пользователь с ником ${messageMas[3]} добавлен`, { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: `Дать персонажа пользователю`, switch_inline_query_current_chat: `/admin addNewCharacter ${messageMas[3]} имя_персонажа` }]] }) });
        }
        else return bot.sendMessage(chatId, `Что-то пошло не так, пользователя не добавили :(`);
    }
    else if (messageMas[1] === 'getAllGuests') {
        resRows = await askMySQL(bot, pool, `SELECT id, userName, firstName, lastName FROM guests ORDER BY firstName`, 505)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = "Список всех гостей в базе:";
        resRows.forEach((item) => {
            mes = `${mes}\nid: ${item?.id} имя: ${item?.userName} (${item?.firstName} ${item?.lastName})`;
        });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'getAllUsers') {
        resRows = await askMySQL(bot, pool, `SELECT id, name, prim  FROM users ORDER BY name`, 506)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = "Список всех пользователей в базе:";
        resRows.forEach((item) => {
            mes = `${mes}\n${item?.id}. ${item?.name} (${item?.prim})`;
        });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'changeNameUser') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно старое и новое имена пользователя`);
        resRows = await askMySQL(bot, pool, `SELECT COUNT(*) FROM users WHERE name="${messageMas[2]}"`, 507)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]['COUNT(*)' === 0]) return bot.sendMessage(chatId, `Такого имени пользователя нас нет`);
        resRows = await askMySQL(bot, pool, `SELECT COUNT(*) FROM users WHERE name="${messageMas[3]}"`, 508)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]['COUNT(*)']) return bot.sendMessage(chatId, `У нас уже есть пользователь с ником ${messageMas[3]}`);
        resRows = await askMySQL(bot, pool, `UPDATE users SET name = "${messageMas[3]}" WHERE name = "${messageMas[2]}"`, 509)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Пользователь с ником ${messageMas[2]} переименован в ${messageMas[3]}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, пользователя не добавили :(`);
    }
    else if (messageMas[1] === 'changePrimUser') {
        if (messageMas.length < 3) return bot.sendMessage(chatId, `Нужно имя пользователя, примечание можно не ставить`);
        resRows = await askMySQL(bot, pool, `SELECT COUNT(*) FROM users WHERE name="${messageMas[2]}"`, 510)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]['COUNT(*)' === 0]) return bot.sendMessage(chatId, `Такого имени пользователя нас нет`);
        resRows = await askMySQL(bot, pool, `UPDATE users SET prim = "${messageMas.length < 4 ? null : messageMas.slice(3).join(' ')}" WHERE name = "${messageMas[2]}"`, 511)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `У пользователя с ником ${messageMas[2]} примечание стало ${messageMas.slice(3).join(' ')}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, пользователя не добавили :(`);
    }
    else if (messageMas[1] === 'getAllCharacter') {
        resRows = await askMySQL(bot, pool, `SELECT characters.rang as rang, characters.living as living, characters.id as id, characters.name as name, users.name as host, characters.silver as silver  FROM users, characters WHERE host = users.id ORDER BY characters.id`, 512)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = "Список всех персонажей в базе:";
        resRows.forEach((item) => {
            mes = `${mes}\n${item?.id}. ${item?.name} (${item?.host})\n ранг ${constants.Rang[item?.rang]?.name}, ${constants.Living[item?.living]?.name} проживание, ${item?.silver} серебра, `;
        });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'getAllCharacterOfUser') {
        if (messageMas.length < 3) return bot.sendMessage(chatId, `Нужно имя пользователя`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM users WHERE name="${messageMas[2]}"`, 513)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `Такого имени пользователя нас нет`);
        const id = Number(resRows[0]?.id);
        resRows = await askMySQL(bot, pool, `SELECT id, name, rang, living, silver FROM characters WHERE host=${id} ORDER BY name`, 514)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = `Список всех персонажей игрока ${messageMas[2]}:`;
        resRows.forEach((item) => {
            mes = `${mes}\n${item?.id}. ${item?.name}\n ранг ${constants.Rang[item?.rang]?.name}, ${constants.Living[item?.living]?.name} проживание, ${item?.silver} серебра, `;
        });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'addNewCharacter') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно имя пользователя и имя нового персонажа`);
        resRows = await askMySQL(bot, pool, `SELECT id, activeCharacter FROM users WHERE name="${messageMas[2]}"`, 517)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет пользователья с таким никнеймом`);
        const id = resRows[0]?.id;
        const actCh = resRows[0]?.activeCharacter;
        resRows = await askMySQL(bot, pool, `SELECT COUNT(*) FROM characters WHERE name="${messageMas[3]}"`, 518)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]['COUNT(*)']) return bot.sendMessage(chatId, `У нас уже есть персонаж с таким никнеймом`);
        resRows = await askMySQL(bot, pool, `INSERT INTO characters (host, name) values (${id}, "${messageMas[3]}")`, 519)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) {
            await bot.sendMessage(id, `Вам зарегестрировали персонажа ${messageMas[3]}`);
            if (actCh == null) choiseCharacter(bot, pool, chatId);
            return bot.sendMessage(chatId, `Персонаж с ником ${messageMas[3]} добавлен`, {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: `Поменять имя`, switch_inline_query_current_chat: `/admin changeNameCharacter ${messageMas[2]} ${messageMas[3]} новое_имя` }],
                        [{ text: `Дать 1000 серебра персонажу`, switch_inline_query_current_chat: `/admin changeMoneyCharacter ${messageMas[3]} + 1000` }],
                        [{ text: `Дать персонажу 10 предметов`, switch_inline_query_current_chat: `/admin changeInventoryCharacter ${messageMas[3]} id_предмета + 10` }],
                        [{ text: `Дать персонажу рецепт`, switch_inline_query_current_chat: `/admin changeRecipeCharacter ${messageMas[3]} id_рецепта +` }],
                        [{ text: `Задать исследование`, switch_inline_query_current_chat: `/admin setSienseCharacter ${messageMas[3]} уровень_исследования` }],
                        [{ text: `Задать ранг`, switch_inline_query_current_chat: `/admin setRangCharacter ${messageMas[3]} буква_ранга(Больш Англ)` }],
                        [{ text: `Задать проживание`, switch_inline_query_current_chat: `/admin setLivingCharacter ${messageMas[3]} проживание цифрой` }]
                    ]
                })
            });
        }
        else return bot.sendMessage(chatId, `Что-то пошло не так, пользователя не добавили :(`);
    }
    else if (messageMas[1] === 'changeNameCharacter') {
        if (messageMas.length < 5) return bot.sendMessage(chatId, `Нужно имя пользователя, старое имя персонажа и новое имя персонажа`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM users WHERE name="${messageMas[2]}"`, 520)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет пользователья с таким никнеймом`);
        const id = Number(resRows[0]?.id);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name="${messageMas[3]}" AND host = ${id}`, 521)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У этого пользователя нет персонажа с таким никнеймом`);
        resRows = await askMySQL(bot, pool, `SELECT COUNT(*) FROM characters WHERE name="${messageMas[4]}"`, 522)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]['COUNT(*)']) return bot.sendMessage(chatId, `У нас уже есть персонаж с ником ${messageMas[4]}`);
        resRows = await askMySQL(bot, pool, `UPDATE characters SET name = "${messageMas[4]}" WHERE name = "${messageMas[3]}" AND host = ${id}`, 523)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Персонаж с ником ${messageMas[3]} переименован в ${messageMas[4]}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, пользователя не переименовали :(`);
    }
    else if (messageMas[1] === 'changeUserCharacter') {
        if (messageMas.length < 5) return bot.sendMessage(chatId, `Нужно имя текущего пользователя, имя персонажа и имя нового пользователя`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM users WHERE name="${messageMas[2]}"`, 524)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет пользователья с никнеймом ${messageMas[2]}`);
        const id1 = Number(resRows[0]?.id);
        resRows = await askMySQL(bot, pool, `SELECT id FROM users WHERE name="${messageMas[4]}"`, 525)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет пользователья с никнеймом ${messageMas[4]}`);
        const id2 = Number(resRows[0]?.id);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name="${messageMas[3]}" AND host = ${id1}`, 526)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У пользователя ${messageMas[2]} нет персонажа с никнеймом ${messageMas[3]}`);
        resRows = await askMySQL(bot, pool, `UPDATE characters SET host = "${id2}" WHERE name = "${messageMas[3]}" AND host = ${id1}`, 527)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Персонаж с ником ${messageMas[3]} передан пользователю ${messageMas[4]}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, пользователя не передали :(`);
    }
    else if (messageMas[1] === 'restoreCharacter') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно имя персонажа`);
        resRows = await askMySQL(bot, pool, `SELECT id, host FROM characters WHERE name="${messageMas[2]}"`, 582)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        await sendNewLoacation(bot, pool, 'Городская площадь', 'Городская площадь', 0, 0, 0, resRows[0].host, { id: resRows[0].id, name: messageMas[2], silver: 0, sienceLevel: 0, sienceTimer: 0, needGiverecipe: 0, rang: 0, living: 0 }, '123');
    }
    else if (messageMas[1] === 'getLocationCharacter') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно имя персонажа`);
        resRows = await askMySQL(bot, pool, `SELECT location, dopState1, dopState2, dopState3 FROM characters WHERE name = "${messageMas[2]}"`, 585)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        return bot.sendMessage(chatId, `Персонаж ${messageMas[2]} находится в локации ${resRows[0].location} (${resRows[0].dopState1},${resRows[0].dopState2},${resRows[0].dopState3})`);
    }
    else if (messageMas[1] === 'getSienseCharacter') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно имя персонажа`);
        resRows = await askMySQL(bot, pool, `SELECT sienceLevel, sienceTimer, needGiverecipe FROM characters WHERE name = "${messageMas[2]}"`, 586)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        return bot.sendMessage(chatId, `Персонаж ${messageMas[2]} имеет уровень исследований ${resRows[0].sienceLevel}\n${(resRows[0].sienceTimer - new Date()) > 0 ? `Исследование в процессе. Завершится ${resRows[0].sienceTimer.getDate() < 10 ? '0' + resRows[0].sienceTimer.getDate() : resRows[0].sienceTimer.getDate()}.${resRows[0].sienceTimer.getMonth() + 1 < 10 ? '0' + (resRows[0].sienceTimer.getMonth() + 1) : resRows[0].sienceTimer.getMonth() + 1}.${resRows[0].sienceTimer.getFullYear()} ${resRows[0].sienceTimer.getHours() < 10 ? '0' + resRows[0].sienceTimer.getHours() : resRows[0].sienceTimer.getHours()}:${resRows[0].sienceTimer.getMinutes() < 10 ? '0' + resRows[0].sienceTimer.getMinutes() : resRows[0].sienceTimer.getMinutes()}:${resRows[0].sienceTimer.getSeconds() < 10 ? '0' + resRows[0].sienceTimer.getSeconds() : resRows[0].sienceTimer.getSeconds()}` : resRows[0].needGiverecipe ? "Исследователь готов отчитаться" : "В данный момент исследований не ведется"}`);
    }
    else if (messageMas[1] === 'setSienseCharacter') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно имя персонажа и уровень исследования`);
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Уровень исследования не цифра`);
        if (Number(messageMas[3]) > 10 || Number(messageMas[3]) < 0) return bot.sendMessage(chatId, `Уровень исследования от 0 до 10`);
        resRows = await askMySQL(bot, pool, `SELECT sienceLevel FROM characters WHERE name = "${messageMas[2]}"`, 589)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        resRows = await askMySQL(bot, pool, `UPDATE characters SET sienceLevel = ${Number(messageMas[3])}  WHERE name = "${messageMas[2]}"`, 589)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`);
        return bot.sendMessage(chatId, `Персонажу ${messageMas[2]} поставили уровень исследования ${Number(messageMas[3])}`);
    }
    else if (messageMas[1] === 'getRangLivingCharacter') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно имя персонажа`);
        resRows = await askMySQL(bot, pool, `SELECT id, rang, living FROM characters WHERE name = "${messageMas[2]}"`, 587)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const id = resRows[0].id;
        let text = `У персонажа ${messageMas[2]}\nРанг ${constants.Rang[resRows[0].rang].name}\nПроживание ${constants.Living[resRows[0].living].name}`
        for (let zelie of constants.MasObjHealfZelii) {
            resRows = await askMySQL(bot, pool, `SELECT (SELECT name FROM baseIngredients where id = ${zelie.id}) as name, (SELECT sum FROM characterIngredients WHERE idIngredient = ${zelie.id} AND idCharacter = ${id}) as sum`, 588)
            if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
            if (!resRows[0].name) await bot.sendMessage(chatId, `Id зелья здоровья ${zelie.id} не существует`)
            else text += `\n${zelie.id}. ${resRows[0].name} - ${resRows[0].sum == null ? 0 : resRows[0].sum} штук`
        }
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, text);
    }
    else if (messageMas[1] === 'setNullSiencseCharacter') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно имя персонажа`);
        resRows = await askMySQL(bot, pool, `SELECT needGiverecipe FROM characters WHERE name = "${messageMas[2]}"`, 587)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const ngr = resRows[0].needGiverecipe;
        resRows = await askMySQL(bot, pool, `UPDATE characters SET sienceTimer = SYSDATE() WHERE name = "${messageMas[2]}"`, 587)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, `Сбросили время исследований персонажу ${ngr ? '' : '. Но персонаж и так ничего не исследует'}`);
    }
    else if (messageMas[1] === 'setNullPotTimeCharacter') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно имя персонажа и номер котла`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name = "${messageMas[2]}"`, 588)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const id = resRows[0].id;
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Номер котла не цифра`)
        if (Number(messageMas[3]) < 1 || Number(messageMas[3]) > 4) return bot.sendMessage(chatId, `Номер котла от 1 до 4`)
        resRows = await askMySQL(bot, pool, `SELECT ingrKatal, isBreak FROM characterPots WHERE idCharacter = ${id} AND idPot = ${Number(messageMas[3])}`, 590)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `У пользователя нет котла с номером ${Number(messageMas[3])}`)
        const res = resRows[0];
        resRows = await askMySQL(bot, pool, `UPDATE characterPots SET timeToReady = SYSDATE() WHERE idCharacter = ${id} AND idPot = ${Number(messageMas[3])}`, 589)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, `Сбросили время варки персонажу ${messageMas[2]} в котле ${messageMas[3]} ${res.ingrKatal == null ? '. Но у персонажа в котле ничего и не варилось' : res.isBreak ? '. Но котел персонажа сломан' : ''}`);
    }
    else if (messageMas[1] === 'getPotCharacter') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно имя персонажа и номер котла`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name = "${messageMas[2]}"`, 588)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const id = resRows[0].id;
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Номер котла не цифра`)
        if (Number(messageMas[3]) < 1 || Number(messageMas[3]) > 4) return bot.sendMessage(chatId, `Номер котла от 1 до 4`)
        resRows = await askMySQL(bot, pool, `SELECT * FROM characterPots WHERE idCharacter = ${id} AND idPot = ${Number(messageMas[3])}`, 590)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Пользователь еще не подходил к котлу с номером ${Number(messageMas[3])}`)
        const potInfo = resRows[0];
        resRows = await askMySQL(bot, pool, `SELECT (SELECT name FROM baseIngredients WHERE id = ${potInfo.ingrBase}) as ingrBase, (SELECT name FROM baseIngredients WHERE id = ${potInfo.ingr1}) as ingr1, (SELECT name FROM baseIngredients WHERE id = ${potInfo.ingr2}) as ingr2, (SELECT name FROM baseIngredients WHERE id = ${potInfo.ingr3}) as ingr3, (SELECT name FROM baseIngredients WHERE id = ${potInfo.ingr4}) as ingr4, (SELECT name FROM baseIngredients WHERE id = ${potInfo.ingr5}) as ingr5, (SELECT name FROM baseIngredients WHERE id = ${potInfo.ingrKatal}) as ingrKatal`, 592)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, `Котел ${Number(messageMas[3])}:\nСломан? ${potInfo.isBreak ? 'да' : 'нет'}\nУлучшение: ${potInfo.levelUpgrade}\nВремя готовки: ${potInfo.timeToReady.getDate() < 10 ? '0' + potInfo.timeToReady.getDate() : potInfo.timeToReady.getDate()}.${potInfo.timeToReady.getMonth() + 1 < 10 ? '0' + (potInfo.timeToReady.getMonth() + 1) : potInfo.timeToReady.getMonth() + 1}.${potInfo.timeToReady.getFullYear()} ${potInfo.timeToReady.getHours() < 10 ? '0' + potInfo.timeToReady.getHours() : potInfo.timeToReady.getHours()}:${potInfo.timeToReady.getMinutes() < 10 ? '0' + potInfo.timeToReady.getMinutes() : potInfo.timeToReady.getMinutes()}:${potInfo.timeToReady.getSeconds() < 10 ? '0' + potInfo.timeToReady.getSeconds() : potInfo.timeToReady.getSeconds()}\nБаза: (${potInfo.ingrBase})${resRows[0].ingrBase}\nИнгредиенты: (${potInfo.ingr1})${resRows[0].ingr1}, (${potInfo.ingr2})${resRows[0].ingr2}, (${potInfo.ingr3})${resRows[0].ingr3}, (${potInfo.ingr4})${resRows[0].ingr4}, (${potInfo.ingr5})${resRows[0].ingr5}\nКатализатор: (${potInfo.ingrKatal})${resRows[0].ingrKatal}`);
    }
    else if (messageMas[1] === 'clearPotCharacter') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно имя персонажа и номер котла`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name = "${messageMas[2]}"`, 594)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const id = resRows[0].id;
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Номер котла не цифра`)
        if (Number(messageMas[3]) < 1 || Number(messageMas[3]) > 4) return bot.sendMessage(chatId, `Номер котла от 1 до 4`)
        resRows = await askMySQL(bot, pool, `SELECT ingrBase, ingrKatal, isBreak FROM characterPots WHERE idCharacter = ${id} AND idPot = ${Number(messageMas[3])}`, 595)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Пользователь еще не подходил к котлу с номером ${Number(messageMas[3])}`)
        const potInfo = resRows[0];
        resRows = await askMySQL(bot, pool, `UPDATE characterPots SET ingrBase = null, ingr1 = null, ingr2 = null, ingr3 = null, ingr4 = null, ingr5 = null, ingrKatal = null  WHERE idCharacter = ${id} AND idPot = ${Number(messageMas[3])}`, 596)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        resRows = await askMySQL(bot, pool, `SELECT location, host from characters where id = ${id}`, 597)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0].location == 'Котел') await sendNewLoacation(bot, pool, 'Котел', 'Комната с котлами', 0, 0, 0, resRows[0].host, { id: id, name: messageMas[2], silver: 0, sienceLevel: 0, sienceTimer: 0, needGiverecipe: 0, rang: 0, living: 0 }, '123');
        return bot.sendMessage(chatId, `Котел ${Number(messageMas[3])} очищен${potInfo.isBreak ? '\nНо котел и так был сломан' : potInfo.ingrKatal != null ? '\nВ котле шла реакция. Теперь ее нет' : potInfo.ingrBase == null ? '\nКотел и так был пуст' : ''}`);
    }
    else if (messageMas[1] === 'setPotLevelCharacter') {
        if (messageMas.length != 5) return bot.sendMessage(chatId, `Нужно имя персонажа, номер котла и номер улучшения`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name = "${messageMas[2]}"`, 597)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const id = resRows[0].id;
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Номер котла не цифра`)
        if (Number(messageMas[3]) < 1 || Number(messageMas[3]) > 4) return bot.sendMessage(chatId, `Номер котла от 1 до 4`)
        if (isNaN(Number(messageMas[4]))) return bot.sendMessage(chatId, `Номер улучшения не цифра`)
        if (Number(messageMas[4]) < 0 || Number(messageMas[4]) > 4) return bot.sendMessage(chatId, `Номер улучшения от 0 до 4`)
        resRows = await askMySQL(bot, pool, `SELECT levelUpgrade FROM characterPots WHERE idCharacter = ${id} AND idPot = ${Number(messageMas[3])}`, 598)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Пользователь еще не подходил к котлу с номером ${Number(messageMas[3])}`)
        const potInfo = resRows[0];
        resRows = await askMySQL(bot, pool, `UPDATE characterPots SET levelUpgrade = ${messageMas[4]} WHERE idCharacter = ${id} AND idPot = ${Number(messageMas[3])}`, 599)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, `Котелу ${Number(messageMas[3])} дали уровень улучшения ${Number(messageMas[4])}`);
    }
    else if (messageMas[1] === 'setRangCharacter') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно имя персонажа и букву ранга большую английскую`);
        let rangNumber = -1;
        for (let rang of Object.keys(constants.Rang)) {
            if (constants.Rang[rang].name == messageMas[3]) {
                rangNumber = rang;
                break;
            }
        }
        if (rangNumber == -1) return bot.sendMessage(chatId, `В базе нет ранга ${messageMas[3]}`);
        resRows = await askMySQL(bot, pool, `SELECT rang FROM characters WHERE name = "${messageMas[2]}"`, 590)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const oldRang = resRows[0].rang;
        resRows = await askMySQL(bot, pool, `UPDATE characters SET rang = ${rangNumber} WHERE name = "${messageMas[2]}"`, 591)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, `Сменили персонажу ${messageMas[2]} ранг с ${constants.Rang[oldRang].name} на ${constants.Rang[rangNumber].name}`);
    }
    else if (messageMas[1] === 'setLivingCharacter') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно имя персонажа и цифру проживания`);
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Проживание не цифра`)
        if (constants.Living[Number(messageMas[3])] == undefined) return bot.sendMessage(chatId, `Цифра проживания не находится в файле констант`)
        resRows = await askMySQL(bot, pool, `SELECT living FROM characters WHERE name = "${messageMas[2]}"`, 592)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const oldLiving = resRows[0].living;
        resRows = await askMySQL(bot, pool, `UPDATE characters SET living = ${Number(messageMas[3])} WHERE name = "${messageMas[2]}"`, 593)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, `Сменили персонажу ${messageMas[2]} проживание с ${constants.Living[oldLiving].name} на ${constants.Living[Number(messageMas[3])].name}`);
    }
    else if (messageMas[1] === 'changeMoneyCharacter') {
        if (messageMas.length < 5) return bot.sendMessage(chatId, `Нужно имя персонажа, знак[+,-] и количество монет`);
        let money = Number(messageMas[4]);
        if (isNaN(money)) return bot.sendMessage(chatId, `Количество монет указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT id, silver FROM characters WHERE name="${messageMas[2]}"`, 528)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет персонажа с именем ${messageMas[2]}`);
        const id = Number(resRows[0]?.id);
        const silver = Number(resRows[0]?.silver);
        if (messageMas[3][0] === '-') {
            if (money > silver) money = silver;
            resRows = await askMySQL(bot, pool, `UPDATE characters SET silver = ${silver - money} WHERE id = ${id}`, 529)
            if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
            if (resRows.affectedRows) return bot.sendMessage(chatId, `У персонажа ${messageMas[2]} отняли ${money} серебра, теперь у него есть ${silver - money} серебра`);
            else return bot.sendMessage(chatId, `Что-то пошло не так, у персонажа не отнли деньги :(`);
        } else if (messageMas[3][0] === '+') {
            resRows = await askMySQL(bot, pool, `UPDATE characters SET silver = ${silver + money} WHERE id = ${id}`, 530)
            if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
            if (resRows.affectedRows) return bot.sendMessage(chatId, `Персонажу ${messageMas[2]} дали ${money} серебра, теперь у него есть ${silver + money} серебра`);
            else return bot.sendMessage(chatId, `Что-то пошло не так, персонажу не дали деньги :(`);
        } else {
            return bot.sendMessage(chatId, `Вторым аргументом должен быть знак + или -`);
        }
    }
    else if (messageMas[1] === 'changeInventoryCharacter') {
        if (messageMas.length < 6) return bot.sendMessage(chatId, `Нужно имя персонажа,  id предмета, знак[+,-] и количество предметов`);
        let kolvo = Number(messageMas[5]);
        const idItem = Number(messageMas[3]);
        if (isNaN(kolvo)) return bot.sendMessage(chatId, `Количество указано неверно`);
        if (isNaN(idItem)) return bot.sendMessage(chatId, `Id предмета указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name="${messageMas[2]}"`, 531)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет персонажа с именем ${messageMas[2]}`);
        const idCustom = Number(resRows[0]?.id);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseIngredients WHERE id = ${idItem}`, 532)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет ингредиента с id ${idItem}`);
        const nameItem = resRows[0]?.name;
        resRows = await askMySQL(bot, pool, `SELECT sum FROM characterIngredients WHERE idIngredient = ${idItem} AND idCharacter = ${idCustom}`, 533)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]) {
            const sum = Number(resRows[0]?.sum);
            if (messageMas[4][0] === '-') {
                if (kolvo > sum) kolvo = sum;
                resRows = await askMySQL(bot, pool, `UPDATE characterIngredients SET sum = ${sum - kolvo} WHERE idCharacter = ${idCustom} AND idIngredient = ${idItem}`, 534)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.affectedRows) return bot.sendMessage(chatId, `У персонажа ${messageMas[2]} отняли ${kolvo} ${nameItem}, теперь у него есть ${sum - kolvo} ${nameItem}`);
                else return bot.sendMessage(chatId, `Что-то пошло не так, у персонажа не отняли предмет :(`);
            } else if (messageMas[4][0] === '+') {
                resRows = await askMySQL(bot, pool, `UPDATE characterIngredients SET sum = ${sum + kolvo} WHERE idCharacter = ${idCustom} AND idIngredient = ${idItem}`, 535)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.affectedRows) return bot.sendMessage(chatId, `Персонажу ${messageMas[2]} дали ${kolvo} ${nameItem}, теперь у него есть ${sum + kolvo} ${nameItem}`);
                else return bot.sendMessage(chatId, `Что-то пошло не так, персонажу не дали предмет :(`);
            } else {
                return bot.sendMessage(chatId, `Вторым аргументом должен быть знак + или -`);
            }
        } else {
            if (messageMas[4][0] === '-') {
                if (kolvo > 0) kolvo = 0;
                resRows = await askMySQL(bot, pool, `INSERT INTO characterIngredients (idCharacter,idIngredient, sum) values (${idCustom},${idItem},${0 - kolvo})`, 536)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.affectedRows) return bot.sendMessage(chatId, `У персонажа ${messageMas[2]} отняли ${kolvo} ${nameItem}, теперь у него есть ${0 - kolvo} ${nameItem}`);
                else return bot.sendMessage(chatId, `Что-то пошло не так, у персонажа не отняли предмет :(`);
            } else if (messageMas[4][0] === '+') {
                resRows = await askMySQL(bot, pool, `INSERT INTO characterIngredients (idCharacter,idIngredient, sum) values (${idCustom},${idItem},${kolvo})`, 537)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.affectedRows) return bot.sendMessage(chatId, `Персонажу ${messageMas[2]} дали ${kolvo} ${nameItem}, теперь у него есть ${kolvo} ${nameItem}`);
                else return bot.sendMessage(chatId, `Что-то пошло не так, персонажу не дали предмет :(`);
            } else {
                return bot.sendMessage(chatId, `Вторым аргументом должен быть знак + или -`);
            }
        }
    }
    else if (messageMas[1] === 'changeRecipeCharacter') {
        if (messageMas.length < 5) return bot.sendMessage(chatId, `Нужно имя персонажа,  id рецепта и знак[+,-]`);
        const idRec = Number(messageMas[3]);
        if (isNaN(idRec)) return bot.sendMessage(chatId, `Id рецепта указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name="${messageMas[2]}"`, 538)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет персонажа с именем ${messageMas[2]}`);
        const idCustom = Number(resRows[0]?.id);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseRecipes WHERE id = ${idRec}`, 539)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет рецпта с id ${idRec}`);
        const nameRec = resRows[0]?.name;
        resRows = await askMySQL(bot, pool, `SELECT * FROM characterRecipes WHERE idRecipe = ${idRec} AND idCharacter = ${idCustom}`, 540)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]) {
            if (messageMas[4][0] === '-') {
                resRows = await askMySQL(bot, pool, `DELETE FROM characterRecipes WHERE idCharacter = ${idCustom} AND idRecipe = ${idRec}`, 541)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.affectedRows) return bot.sendMessage(chatId, `У персонажа ${messageMas[2]} отняли рецепт ${nameRec}`);
                else return bot.sendMessage(chatId, `Что-то пошло не так, у персонажа не отняли рецепт :(`);
            } else if (messageMas[4][0] === '+') {
                return bot.sendMessage(chatId, `У персонажа ${messageMas[2]} уже есть рецепт ${nameRec}`);
            } else {
                return bot.sendMessage(chatId, `Вторым аргументом должен быть знак + или -`);
            }
        } else {
            if (messageMas[4][0] === '-') {
                return bot.sendMessage(chatId, `У персонажа ${messageMas[2]} не было рецепта ${nameRec}`);
            } else if (messageMas[4][0] === '+') {
                resRows = await askMySQL(bot, pool, `INSERT INTO characterRecipes (idCharacter,idRecipe) values (${idCustom},${idRec})`, 542)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.affectedRows) return bot.sendMessage(chatId, `Персонажу ${messageMas[2]} дали рецепт ${nameRec}`);
                else return bot.sendMessage(chatId, `Что-то пошло не так, персонажу не дали предмет :(`);
            } else {
                return bot.sendMessage(chatId, `Вторым аргументом должен быть знак + или -`);
            }
        }
    }
    else if (messageMas[1] === 'getAllIngredients') {
        resRows = await askMySQL(bot, pool, `SELECT id, name, type, element, description FROM baseIngredients`, 543)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = "Список всех ингредиентов в базе:";
        if (messageMas.length > 2)
            resRows.forEach((item) => {
                mes = `${mes}\n${item.id}."${item.name}" (${item.type} ${item.element}) ${item.description}`;
            });
        else
            resRows.forEach((item) => {
                mes = `${mes}\n${item.id}."${item.name}" (${item.type} ${item.element})`;
            });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'getCharacterInventory') {
        if (messageMas.length < 3) return bot.sendMessage(chatId, `Нужно ввести имя персонажа в команде`);
        resRows = await askMySQL(bot, pool, `SELECT id, silver FROM characters WHERE name = "${messageMas[2]}"`, 544)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет персонажа с именем ${messageMas[2]}`);
        const idCustom = Number(resRows[0]?.id);
        const silver = Number(resRows[0]?.silver);
        resRows = await askMySQL(bot, pool, `SELECT id, name, type, element, sum FROM characterIngredients JOIN baseIngredients ON id = idIngredient WHERE idCharacter = ${idCustom}  AND sum != 0`, 545)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = `Инвентарь персонажа ${messageMas[2]}:\nсеребро ${silver}`;
        resRows.forEach((item) => {
            mes = `${mes}\n${item.id}.${item.name} (${item.type}, ${item.element}) ${item.sum}`;
        });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'getAllrecipes') {
        resRows = await askMySQL(bot, pool, `SELECT baseRecipes.id as id, baseRecipes.name as name, baseRecipes.description as des, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingrBase) as base, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr1) as ingr1, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr2) as ingr2, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr3) as ingr3, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr4) as ingr4, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr5) as ingr5, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingrKatal) as katal, (SELECT name FROM baseIngredients WHERE id = baseRecipes.result) as result  FROM baseRecipes`, 546)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = "Список всех рецептов в базе:";
        if (messageMas.length > 2)
            resRows.forEach((item) => {
                mes = `${mes}\n${item.id}."${item.name}" (основа: ${item.base} + ${item.ingr1}${item.ingr2 ? (` + ${item.ingr2}`) : ``}${item.ingr3 ? (` + ${item.ingr3}`) : ``}${item.ingr4 ? (` + ${item.ingr4}`) : ``}${item.ingr5 ? (` + ${item.ingr5}`) : ``} + катализатор: ${item.katal} = ${item.result}`;
            });
        else
            resRows.forEach((item) => {
                mes = `${mes}\n${item.id}."${item.name}" ${item.des}`;
            });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'getCharacterrecipes') {
        if (messageMas.length < 3) return bot.sendMessage(chatId, `Нужно ввести имя персонажа в команде`);
        resRows = await askMySQL(bot, pool, `SELECT id FROM characters WHERE name = "${messageMas[2]}"`, 547)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет персонажа с именем ${messageMas[2]}`);
        const idCustom = Number(resRows[0]?.id);
        resRows = await askMySQL(bot, pool, `SELECT characterRecipes.idRecipe as id, baseRecipes.name as name, baseRecipes.description as des, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingrBase) as base, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr1) as ingr1, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr2) as ingr2, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr3) as ingr3, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr4) as ingr4, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingr5) as ingr5, (SELECT name FROM baseIngredients WHERE id = baseRecipes.ingrKatal) as katal, (SELECT name FROM baseIngredients WHERE id = baseRecipes.result) as result FROM characterRecipes JOIN baseRecipes ON baseRecipes.id = characterRecipes.idRecipe WHERE characterRecipes.idCharacter = ${idCustom} `, 548)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = `Рецепты персонажа ${messageMas[2]}:`;
        if (messageMas.length > 3)
            resRows.forEach((item) => {
                mes = `${mes}\n${item.id}."${item.name}" (основа: ${item.base} + ${item.ingr1}${item.ingr2 ? (` + ${item.ingr2}`) : ``}${item.ingr3 ? (` + ${item.ingr3}`) : ``}${item.ingr4 ? (` + ${item.ingr4}`) : ``}${item.ingr5 ? (` + ${item.ingr5}`) : ``} + катализатор: ${item.katal} = ${item.result}`;
            });
        else
            resRows.forEach((item) => {
                mes = `${mes}\n${item.id}."${item.name}"`;
            });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'changeNameIngredient') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно имя id ингредиента и новое название ингредиента`);
        const idItem = Number(messageMas[2]);
        if (isNaN(idItem)) return bot.sendMessage(chatId, `Id предмета указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseIngredients WHERE id = ${idItem}`, 548)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет предмета с таким id`);
        const name = resRows[0]?.name;
        const new_name = messageMas.slice(3).join(' ');
        resRows = await askMySQL(bot, pool, `SELECT id FROM baseIngredients WHERE name = "${new_name}"`, 549)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]) return bot.sendMessage(chatId, `У нас уже есть ингредиент (id:${resRows[0]?.id}) с таким названием`);
        resRows = await askMySQL(bot, pool, `UPDATE baseIngredients SET name = "${new_name}" WHERE id = ${idItem}`, 550)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Предмет ${name} переименован в ${new_name}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, предмет не переименовали :(`);
    }
    else if (messageMas[1] === 'changeTypeIngredient') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно имя id ингредиента и новый тип предмета[основа, ингредиент, катализатор]`);
        const idItem = Number(messageMas[2]);
        if (isNaN(idItem)) return bot.sendMessage(chatId, `Id предмета указано неверно`);
        if (messageMas[3] != 'основа' && messageMas[3] != 'ингредиент' && messageMas[3] != 'катализатор') return bot.sendMessage(chatId, `Тип указан неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name, type FROM baseIngredients WHERE id = ${idItem}`, 551)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет предмета с таким id`);
        const nameItem = resRows[0].name;
        switch (resRows[0].type) {
            case 'основа': {
                resRows = await askMySQL(bot, pool, `SELECT id, name FROM baseRecipes WHERE ingrBase = ${idItem}`, 552)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                let mes = "Ингредиент уже используется в рецептах как основа:";
                resRows.forEach((item) => {
                    mes = `${mes}\n${item.id}."${item.name}"`;
                });
                if (resRows[0]) return bot.sendMessage(chatId, mes);
                break;
            }
            case 'ингредиент': {
                resRows = await askMySQL(bot, pool, `SELECT id, name FROM baseRecipes WHERE ingr1 = ${idItem} OR ingr2 = ${idItem} OR ingr3 = ${idItem} OR ingr4 = ${idItem} OR ingr5 = ${idItem}`, 553)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                let mes = "Ингредиент уже используется в рецептах как ингредиент:";
                resRows.forEach((item) => {
                    mes = `${mes}\n${item.id}."${item.name}"`;
                });
                if (resRows[0]) return bot.sendMessage(chatId, mes);
                break;
            }
            case 'катализатор': {
                resRows = await askMySQL(bot, pool, `SELECT id, name FROM baseRecipes WHERE ingrKatal = ${idItem}`, 554)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                let mes = "Ингредиент уже используется в рецептах как катализатор:";
                resRows.forEach((item) => {
                    mes = `${mes}\n${item.id}."${item.name}"`;
                });
                if (resRows[0]) return bot.sendMessage(chatId, mes);
                break;
            }
        }
        resRows = await askMySQL(bot, pool, `UPDATE baseIngredients SET type = ${messageMas[3]} WHERE id = ${idItem}`, 555)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Предмету ${nameItem} дали тип ${messageMas[3]}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, предмет не переделали :(`);
    }
    else if (messageMas[1] === 'changeElementIngredient') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно имя id ингредиента и новый элемент`);
        const idItem = Number(messageMas[2]);
        if (isNaN(idItem)) return bot.sendMessage(chatId, `Id предмета указано неверно`);
        if (messageMas[3] != 'свет' && messageMas[3] != 'вода' && messageMas[3] != 'земля' && messageMas[3] != 'тьма' && messageMas[3] != 'огонь' && messageMas[3] != 'воздух') return bot.sendMessage(chatId, `Элемент ${messageMas[3]} указан неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name, element FROM baseIngredients WHERE id = ${idItem}`, 556)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет предмета с таким id`);
        const nameItem = resRows[0]?.name;
        const elem = resRows[0]?.element;
        const idElement = getElementNumber(elem);
        resRows = await askMySQL(bot, pool, `SELECT DISTINCT (SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr1 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingrBase = ${idItem})) as 'qqq' UNION (SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr2 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr1 = ${idItem})) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr3 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr2 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr4 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr3 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr5 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr4 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingrKatal WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr5 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingrBase WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr1 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr1 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr2 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr2 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr3 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr3 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr4 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr4 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingr5 = ${idItem}) UNION SELECT DISTINCT element FROM baseRecipes JOIN baseIngredients ON baseIngredients.id = ingr5 WHERE baseRecipes.id IN (SELECT id FROM baseRecipes WHERE ingrKatal = ${idItem})`, 557)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let flag = false;
        resRows.forEach((item) => {
            const el = getElementNumber(item.qqq);
            const a = Math.abs(idElement - el);
            if (a === 3 || a === 0) flag = true;
        });
        if (flag) return bot.sendMessage(chatId, "Изменение элемента нарушает структуру рецепта");
        resRows = await askMySQL(bot, pool, `UPDATE baseIngredients SET element = ${messageMas[3]} WHERE id = ${idItem}`, 558)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Предмету ${nameItem} дали элемент ${messageMas[3]}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, предмет не переделали :(`);
    }
    else if (messageMas[1] === 'changeDescriptionIngredient') {
        if (messageMas.length < 3) return bot.sendMessage(chatId, `Нужно имя id ингредиента, примечание можно не ставить`);
        const idItem = Number(messageMas[2]);
        if (isNaN(idItem)) return bot.sendMessage(chatId, `Id предмета указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseIngredients WHERE id = ${idItem}`, 559)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет предмета с таким id`);
        const name = resRows[0]?.name;
        const description = messageMas.slice(3).join(' ');
        resRows = await askMySQL(bot, pool, `UPDATE baseIngredients SET description = "${description}" WHERE id = ${idItem}`, 560)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Ингредиенту ${name} дали новое описание: ${description}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, предмету не дали нового описания :(`);
    }
    else if (messageMas[1] === 'changeNamerecipe') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно имя id рецепта и новое название рецепта`);
        const idItem = Number(messageMas[2]);
        if (isNaN(idItem)) return bot.sendMessage(chatId, `Id рецепта указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseRecipes WHERE id = ${idItem}`, 561)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет рецепта с таким id`);
        const name = resRows[0]?.name;
        const new_name = messageMas.slice(3).join(' ');
        resRows = await askMySQL(bot, pool, `SELECT id FROM baseRecipes WHERE name = "${new_name}"`, 562)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]) return bot.sendMessage(chatId, `У нас уже есть рецепт (id:${resRows[0]?.id}) с таким названием`);
        resRows = await askMySQL(bot, pool, `UPDATE baseRecipes SET name = "${new_name}" WHERE id = ${idItem}`, 563)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Рецепт ${name} переименован в ${new_name}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, рецепт не переименовали :(`);
    }
    else if (messageMas[1] === 'changeDescriptionrecipe') {
        if (messageMas.length < 3) return bot.sendMessage(chatId, `Нужно имя id рецепта, описание можно не ставить`);
        const idItem = Number(messageMas[2]);
        if (isNaN(idItem)) return bot.sendMessage(chatId, `Id рецепта указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseRecipes WHERE id = ${idItem}`, 564)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет рецепта с таким id`);
        const name = resRows[0]?.name;
        const description = messageMas.slice(3).join(' ');
        resRows = await askMySQL(bot, pool, `UPDATE baseRecipes SET description = "${description}" WHERE id = ${idItem}`, 565)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Рецепту ${name} дали новое описание: ${description}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, рецепту не дали нового описания :(`);
    }
    else if (messageMas[1] === 'changeInRecipe') {
        if (messageMas.length < 6 || messageMas.length > 10) return bot.sendMessage(chatId, `Нужно id рецепта, id основы, id ингр1, [id ингр2], [id ингр3], [id ингр4], [id ингр5] и id катализатора`);
        const idRec = Number(messageMas[2]);
        if (isNaN(idRec)) return bot.sendMessage(chatId, `Id рецепта указано неверно ${messageMas[2]}`);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseRecipes WHERE id = ${idRec}`, 566)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет рецепта с id ${idRec}`);
        const nameRec = resRows[0]?.name;
        const kolvoIngr = messageMas.length - 3;
        const infoIngr = [];
        let lastElement = 98765;
        for (let i = 0; i < kolvoIngr; i++) {
            if (isNaN(Number(messageMas[3 + i]))) return bot.sendMessage(chatId, `Id ингредиента ${messageMas[3 + i]} указан неверно`);
            resRows = await askMySQL(bot, pool, `SELECT id, name, element as nameElement, type as nameType FROM baseIngredients WHERE id = ${Number(messageMas[3 + i])}`, 567)
            if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
            if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет предмета с id ${Number(messageMas[3 + i])}`);
            infoIngr[i] = resRows[0];
            if (i === 0 && infoIngr[0].nameType != 'основа') return bot.sendMessage(chatId, `У первого ингредиента тип должен быть основой:\n ${infoIngr[0].id}.${infoIngr[0].name} имеет тип ${infoIngr[0].nameType}`);
            else if (i === (kolvoIngr - 1) && infoIngr[i].nameType != 'катализатор') return bot.sendMessage(chatId, `У последнего ингредиента тип должен быть катализатором:\n ${infoIngr[i].id}.${infoIngr[i].name} имеет тип ${infoIngr[i].nameType}`);
            else if (i != (kolvoIngr - 1) && i != 0 && infoIngr[i].nameType != 'ингредиент') return bot.sendMessage(chatId, `У промежуточного ингредиента тип должен быть ингредиентом:\n ${infoIngr[i].id}.${infoIngr[i].name} имеет тип ${infoIngr[i].nameType}`);
            const el = getElementNumber(infoIngr[i].nameElement);
            const raz = Math.abs(lastElement - el);
            if (raz == 0 || raz == 3) return bot.sendMessage(chatId, `Неправильное смешение элементов:\n${infoIngr[i - 1].name} и ${infoIngr[i].name}\n${infoIngr[i - 1].nameElement} и ${infoIngr[i].nameElement}`);
            lastElement = el;
        }
        resRows = await askMySQL(bot, pool, `SELECT id, name FROM baseRecipes WHERE ingrBase = ${infoIngr[0].id} AND ingr1 = ${infoIngr[1].id} AND ingr2 = ${(kolvoIngr > 3) ? infoIngr[2].id : "NULL"} AND ingr3 = ${(kolvoIngr > 4) ? infoIngr[3].id : "NULL"} AND ingr4 = ${(kolvoIngr > 5) ? infoIngr[4].id : "NULL"} AND ingr5 = ${(kolvoIngr > 6) ? infoIngr[5].id : "NULL"} AND ingrKatal = ${infoIngr[kolvoIngr - 1].id}`, 568)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]) return bot.sendMessage(chatId, `У нас уже есть рецепт (id:${resRows[0]?.id}, name:${resRows[0]?.name}) с таким составом`);
        resRows = await askMySQL(bot, pool, `UPDATE baseRecipes SET ingrBase = ${infoIngr[0].id}, ingr1 = ${infoIngr[1].id}, ingr2 = ${(kolvoIngr > 3) ? infoIngr[2].id : "NULL"}, ingr3 = ${(kolvoIngr > 4) ? infoIngr[3].id : "NULL"}, ingr4 = ${(kolvoIngr > 5) ? infoIngr[4].id : "NULL"}, ingr5 = ${(kolvoIngr > 6) ? infoIngr[5].id : "NULL"}, ingrKatal = ${infoIngr[kolvoIngr - 1].id} WHERE id = ${idRec}`, 569)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Рецепту ${nameRec} дан рецепт основа = ${infoIngr[0].name}, ингр = ${infoIngr[1].name}${kolvoIngr > 3 ? (" + " + infoIngr[2].name) : ""}${kolvoIngr > 4 ? (" + " + infoIngr[3].name) : ""}${kolvoIngr > 5 ? (" + " + infoIngr[4].name) : ""}${kolvoIngr > 6 ? (" + " + infoIngr[5].name) : ""}, катал = ${infoIngr[kolvoIngr - 1].name}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, рецепт не переделали :(`);
    }
    else if (messageMas[1] === 'changeItogrecipe') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно имя id рецепта, id предмета`);
        const idRec = Number(messageMas[2]);
        if (isNaN(idRec)) return bot.sendMessage(chatId, `Id рецепта указано неверно`);
        const idItem = Number(messageMas[3]);
        if (isNaN(idItem)) return bot.sendMessage(chatId, `Id итогового предмета указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseRecipes WHERE id = ${idRec}`, 570)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет рецепта с id ${idRec}`);
        const nameRec = resRows[0]?.name;
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseIngredients WHERE id = ${idItem}`, 571)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет ингредиента с id ${idItem}`);
        const nameItem = resRows[0]?.name;
        resRows = await askMySQL(bot, pool, `UPDATE baseRecipes SET result = "${idItem}" WHERE id = ${idRec}`, 572)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Рецепту ${nameRec} дали новый итог: ${nameItem}`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, рецепту не дали нового итога :(`);
    }
    else if (messageMas[1] === 'deleteRecipe') {
        if (messageMas.length < 3) return bot.sendMessage(chatId, `Нужно id рецепта`);
        const idRec = Number(messageMas[2]);
        if (isNaN(idRec)) return bot.sendMessage(chatId, `Id рецепта указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name FROM baseRecipes WHERE id = ${idRec}`, 573)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет рецепта с id ${idRec}`);
        const nameRec = resRows[0]?.name;
        resRows = await askMySQL(bot, pool, `UPDATE quests SET recipeRevord = (SELECT id FROM baseRecipes LIMIT 1) WHERE recipeRevord = ${idRec}`, 580)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        for (let i = 0; i < variables.Recipies.length; i++) {
            if (variables.Recipies[i] == idRec) await bot.sendMessage(chatId, `Рецепт используется для генерации квестов, удалите его от туда пожалуйста`)
        }
        resRows = await askMySQL(bot, pool, `DELETE FROM characterRecipes WHERE idRecipe = ${idRec}`, 575)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        resRows = await askMySQL(bot, pool, `DELETE FROM baseRecipes WHERE id = ${idRec}`, 576)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Рецепт с названием ${nameRec} удален`);
        else return bot.sendMessage(chatId, `Что-то пошло не так, рецепт не удалили :( 2`);
    }
    else if (messageMas[1] === 'addNewrecipe') {
        if (messageMas.length < 6 || messageMas.length > 10) return bot.sendMessage(chatId, `Нужно id основы, id ингр1, [id ингр2], [id ингр3], [id ингр4], [id ингр5], id катализатора и id результата`);
        const kolvoIngr = messageMas.length - 2;
        const infoIngr = [];
        let lastElement = 98765;
        for (let i = 0; i < kolvoIngr; i++) {
            if (isNaN(Number(messageMas[2 + i]))) return bot.sendMessage(chatId, `Id ингредиента ${messageMas[2 + i]} указан неверно`);
            resRows = await askMySQL(bot, pool, `SELECT id, name, element as nameElement, type as nameType FROM baseIngredients WHERE id = ${Number(messageMas[2 + i])}`, 577)
            if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
            if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет предмета с id ${Number(messageMas[2 + i])}`);
            infoIngr[i] = resRows[0];
            if (i === 0 && infoIngr[0].nameType != 'основа') return bot.sendMessage(chatId, `У первого ингредиента тип должен быть основой:\n ${infoIngr[0].id}.${infoIngr[0].name} имеет тип ${infoIngr[0].nameType}`);
            else if (i === (kolvoIngr - 2) && infoIngr[i].nameType != 'катализатор') return bot.sendMessage(chatId, `У последнего ингредиента тип должен быть катализатором:\n ${infoIngr[i].id}.${infoIngr[i].name} имеет тип ${infoIngr[i].nameType}`);
            else if (i != (kolvoIngr - 2) && i != (kolvoIngr - 1) && i != 0 && infoIngr[i].nameType != 'ингредиент') return bot.sendMessage(chatId, `У промежуточного ингредиента тип должен быть ингредиентом:\n ${infoIngr[i].id}.${infoIngr[i].name} имеет тип ${infoIngr[i].nameType}`);
            const el = getElementNumber(infoIngr[i].nameElement);
            const raz = Math.abs(lastElement - el);
            if ((i != kolvoIngr - 1) && (raz == 0 || raz == 3)) return bot.sendMessage(chatId, `Неправильное смешение элементов:\n${infoIngr[i - 1].name} и ${infoIngr[i].name}\n${infoIngr[i - 1].nameElement} и ${infoIngr[i].nameElement}`);
            lastElement = el;
        }
        resRows = await askMySQL(bot, pool, `SELECT id, name FROM baseRecipes WHERE ingrBase = ${infoIngr[0].id} AND ingr1 = ${infoIngr[1].id} AND ingr2 = ${(kolvoIngr > 3) ? infoIngr[2].id : "NULL"} AND ingr3 = ${(kolvoIngr > 4) ? infoIngr[3].id : "NULL"} AND ingr4 = ${(kolvoIngr > 5) ? infoIngr[4].id : "NULL"} AND ingr5 = ${(kolvoIngr > 6) ? infoIngr[5].id : "NULL"} AND ingrKatal = ${infoIngr[kolvoIngr - 2].id}`, 578)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]) return bot.sendMessage(chatId, `У нас уже есть рецепт (id:${resRows[0]?.id}, name:${resRows[0]?.name}) с таким составом`);
        resRows = await askMySQL(bot, pool, `INSERT INTO baseRecipes (name, description, ingrBase, ingr1, ingr2, ingr3, ingr4, ingr5, ingrKatal, result) values ("Новый рецепт","-",${infoIngr[0].id},${infoIngr[1].id},${(kolvoIngr > 3) ? infoIngr[2].id : "NULL"},${(kolvoIngr > 4) ? infoIngr[3].id : "NULL"},${(kolvoIngr > 5) ? infoIngr[4].id : "NULL"},${(kolvoIngr > 6) ? infoIngr[5].id : "NULL"},${infoIngr[kolvoIngr - 2].id},${infoIngr[kolvoIngr - 1].id})`, 579)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Создан рецепт основа = ${infoIngr[0].name}, ингр = ${infoIngr[1].name}${kolvoIngr > 4 ? (" + " + infoIngr[2].name) : ""}${kolvoIngr > 5 ? (" + " + infoIngr[3].name) : ""}${kolvoIngr > 6 ? (" + " + infoIngr[4].name) : ""}${kolvoIngr > 7 ? (" + " + infoIngr[5].name) : ""}, катал = ${infoIngr[kolvoIngr - 2].name} получаем ${infoIngr[kolvoIngr - 1].name}`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [[{ text: `Дать название рецепта`, switch_inline_query_current_chat: `/admin changeNamerecipe ${resRows.insertId} новое имя` }], [{ text: `Дать описание рецепта`, switch_inline_query_current_chat: `/admin changeDescriptionrecipe ${resRows.insertId} новое описание` }],] }) });
        else return bot.sendMessage(chatId, `Что-то пошло не так, рецепт не создали :(`);
    }
    else if (messageMas[1] === 'addNewIngredient') {
        if (messageMas.length < 5) return bot.sendMessage(chatId, `Нужно тип, элемент и имя ингредиента`);
        if (messageMas[2] != 'основа' && messageMas[2] != 'ингредиент' && messageMas[2] != 'катализатор') return bot.sendMessage(chatId, `Тип ${messageMas[2]} указан неверно`);
        if (messageMas[3] != 'свет' && messageMas[3] != 'вода' && messageMas[3] != 'земля' && messageMas[3] != 'тьма' && messageMas[3] != 'огонь' && messageMas[3] != 'воздух') return bot.sendMessage(chatId, `Элемент ${messageMas[3]} указан неверно`);
        const name = messageMas.slice(4).join(' ');
        resRows = await askMySQL(bot, pool, `SELECT id FROM baseIngredients WHERE name = "${name}"`, 584)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows[0]) return bot.sendMessage(chatId, `У нас уже есть ингредиент (id:${resRows[0]?.id}) с таким названием`);
        resRows = await askMySQL(bot, pool, `INSERT INTO baseIngredients (type, element, name) VALUES ("${messageMas[2]}", "${messageMas[3]}", "${name}");`, 585)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.affectedRows) return bot.sendMessage(chatId, `Добавлен ингредиент ${name} с типом ${messageMas[2]} и элементом ${messageMas[3]}`, { reply_markup: JSON.stringify({ remove_keyboard: true, inline_keyboard: [[{ text: `Дать описание ингредиента`, switch_inline_query_current_chat: `/admin changeDescriptionIngredient ${resRows.insertId} новое описание` }], [{ text: `Сменить название ингредиента`, switch_inline_query_current_chat: `/admin changeNameIngredient ${resRows.insertId} новое имя` }], [{ text: `Сменить тип ингредиента`, switch_inline_query_current_chat: `/admin changeTypeIngredient ${resRows.i1nsertId} новый_тип_предмета` }], [{ text: `Сменить элемент ингредиента`, switch_inline_query_current_chat: `/admin changeElementIngredient ${resRows.insertId} новый_элемент_предмета` }],] }) });
        else return bot.sendMessage(chatId, `Что-то пошло не так, ингредиент не добавили :(`);
    }
    else if (messageMas[1] === 'addNewQuest') {
        if (messageMas.length < 10) return bot.sendMessage(chatId, `Нужно ранг, длительность, серебро, опыт, - или id ингредиента, - или id рецепта, - или + ака необычный предмет и текст задания`);
        let rangNumber = -1;
        for (let rang of Object.keys(constants.Rang)) {
            if (constants.Rang[rang].name == messageMas[2]) {
                rangNumber = rang;
                break;
            }
        }
        if (rangNumber == -1) return bot.sendMessage(chatId, `В базе нет ранга ${messageMas[2]}`);
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Длительность не цифра`)
        if (Number(messageMas[3]) < 0) return bot.sendMessage(chatId, `Длительность отрицательное значени`)
        if (isNaN(Number(messageMas[4]))) return bot.sendMessage(chatId, `Серебро не цифра`)
        if (Number(messageMas[4]) < 0) return bot.sendMessage(chatId, `Серебро отрицательное значени`)
        if (isNaN(Number(messageMas[5]))) return bot.sendMessage(chatId, `Опыт не цифра`)
        if (Number(messageMas[4]) < 0) return bot.sendMessage(chatId, `Опыт отрицательное значени`)
        let ingrId = messageMas[6] == '-' ? false : true;
        if (ingrId) {
            if (isNaN(Number(messageMas[6]))) return bot.sendMessage(chatId, `id ингредиента не цифра`)
            else {
                ingrId = Number(messageMas[6])
                resRows = await askMySQL(bot, pool, `SELECT id from baseIngredients where id = ${ingrId}`, 601)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.length < 1) return bot.sendMessage(chatId, `id ингредиента ${ingrId} в базе данных нет`)
            }
        }
        let recipeId = messageMas[7] == '-' ? false : true;
        if (recipeId) {
            if (isNaN(Number(messageMas[7]))) return bot.sendMessage(chatId, `id рецепта не цифра`)
            else {
                recipeId = Number(messageMas[7])
                resRows = await askMySQL(bot, pool, `SELECT id from baseRecipes where id = ${recipeId}`, 602)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.length < 1) return bot.sendMessage(chatId, `id рецепта ${recipeId} в базе данных нет`)
            }
            if (ingrId) return bot.sendMessage(chatId, `Нельзя дать ингредиент и рецепт одновременно`)
        }
        let unusualItem = false;
        switch (messageMas[8]) {
            case '-':
                unusualItem = false;
                break;
            case '+':
                unusualItem = true;
                if (ingrId) return bot.sendMessage(chatId, `Нельзя дать ингредиент и необычный предмет одновременно`)
                if (recipeId) return bot.sendMessage(chatId, `Нельзя дать рецепт и необычный предмет одновременно`)
                break;
            default:
                return bot.sendMessage(chatId, `необычный предмет + или -`)
        }
        const text = messageMas.slice(9).join(' ');
        resRows = await askMySQL(bot, pool, `INSERT INTO quests (rang, dayToComplite, coinsRevord, xpRevord, itemRevord, recipeRevord, relicvRevord, whoGenerate, text) VALUES (${rangNumber}, ${Number(messageMas[3])}, ${Number(messageMas[4])}, ${Number(messageMas[5])}, ${ingrId ? ingrId : 'null'}, ${recipeId ? recipeId : 'null'}, ${unusualItem}, ${chatId}, "${text}");`, 599)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let questId = false;
        if (resRows.affectedRows) questId = resRows.insertId;
        else return bot.sendMessage(chatId, `Что-то пошло не так, квест не добавили :(`);
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord FROM quests where id = ${questId}`, 600)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `Добавлен квест\n${t}`, questAdmin ? undefined :
            {
                reply_markup: JSON.stringify({
                    remove_keyboard: true, inline_keyboard: [
                        [{ text: `сменить ранг квеста`, switch_inline_query_current_chat: `/admin setRangQuest ${questId} буква_ранга(Больш Англ)` }],
                        [{ text: `сменить длительность квеста`, switch_inline_query_current_chat: `/admin setLongQuest ${questId} колво_дней` }],
                        [{ text: `сменить деньги квеста`, switch_inline_query_current_chat: `/admin setMoneyQuest ${questId} колво_денег` }],
                        [{ text: `сменить опыт квеста`, switch_inline_query_current_chat: `/admin setXPQuest ${questId} колво_опыта` }],
                        [{ text: `сменить награду квеста`, switch_inline_query_current_chat: `/admin setDopQuest ${questId} -_или_id_ингредиента, -_или_id_рецепта, -_или_+_ака_необычный_предмент` }],
                        [{ text: `сменить текст квеста`, switch_inline_query_current_chat: `/admin setTextQuest ${questId} текст` }],
                    ]
                })
            });
    }
    else if (messageMas[1] === 'doubleQuest') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно id квеста`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        resRows = await askMySQL(bot, pool, `SELECT * FROM quests WHERE id = ${messageMas[2]}`, 602)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        resRows = await askMySQL(bot, pool, `INSERT INTO quests (rang, dayToComplite, coinsRevord, xpRevord, itemRevord, recipeRevord, relicvRevord, text) VALUES (${resRows[0].rang},${resRows[0].dayToComplite},${resRows[0].coinsRevord},${resRows[0].xpRevord},${resRows[0].itemRevord},${resRows[0].recipeRevord},${resRows[0].relicvRevord},"${resRows[0].text}");`, 599)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let questId = false;
        if (resRows.affectedRows) questId = resRows.insertId;
        else return bot.sendMessage(chatId, `Что-то пошло не так, квест не добавили :(`);
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord FROM quests where id = ${questId}`, 600)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `Добавлен квест\n${t}`, questAdmin ? undefined :
            {
                reply_markup: JSON.stringify({
                    remove_keyboard: true, inline_keyboard: [
                        [{ text: `сменить ранг квеста`, switch_inline_query_current_chat: `/admin setRangQuest ${questId} буква_ранга(Больш Англ)` }],
                        [{ text: `сменить длительность квеста`, switch_inline_query_current_chat: `/admin setLongQuest ${questId} колво_дней` }],
                        [{ text: `сменить деньги квеста`, switch_inline_query_current_chat: `/admin setMoneyQuest ${questId} колво_денег` }],
                        [{ text: `сменить опыт квеста`, switch_inline_query_current_chat: `/admin setXPQuest ${questId} колво_опыта` }],
                        [{ text: `сменить награду квеста`, switch_inline_query_current_chat: `/admin setDopQuest ${questId} -_или_id_ингредиента, -_или_id_рецепта, -_или_+_ака_необычный_предмент` }],
                        [{ text: `сменить текст квеста`, switch_inline_query_current_chat: `/admin setTextQuest ${questId} текст` }],
                    ]
                })
            });
    }
    else if (messageMas[1] === 'setRangQuest') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно id квеста и букву ранга большую английскую`);
        let rangNumber = -1;
        for (let rang of Object.keys(constants.Rang)) {
            if (constants.Rang[rang].name == messageMas[3]) {
                rangNumber = rang;
                break;
            }
        }
        if (rangNumber == -1) return bot.sendMessage(chatId, `В базе нет ранга ${messageMas[3]}`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        resRows = await askMySQL(bot, pool, `SELECT rang FROM quests WHERE id = ${messageMas[2]}`, 602)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        const oldRang = resRows[0].rang;
        resRows = await askMySQL(bot, pool, `UPDATE quests SET rang = ${rangNumber} WHERE id = ${messageMas[2]}`, 603)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord FROM quests where id = ${messageMas[2]}`, 604)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `Обновили ранг с ${constants.Rang[oldRang].name} на ${constants.Rang[resRows[0].rang].name}\n${t}`);
    }
    else if (messageMas[1] === 'setLongQuest') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно id квеста и цифру длительности в днях`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Длительность квеста не цифра`)
        if (Number(messageMas[3]) < 0) return bot.sendMessage(chatId, `Длительность отрицательное значени`)
        resRows = await askMySQL(bot, pool, `SELECT dayToComplite FROM quests WHERE id = ${messageMas[2]}`, 605)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        const oldDayToComplite = resRows[0].dayToComplite;
        resRows = await askMySQL(bot, pool, `UPDATE quests SET dayToComplite = ${Number(messageMas[3])} WHERE id = ${messageMas[2]}`, 606)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord FROM quests where id = ${messageMas[2]}`, 607)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `Обновили длительность с ${oldDayToComplite} на ${Number(messageMas[3])}\n${t}`);
    }
    else if (messageMas[1] === 'setMoneyQuest') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно id квеста и цифру денег`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Деньга квеста не цифра`)
        if (Number(messageMas[3]) < 0) return bot.sendMessage(chatId, `Деньга отрицательное значени`)
        resRows = await askMySQL(bot, pool, `SELECT coinsRevord FROM quests WHERE id = ${messageMas[2]}`, 608)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        const oldСoinsRevord = resRows[0].coinsRevord;
        resRows = await askMySQL(bot, pool, `UPDATE quests SET coinsRevord = ${Number(messageMas[3])} WHERE id = ${messageMas[2]}`, 609)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord FROM quests where id = ${messageMas[2]}`, 610)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `Обновили деньги с ${oldСoinsRevord} на ${Number(messageMas[3])}\n${t}`);
    }
    else if (messageMas[1] === 'setXPQuest') {
        if (messageMas.length != 4) return bot.sendMessage(chatId, `Нужно id квеста и цифру опыта`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `Опыт квеста не цифра`)
        if (Number(messageMas[3]) < 0) return bot.sendMessage(chatId, `Опыт отрицательное значени`)
        resRows = await askMySQL(bot, pool, `SELECT xpRevord FROM quests WHERE id = ${messageMas[2]}`, 611)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        const oldXpRevord = resRows[0].xpRevord;
        resRows = await askMySQL(bot, pool, `UPDATE quests SET xpRevord = ${Number(messageMas[3])} WHERE id = ${messageMas[2]}`, 612)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord FROM quests where id = ${messageMas[2]}`, 613)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `Обновили опыт с ${oldXpRevord} на ${Number(messageMas[3])}\n${t}`);
    }
    else if (messageMas[1] === 'setDopQuest') {
        if (messageMas.length != 6) return bot.sendMessage(chatId, `Нужно id квеста - или id ингредиента, - или id рецепта, - или + ака необычный предмет`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        let ingrId = messageMas[3] == '-' ? false : true;
        if (ingrId) {
            if (isNaN(Number(messageMas[3]))) return bot.sendMessage(chatId, `id ингредиента не цифра`)
            else {
                ingrId = Number(messageMas[3])
                resRows = await askMySQL(bot, pool, `SELECT id from baseIngredients where id = ${ingrId}`, 614)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.length < 1) return bot.sendMessage(chatId, `id ингредиента ${ingrId} в базе данных нет`)
            }
        }
        let recipeId = messageMas[4] == '-' ? false : true;
        if (recipeId) {
            if (isNaN(Number(messageMas[4]))) return bot.sendMessage(chatId, `id рецепта не цифра`)
            else {
                recipeId = Number(messageMas[4])
                resRows = await askMySQL(bot, pool, `SELECT id from baseRecipes where id = ${recipeId}`, 615)
                if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
                if (resRows.length < 1) return bot.sendMessage(chatId, `id рецепта ${recipeId} в базе данных нет`)
            }
            if (ingrId) return bot.sendMessage(chatId, `Нельзя дать ингредиент и рецепт одновременно`)
        }
        let unusualItem = false;
        switch (messageMas[5]) {
            case '-':
                unusualItem = false;
                break;
            case '+':
                unusualItem = true;
                if (ingrId) return bot.sendMessage(chatId, `Нельзя дать ингредиент и необычный предмет одновременно`)
                if (recipeId) return bot.sendMessage(chatId, `Нельзя дать рецепт и необычный предмет одновременно`)
                break;
            default:
                return bot.sendMessage(chatId, `необычный предмет + или -`)
        }
        resRows = await askMySQL(bot, pool, `SELECT xpRevord FROM quests WHERE id = ${messageMas[2]}`, 616)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        resRows = await askMySQL(bot, pool, `UPDATE quests SET itemRevord = ${ingrId ? ingrId : 'null'}, recipeRevord = ${recipeId ? recipeId : 'null'}, relicvRevord = ${unusualItem} WHERE id = ${messageMas[2]}`, 617)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord FROM quests where id = ${messageMas[2]}`, 617)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `Обновили квест\n${t}`);
    }
    else if (messageMas[1] === 'setTextQuest') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно id и новый текст задания`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        const text = messageMas.slice(3).join(' ');
        resRows = await askMySQL(bot, pool, `SELECT id FROM quests WHERE id = ${messageMas[2]}`, 618)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        resRows = await askMySQL(bot, pool, `UPDATE quests SET text = "${text}" WHERE id = ${messageMas[2]}`, 619)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord FROM quests where id = ${messageMas[2]}`, 620)
        if (resRows == -1) { await sendErrorToUser(bot, chatId); return -1; }
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `Обновили текст\n${t}`);
    }
    else if (messageMas[1] === 'getQuest') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно id`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        resRows = await askMySQL(bot, pool, `Select id, text, stat, rang, dayToComplite, dateStart, dateGenerate, whoGenerate, coinsRevord, xpRevord, itemRevord, (SELECT name from baseIngredients where baseIngredients.id = itemRevord) as itemName, recipeRevord, (SELECT name from baseRecipes where baseRecipes.id = recipeRevord) as recipeName, relicvRevord, customMake, (SELECT name FROM characters where id = customMake) as customName FROM quests where id = ${messageMas[2]}`, 620)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        const t = changeMyText(getMyText(`Тексты/Гильдия/Доска/Задание`), ['QuestId', 'TextQuest', 'RangName', 'DayToComplite', 'CoinsRevord', 'XPRevord', 'DopRevord', 'CustomMake'], [resRows[0].id, resRows[0].text, constants.Rang[resRows[0].rang].name, resRows[0].dayToComplite, resRows[0].coinsRevord, resRows[0].xpRevord, (resRows[0].itemRevord != null ? resRows[0].itemName : resRows[0].recipeRevord != null ? `рецепт ${resRows[0].recipeName}` : resRows[0].relicvRevord ? 'необычный предмет' : 'нет'), '']);
        return bot.sendMessage(chatId, `${t}\n stat: ${resRows[0].stat}\ndateStart: ${resRows[0].dateStart}\ndateGenerate: ${resRows[0].dateGenerate}\nwhoGenerate: ${chatId}\ncustomMake: ${resRows[0].customMake} (${resRows[0].customName})`);
    }
    else if (messageMas[1] === 'setDateStartQuest') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно id квеста`);
        if (isNaN(Number(messageMas[2]))) return bot.sendMessage(chatId, `id квеста не цифра`)
        resRows = await askMySQL(bot, pool, `SELECT customMake FROM quests WHERE id = ${messageMas[2]}`, 618)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет квеста с id ${messageMas[2]}`);
        const custom = resRows[0].customMake;
        resRows = await askMySQL(bot, pool, `UPDATE quests SET dateStart = '2000-01-20' WHERE id = ${messageMas[2]}`, 619)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, `Скипнули время выполнения квеста\n${custom == null ? "Но никто его не выполняет" : ""}`);
    }
    else if (messageMas[1] === 'sendMessageToCharacter') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно имя персонажа и сообщение`);
        resRows = await askMySQL(bot, pool, `SELECT characters.id as chId, users.id as userId, users.name as name FROM characters JOIN users ON users.id = host WHERE characters.name="${messageMas[2]}"`, 586)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет персонажа с именем ${messageMas[2]}`);
        await bot.sendMessage(resRows[0]?.userId, `ДЕМИУРГ ГОВОРИТ\nперсонажу ${messageMas[2]}:\n\n${messageMas.slice(3).join(' ')}`);
        return bot.sendMessage(chatId, `Отправили сообщение ${resRows[0]?.name}`);
    }
    else if (messageMas[1] === 'sendMessageToUser') {
        if (messageMas.length < 4) return bot.sendMessage(chatId, `Нужно имя пользователя и сообщение`);
        resRows = await askMySQL(bot, pool, `SELECT id, name FROM users WHERE name="${messageMas[2]}"`, 586)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет пользователя с именем ${messageMas[2]}`);
        await bot.sendMessage(resRows[0]?.id, `СООБЩЕНИЕ ОТ ДМА\n\n${messageMas.slice(3).join(' ')}`);
        return bot.sendMessage(chatId, `Отправили сообщение ${resRows[0]?.name}`);
    }
    else if (messageMas[1] === 'changeMarketItem') {
        if (messageMas.length != 5) return bot.sendMessage(chatId, `Нужно id предмета, знак[+,-] и количество предметов`);
        let kolvo = Number(messageMas[4]);
        const idItem = Number(messageMas[2]);
        if (isNaN(kolvo)) return bot.sendMessage(chatId, `Количество указано неверно`);
        resRows = await askMySQL(bot, pool, `SELECT name, market FROM baseIngredients WHERE id = ${idItem}`, 532)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (!resRows[0]) return bot.sendMessage(chatId, `У нас нет ингредиента с id ${idItem}`);
        const nameItem = resRows[0]?.name;
        const marketItem = resRows[0]?.market;
        if (messageMas[3][0] === '-') {
            if (marketItem < kolvo) kolvo = marketItem;
            resRows = await askMySQL(bot, pool, `UPDATE baseIngredients SET market = ${marketItem - kolvo} WHERE id = ${idItem}`, 534)
            if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
            if (resRows.affectedRows) return bot.sendMessage(chatId, `Убрали с рынка ${kolvo} ${nameItem}, теперь на рынке ${marketItem - kolvo} ${nameItem}`);
            else return bot.sendMessage(chatId, `Что-то пошло не так, не убрали предмет с рынка`);
        } else if (messageMas[3][0] === '+') {
            resRows = await askMySQL(bot, pool, `UPDATE baseIngredients SET market = ${marketItem + kolvo} WHERE id = ${idItem}`, 535)
            if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
            if (resRows.affectedRows) return bot.sendMessage(chatId, `Добавили на рынок ${kolvo} ${nameItem}, теперь на рынке ${marketItem + kolvo} ${nameItem}`);
            else return bot.sendMessage(chatId, `Что-то пошло не так, не добавили предмет на рынок`);
        } else {
            return bot.sendMessage(chatId, `Вторым аргументом должен быть знак + или -`);
        }
    }
    else if (messageMas[1] === 'getMarketItems') {
        resRows = await askMySQL(bot, pool, `SELECT id, name, market, cost FROM baseIngredients WHERE market != 0`, 545)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        let mes = `Наш рынок:`;
        resRows.forEach((item) => {
            mes = `${mes}\n${item.id}.${item.name} - ${item.cost} серебра (${item.market} штук) `;
        });
        return bot.sendMessage(chatId, mes);
    }
    else if (messageMas[1] === 'setNullFarmCharacter') {
        if (messageMas.length != 3) return bot.sendMessage(chatId, `Нужно имя персонажа`);
        resRows = await askMySQL(bot, pool, `SELECT location FROM characters WHERE name = "${messageMas[2]}"`, 587)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        if (resRows.length < 1) return bot.sendMessage(chatId, `Нет персонажа с никнеймом ${messageMas[2]}`);
        const location = resRows[0].location;
        resRows = await askMySQL(bot, pool, `UPDATE characters SET characterTimer = SYSDATE() WHERE name = "${messageMas[2]}"`, 587)
        if (resRows == -1) return bot.sendMessage(chatId, `Ошибка в бд`)
        return bot.sendMessage(chatId, `Сбросили время фарма персонажу ${location == 'Фарминг' ? '' : '. Но персонаж и так ничего не фармил'}`);
    }
    else {
        return bot.sendMessage(chatId, `Нет такой команды`);
    }
}

export default adminCommands;