// This function recieves uncommented code and lexes it. Returns js:array
let lexer = (code) => {
    var codeLength = code.length /* stores the code length for faster runtime.*/, store = ''/* stores characters and acts as a buffer */, doubleQuoteFlag = false, singleQuoteFlag = false /* Boolean flags to check if the present character is inside a string */, tokenStream = [];// Array to store the tokens
    // List containing all seperators
    var opFirstChars = ['=','+','-','*','/','%','&','|','!','~','>','<',';',':',',','[',']','{','}','==','===','!=','!==','++','--','<<','>>','<=>','<=','>=','(',')','><','**','??'];
    // for loop running through the whole "code string"
    for (i = 0; i < codeLength; i++) {
        if (singleQuoteFlag||doubleQuoteFlag) { // checks if the present character is inside a string. If it is, it ignores all the rules.
            store += code[i]; // and adds the character to the storage buffer
            // The following code checks if the string has been ended
            if (singleQuoteFlag && code[i] === '\'' && code[i-1] !== '\\') {
                if (store !== '') tokenStream.push(store);
                store = '';
                singleQuoteFlag = false;
            } else if (doubleQuoteFlag && code[i] === '\"' && code[i-1] !== '\\') {
                if (store !== '') tokenStream.push(store);
                store = '';
                doubleQuoteFlag = false;
            }
        } else { // if the present character is not inside string
            // The first three conditions checks if any seperators (from opFirstChars) starts at i or not (length 3-1)
            if (opFirstChars.includes(code.substring(i, i+3))) {
                if (store !== '') tokenStream.push(store);
                store = '';
                tokenStream.push(code.substring(i, i+3));
                i += 2;
            } else if (opFirstChars.includes(code.substring(i, i+2))) {
                if (store !== '') tokenStream.push(store);
                tokenStream.push(code.substring(i, i+2));
                store = '';
                i++;
            } else if (opFirstChars.includes(code[i])) {
                if (store !== '') tokenStream.push(store);
                store = '';
                tokenStream.push(code.substring(i, i+1));
            } else if (code[i] === '\''||code[i] === '\"') { // Checks if new string has been started
                if (code[i] === '\'') {
                    singleQuoteFlag = true;

                    if (store !== '') tokenStream.push(store);
                    store = "\'";
                } else {
                    doubleQuoteFlag = true;

                    if (store !== '') tokenStream.push(store);
                    store = "\"";
                }

            } else if (code[i] === ' ' || code[i] === ' ' || (code[i] === '/n')) { // Checks for <space> or <tab> or <newline> seperators
                if (store !== '') tokenStream.push(store);
                store = '';
            } else { // if no conditions apply, the present character is added to the storage buffer
                store += code[i];
            }
        }
    }
    if (store !== '') tokenStream.push(store); // Cleans the storage buffer
    return tokenStream; // Returns token array
}