import fs from "fs";

export const changeMyText = (text, textForChange, textToChange) => {
    let newText = text;
    for (let i = 0; i < textForChange.length; i++) {
        let a = newText.indexOf(textForChange[i]);
        while (a != -1) { newText = newText.slice(0, a) + textToChange[i] + newText.slice(a + textForChange[i].length); a = newText.indexOf(textForChange[i]); }
    }
    return newText;
};
export const getMyText = (fileName, addTXT = true) => {
    let myText = "FileUnload";
    try { myText = fs.readFileSync(`./Кастомные штуки/${fileName}${addTXT ? ".txt" : ""}`, "utf8"); } catch (err) { console.log("Фигня с файлом", err.message) }
    return myText;
};
