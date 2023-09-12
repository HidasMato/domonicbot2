import { adminsGetError } from "./sendErrorMessage.js";

const askMySQL = async (bot, pool, text, erCode = 0) => {
    const res = await pool.execute(text).catch((err) => { console.log(`ERROR askMySQL ${erCode}\n${text}\n: `, err.message); });
    if (!res && !res?.[0]) {
        await adminsGetError(bot, `Ошибка в запросе askMySQL ${erCode}\n${text}`);
        return -1;
    }
    return res[0];
}

export default askMySQL; 