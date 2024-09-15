import './style.css';
import { appLogic } from './scripts/appLogic';
import { UI } from './scripts/ui';
import { EventHandler } from './scripts/eventHandler';
import { storage } from './scripts/storage';
import { Project } from './scripts/Project';
import { Todo } from './scripts/Todo';

const app = new appLogic();

const savedProjects = storage.load('projects');
if (savedProjects) {
  app.projects = savedProjects.map(p => {
    const project = new Project(p.name);
    project.id = p.id;
    project.todos = p.todos.map(t => Object.assign(new Todo(), t));
    return project;
  });
}

const ui = new UI(app);

const eventHandler = new EventHandler(app, ui);

ui.renderProjects();

window.addEventListener('beforeunload', () => {
  app.saveToStorage();
});