import Token from "./Token.js"

const Errors = {
  error: function (line, column, message) {
    if (line instanceof Token) {
      if (line.type === "EOF")
        this.report(line.line, 0, " at end", message)
      else
        this.report(line.line, 0, " at '" + line.lexeme + "'", message)
    } else
      this.report(line, column - 1, "", message)
  },

  report: function (line, column, where, message) {
    console.log(`Error at line ${line}:${column} ${where} - ${message}`)
  },
}

export default Errors
