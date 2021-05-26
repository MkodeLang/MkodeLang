const Errors = {
  panic: function (line, column, message) {
    this.report(line, column - 1, "", message)
  },

  report: function (line, column, where, message) {
    console.log(`Error at line ${line}:${column} - ${message}`)
  },
}

export default Errors
