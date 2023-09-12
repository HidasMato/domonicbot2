import { createPool } from "mysql2";
import askMySQL from "./askMySQL.js";

const mySQLInit = async (bot, inf) => {
    const startPool = createPool({ connectionLimit: 1, host: "localhost", user: inf.login, password: inf.pass }).promise();
    let res = await askMySQL(bot, startPool, `CREATE DATABASE IF NOT EXISTS ${inf.bd}`, 1);
    if (res == -1) return -1;
    else if (res.warningStatus != 1) console.log(`База данных '${inf.bd}' создана`);
    else console.log(`База данных '${inf.bd}' уже существует`)
    if (await askMySQL(bot, startPool, `SET SESSION sql_mode='NO_AUTO_VALUE_ON_ZERO'`, 2) == -1) return -2;
    startPool.end((err) => { if (err) { return -3; } });
    const pool = createPool({ connectionLimit: 1, host: "localhost", user: inf.login, password: inf.pass, database: inf.bd }).promise();
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS baseIngredients ( id int PRIMARY KEY AUTO_INCREMENT, name varchar(70) unique NOT NULL, type ENUM('основа', 'ингредиент', 'катализатор') NOT NULL, element ENUM('свет','вода','земля','тьма','огонь','воздух') NOT NULL, description varchar(500) DEFAULT("") NOT NULL, cost int default (100), market int default(0) NOT NULL );`, 4);
    if (res == -1) return -4;
    else if (res.warningStatus != 1) {
        console.log(`Таблица 'baseIngredients' создана`);
        if (await askMySQL(bot, pool, `INSERT INTO baseIngredients (id,name,type,element,description,cost) VALUES (10000,'эфир','основа','свет','основной ингредиент с элементом свет',100),(10100,'вода','основа','вода','основной ингредиент с элементом вода',100),(10200,'масло','основа','земля','основной ингредиент с элементом земля',100),(10300,'войд','основа','тьма','основной ингредиент с элементом тьма',100),(10400,'спирт','основа','огонь','основной ингредиент с элементом огонь',100),(10500,'алкогест','основа','воздух','основной ингредиент с элементом воздух',100),(1,'белый спирт','ингредиент','свет','',100),(2,'белый кристалл','ингредиент','свет','',100),(3,'белый прах','ингредиент','свет','',100),(5,'белый газ','ингредиент','свет','',100),(6,'белый фграгмент','ингредиент','свет','',100),(7,'черный спирт','ингредиент','тьма','',100),(8,'черный оксид','ингредиент','тьма','',100),(9,'черный кристалл','ингредиент','тьма','',100),(10,'черный прах','ингредиент','тьма','',100),(11,'черный газ','ингредиент','тьма','',100),(12,'черный фграгмент','ингредиент','тьма','',100),(13,'зеленый спирт','ингредиент','земля','',100),(14,'зеленый оксид','ингредиент','земля','',100),(15,'зеленый кристалл','ингредиент','земля','',100),(16,'зеленый прах','ингредиент','земля','',100),(17,'зеленый газ','ингредиент','земля','',100),(18,'зеленый фграгмент','ингредиент','земля','',100),(19,'красный спирт','ингредиент','огонь','',100),(20,'красный оксид','ингредиент','огонь','',100),(21,'красный кристалл','ингредиент','огонь','',100),(22,'красный прах','ингредиент','огонь','',100),(23,'красный газ','ингредиент','огонь','',100),(24,'красный фграгмент','ингредиент','огонь','',100),(25,'синий оксид','ингредиент','вода','',100),(26,'синий спирт','ингредиент','вода','',100),(27,'синий кристалл','ингредиент','вода','',100),(28,'синий прах','ингредиент','вода','',100),(29,'синий газ','ингредиент','вода','',100),(30,'синий фграгмент','ингредиент','вода','',100),(31,'желтый оксид','ингредиент','воздух','',100),(32,'желтый спирт','ингредиент','воздух','',100),(33,'желтый кристалл','ингредиент','воздух','',100),(34,'желтый прах','ингредиент','воздух','',100),(35,'желтый газ','ингредиент','воздух','',100),(36,'желтый фграгмент','ингредиент','воздух','',100),(37,'брюшко светлечка','ингредиент','свет','',10),(38,'яркоростник','ингредиент','свет','',500),(39,'сияющий гриб','ингредиент','свет','',2000),(40,'топаз','ингредиент','свет','',10000),(41,'сущность яркости','ингредиент','свет','',50000),(42,'ослепший глаз','ингредиент','тьма','',10),(43,'тенелист','ингредиент','тьма','',500),(44,'черная желчь','ингредиент','тьма','',2000),(45,'аметист','ингредиент','тьма','',10000),(46,'часть пустоты','ингредиент','тьма','',50000)`, 14) == -1) return -5;
        if (await askMySQL(bot, pool, `INSERT INTO baseIngredients (id,name,type,element,description,cost) VALUES (47,'когти крота','ингредиент','земля','',10),(48,'корнехват','ингредиент','земля','',500),(49,'трипобег','ингредиент','земля','',2000),(50,'изумруд','ингредиент','земля','',10000),(51,'первичное семя','ингредиент','земля','',50000),(52,'одуванчик','ингредиент','воздух','',10),(53,'пятилистная  сакура','ингредиент','воздух','',500),(54,'первый выдох','ингредиент','воздух','',2000),(55,'алмаз','ингредиент','воздух','',10000),(56,'лоскут ветра','ингредиент','воздух','',50000),(57,'последний уголь','ингредиент','огонь','',10),(58,'огнецвет','ингредиент','огонь','',500),(59,'сердце саламандра','ингредиент','огонь','',2000),(60,'рубин','ингредиент','огонь','',10000),(61,'пламенная кровь','ингредиент','огонь','',50000),(62,'мясо молюска','ингредиент','вода','',10),(63,'кувшинка соцветия','ингредиент','вода','',500),(64,'жемчуг','ингредиент','вода','',2000),(65,'сапфир','ингредиент','вода','',10000),(66,'сердце моря','ингредиент','вода','',50000),(1002,'подорожник','катализатор','земля','Великое целебное растение',100),(111111,'Зелье лечения','ингредиент','свет','Восстанавливает 2к4+2 хитов',500),(111112,'Большое зелье лечения','ингредиент','свет','Восстанавливает 4к4+4 хитов',1000),(111113,'Отличное зелье лечения','ингредиент','свет','Восстанавливает 8к4+8 хитов',5000),(111114,'Превосходное зелье лечения','ингредиент','свет','Восстанавливает 10к4+20 хитов',50000)`, 14) == -1) return -6;
        console.log(`Таблица 'baseIngredients' заполнена дефолтными значениями`);
    }
    else console.log(`Таблица 'baseIngredients' уже существует`);
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS baseRecipes( id int PRIMARY KEY AUTO_INCREMENT, name varchar(70) DEFAULT("Предложи свое название рецепта") NOT NULL, description varchar(500) DEFAULT("") NOT NULL, ingrBase int NOT NULL, ingr1 int NOT NULL, ingr2 int, ingr3 int, ingr4 int, ingr5 int, ingrKatal int NOT NULL, result int,  canSearch boolean default(true), FOREIGN KEY (ingrBase) REFERENCES baseIngredients (id), FOREIGN KEY (ingr1) REFERENCES baseIngredients (id), FOREIGN KEY (ingr2) REFERENCES baseIngredients (id), FOREIGN KEY (ingr3) REFERENCES baseIngredients (id), FOREIGN KEY (ingr4) REFERENCES baseIngredients (id), FOREIGN KEY (ingr5) REFERENCES baseIngredients (id), FOREIGN KEY (result) REFERENCES baseIngredients (id) );`, 5);
    if (res == -1) return -7;
    else if (res.warningStatus != 1) {
        console.log(`Таблица 'baseRecipes' создана`);
        if (await askMySQL(bot, pool, `INSERT INTO baseRecipes (id,name,description,ingrBase,ingr1,ingr2,ingr3,ingr4,ingr5,ingrKatal,result,canSearch) VALUES  (5000,'Зелье лечения','Восстанавливает 2к4+2 хитов',10100,47,57,37,62,42,1002,111111,1), (5001,'Большое зелье лечения','Восстанавливает 4к4+4 хитов',10100,42,62,53,37,47,1002,111112,1), (5002,'Отличное зелье лечения','Восстанавливает 8к4+8 хитов',10100,111111,48,111111,63,48,1002,111113,1), (5003,'Превосходное Зелье лечения','Восстанавливает 10к4+20 хитов',10100,39,60,53,43,65,1002,111114,1);`, 15) == -1) return -8;
        console.log(`Таблица 'baseRecipes' заполнена дефолтными значениями`);
    }
    else console.log(`Таблица 'baseRecipes' уже существует`);
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS guests ( id int PRIMARY KEY, firstName varchar(50) NOT NULL, lastName varchar(50) NOT NULL, userName varchar(50) NOT NULL, firstTime datetime );`, 6);
    if (res == -1) return -9;
    else if (res.warningStatus != 1) console.log(`Таблица 'guests' создана`);
    else console.log(`Таблица 'guests' уже существует`)
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS users ( id int PRIMARY KEY, name varchar(50) unique NOT NULL, activeCharacter int DEFAULT(NULL), prim varchar(500) DEFAULT("") NOT NULL );`, 7);
    if (res == -1) return -10;
    else if (res.warningStatus != 1) {
        console.log(`Таблица 'users' создана`);
        if (await askMySQL(bot, pool, `INSERT INTO users (id, name, prim) VALUES (0, "Смертники", "Сюда перемещаются персонажи, которые умерли");`, 13) == -1) return -11;
        console.log(`Таблица 'users' заполнена дефолтными значениями`);
    }
    else console.log(`Таблица 'users' уже существует`);
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS characters ( id int auto_increment PRIMARY KEY, host int, name varchar(50) UNIQUE NOT NULL, silver int DEFAULT(0) NOT NULL, location varchar(50) default("Городская площадь") not null, dopState1 int not null DEFAULT(0), dopState2 int not null DEFAULT(0), dopState3 int not null DEFAULT(0), sienceLevel int DEFAULT(0), sienceTimer DATETIME default(SYSDATE()), needGiverecipe boolean default(false), rang int default(0) not null, living int default(0) not null, characterTimer DATETIME default(SYSDATE()), FOREIGN KEY (host) REFERENCES users (id) );`, 8)
    if (res == -1) return -12;
    else if (res.warningStatus != 1) console.log(`Таблица 'characters' создана`);
    else console.log(`Таблица 'characters' уже существует`)
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS characterPots( idCharacter int, idPot int, ingrBase int, ingr1 int, ingr2 int, ingr3 int, ingr4 int, ingr5 int, ingrKatal int, timeToReady datetime default(SYSDATE()), isBreak boolean default(true), levelUpgrade int default(0), FOREIGN KEY (ingrBase) REFERENCES baseIngredients (id), FOREIGN KEY (ingr1) REFERENCES baseIngredients (id), FOREIGN KEY (ingr2) REFERENCES baseIngredients (id), FOREIGN KEY (ingr3) REFERENCES baseIngredients (id), FOREIGN KEY (ingr4) REFERENCES baseIngredients (id), FOREIGN KEY (ingr5) REFERENCES baseIngredients (id), FOREIGN KEY (ingrKatal) REFERENCES baseIngredients (id), FOREIGN KEY (idCharacter) REFERENCES characters (id), PRIMARY KEY(idCharacter, idPot) );`, 9);
    if (res == -1) return -13;
    else if (res.warningStatus != 1) console.log(`Таблица 'characterPots' создана`);
    else console.log(`Таблица 'characterPots' уже существует`)
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS characterIngredients( idCharacter int, idIngredient int, sum int,  FOREIGN KEY (idCharacter) REFERENCES characters (id), FOREIGN KEY (idIngredient) REFERENCES baseIngredients (id), PRIMARY KEY(idCharacter, idIngredient) );`, 10);
    if (res == -1) return -14;
    else if (res.warningStatus != 1) console.log(`Таблица 'characterIngredients' создана`);
    else console.log(`Таблица 'characterIngredients' уже существует`)
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS characterRecipes( idCharacter int, idRecipe int, FOREIGN KEY (idCharacter) REFERENCES characters (id), FOREIGN KEY (idRecipe) REFERENCES baseRecipes (id), PRIMARY KEY(idCharacter, idRecipe) );`, 11);
    if (res == -1) return -15;
    else if (res.warningStatus != 1) console.log(`Таблица 'characterRecipes' создана`);
    else console.log(`Таблица 'characterRecipes' уже существует`)
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS quests( id int auto_increment PRIMARY KEY, text varchar(1000), rang int default(0) not null, dateGenerate date default(CURDATE()) not Null, whoGenerate int default(-1) not Null, dateStart date, dayToComplite int default(4), coinsRevord int default(0), xpRevord int default(0), relicvRevord boolean default(false), itemRevord int default(null), recipeRevord int default(null), customMake int default(null), stat int default(0) not null, FOREIGN KEY (customMake) REFERENCES characters (id), FOREIGN KEY (itemRevord) REFERENCES baseIngredients (id), FOREIGN KEY (recipeRevord) REFERENCES baseRecipes (id) );`, 12);
    if (res == -1) return -16;
    else if (res.warningStatus != 1) console.log(`Таблица 'quests' создана`);
    else console.log(`Таблица 'quests' уже существует`)
    res = await askMySQL(bot, pool, `CREATE TABLE IF NOT EXISTS chanceToItem( dopState1 int, dopState2 int, idIngredient int, chance int default(0),  FOREIGN KEY (idIngredient) REFERENCES baseIngredients (id), PRIMARY KEY(dopState1, dopState2, idIngredient) );`, 13);
    if (res == -1) return -17;
    else if (res.warningStatus != 1) console.log(`Таблица 'chanceToItem' создана`);
    else console.log(`Таблица 'chanceToItem' уже существует`)
    pool.end((err) => { if (err) { CL("ERROR BD: ", err.message); return -18; } });
    return 0;
}

export default mySQLInit;