import './style.css';
import { appLogic } from './scripts/appLogic';
import { UI } from './scripts/ui';
import { storage } from './scripts/storage';

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

// Furthur Initializing

window.addEventListener('beforeunload', () => {
    storage.save('projects', app.projects);
  });