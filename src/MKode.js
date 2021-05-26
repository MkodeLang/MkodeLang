import Lexer from "./Lexer.js"
import fs from "fs"

const source = fs.readFileSync("../test.kode").toString()
const code = new Lexer(source)

console.log(code.lex())
