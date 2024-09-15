import { Todo } from './Todo';
import { Project } from './Project';

export class appLogic {
    constuctor() {
        this.projects = [new Project('Default')];
    }

    createProject(name) {
        this.projects.push(project);
        return project;
    }

    createTodo(title, description, dueDate, priority, projectId) {
        const todo = new Todo(title, description, dueDate, priority, projectId);
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.todos.push(todo);
        }
        return todo;
    }

    getTodoById(todoId) {
        for (const project of this.projects) {
            const todo = project.todos.find(t => t.id === todoId);
            if (todo) return todo;
        }
        return null;
    }

    updateTodo(todoId, updates) {
        const todo = this.getTodoById(todoId);
        if(todo) {
            Object.assign(todo, updates);
        }
    }

    deleteTodo(todoId) {
        for (const project of this.projects) {
            const index = project.todos.findIndex(t => t.id === todoId);
            if (index !== -1) {
                project.todos.splice(index, 1);
                break;
            }
        }
    }
}