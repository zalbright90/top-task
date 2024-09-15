export class Project {
    constructor(name) {
      this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      this.name = name;
      this.todos = [];
    }
  
    addTodo(todo) {
      this.todos.push(todo);
    }
  
    removeTodo(todoId) {
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
  
    getTodoById(todoId) {
      return this.todos.find(todo => todo.id === todoId);
    }
  
    updateTodo(todoId, updates) {
      const todo = this.getTodoById(todoId);
      if (todo) {
        Object.assign(todo, updates);
      }
    }
  
    sortTodos(sortBy = 'dueDate') {
      this.todos.sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
      });
    }
}