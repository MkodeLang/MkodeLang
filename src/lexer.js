// This one recieves uncommented code
let lexer = (code) => {
    var codeLength = code.length, store = '', doubleQuoteFlag = false, singleQuoteFlag = false, tokenStream = [];
    var opFirstChars = ['=','+','-','*','/','%','&','|','!','~','>','<',';',':',',','[',']','{','}','==','===','!=','!==','++','--','<<','>>','<=>','<=','>=','(',')','><'];
    for (i = 0; i < codeLength; i++) {
        if (singleQuoteFlag||doubleQuoteFlag) {
            store += code[i];
            if (singleQuoteFlag && code[i] === '\'' && code[i-1] !== '\\') {
                if (store !== '') tokenStream.push(store);
                store = '';
                singleQuoteFlag = false;
            } else if (doubleQuoteFlag && code[i] === '\"' && code[i-1] !== '\\') {
                if (store !== '') tokenStream.push(store);
                store = '';
                doubleQuoteFlag = false;
            }
        } else {
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
            } else if (code[i] === '\''||code[i] === '\"') {
                if (code[i] === '\'') {
                    singleQuoteFlag = true;

                    if (store !== '') tokenStream.push(store);
                    store = "\'";
                } else {
                    doubleQuoteFlag = true;

                    if (store !== '') tokenStream.push(store);
                    store = "\"";
                }

            } else if (code[i] === ' ' || code[i] === ' ') {
                if (store !== '') tokenStream.push(store);
                store = '';
            } else {
                store += code[i];
            }
        }
    }
    if (store !== '') tokenStream.push(store);
    return tokenStream;
}

console.log(lexer(
    'attach "stdlib.kode"; person {constructer (age, name){ this.age = age; this.name = name; } addFriends (name) { this.friends.push(name); }} assign me = new person(15, "Mridutpal"); me.addFriends("Snehardra"); log me; assign a = 15 <=>this><"string"*2+ ++b;'
    ).slice());

// node src/lexer.js