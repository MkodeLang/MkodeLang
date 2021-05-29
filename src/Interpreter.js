import KodeError from "./Error.js"

export default class Interpreter {
  interpret (expression) {
    try {
      const value = this.evaluate(expression)
      console.log(value)
    } catch (e) {
      KodeError.error(e)
    }
  }

  visitLiteralExpr (expr) {
    return expr.value
  }

  visitGroupingExpr (expr) {
    return this.evaluate(expr.expression)
  }

  visitUnaryExpr (expr) {
    const right = this.evaluate(expr.right)

    switch (expr.operator.type) {
      case "BANG":
        return !this.isTruthy(right)
      case "MINUS":
        this.checkNumber(expr.operator, right)
        return -right
    }
  }

  visitBinaryExpr (expr) {
    const right = this.evaluate(expr.right),
    left = this.evaluate(expr.left)

    switch (expr.operator.type) {
      case "MINUS":
        return parseFloat(left) - parseFloat(right)
      case "PLUS":
        return parseFloat(left) + parseFloat(right)
      case "STAR":
        if (typeof left === "string")
          return left.repeat(right)
        return parseFloat(left) * parseFloat(right)
      case "SLASH":
        return parseFloat(left) / parseFloat(right)
      // Relational Operators
      case "GREATER":
        return this.toNum(left) > this.toNum(right)
      case "GREATER_EQUAL":
        return this.toNum(left) >= this.toNum(right)
      case "LESS":
        return this.toNum(left) < this.toNum(right)
      case "LESS_EQUAL":
        return this.toNum(left) <= this.toNum(right)
      // Equality
      case "BANG_EQUAL":
        return !this.isEqual(left, right)
      case "EQUAL_EQUAL":
        return this.isEqual(left, right)
    }
  }

  evaluate (expr) {
    return expr.accept(this)
  }

  toNum (data) {
    return parseFloat(data)
  }

  isTruthy (expr) {
    if (expr)
      return true
    return false
  }

  isEqual (left, right) {
    return left === right
  }

  checkNumber (operator, operand) {
    if (typeof operand === "number")
      return
    throw new Return(operator, "Operand must be a number.")
  }
}

class RuntimeError extends Error {
  constructor (token, message) {
    super(message)
    this.token = token
  }
}

class Return extends RuntimeError {
  constructor (token, message) {
    super(token, message)
    this.token = token
  }
}
