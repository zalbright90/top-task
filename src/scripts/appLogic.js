import { Todo } from './Todo';
import { Project } from './Project';
import { storage } from './storage';

export class appLogic {
  constructor() {
    this.projects = [new Project('Default')];
  }

  getDefaultProject() {
    return this.projects[0];
  }

  createProject(name) {
    const project = new Project(name);
    this.projects.push(project);
    this.saveToStorage();
    return project;
  }

  getProjectById(projectId) {
    return this.projects.find(project => project.id === projectId);
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter(project => project.id !== projectId);
    this.saveToStorage();
  }

  createTodo(title, description, dueDate, priority, projectId = null) {
    const targetProject = this.getProjectById(projectId) || this.getDefaultProject();
    const todo = new Todo(title, description, dueDate, priority, targetProject.id);
    targetProject.addTodo(todo);
    this.saveToStorage();
    return todo;
  }

  getTodoById(todoId) {
    for (const project of this.projects) {
      const todo = project.getTodoById(todoId);
      if (todo) return todo;
    }
    return null;
  }

  updateTodo(todoId, updates) {
    for (const project of this.projects) {
      if (project.updateTodo(todoId, updates)) {
        this.saveToStorage();
        return true;
      }
    }
    return false;
  }

  deleteTodo(todoId) {
    for (const project of this.projects) {
      if (project.removeTodo(todoId)) {
        this.saveToStorage();
        return true;
      }
    }
    return false;
  }

  setTodoComplete(todoId, isComplete) {
    return this.updateTodo(todoId, { completed: isComplete });
  }

  changeTodoPriority(todoId, newPriority) {
    return this.updateTodo(todoId, { priority: newPriority });
  }

  saveToStorage() {
    storage.saveProjects(this.projects);
  }

  loadFromStorage() {
    const savedProjects = storage.load('projects');
    if (savedProjects) {
      this.projects = savedProjects.map(p => {
        const project = new Project(p.name);
        project.id = p.id;
        project.todos = p.todos.map(t => Object.assign(new Todo(), t));
        return project;
      });
    }
  }
}