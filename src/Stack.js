// Stack to store deleted tasks during the session
export default class Stack{
    constructor() {
        this.items = []
    }

    push(item) {
        this.items.push(item)
    }

    pop() {
        return this.items.pop();
    }

    getSize() {
        return this.items.length
    }
}