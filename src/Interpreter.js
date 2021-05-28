export default class Interpreter {
  visitLiteralExpr (expr) {
    return expr.value
  }

  visitGroupingExpr (expr) {
    return this.evaluate(expr.expression)
  }

  visitUnaryExpr (expr) {
    const right = this.evaluate(expr.right)

    switch (expr.operator.type) {
      case "MINUS":
        return -right
    }
  }

  evaluate (expr) {
    return expr.accept(this)
  }
}
