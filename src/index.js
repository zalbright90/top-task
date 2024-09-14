import './styles.css';
import { appLogic } from './scripts/appLogic';
import { storage } from './scripts/storage';

const app = new appLogic();

const savedProjects = storage.load('projects');
if (savedProjects) {
    app.projects = savedProjects;
}

// Furthur Initializing

window.addEventListener('beforeunload', () => {
    storage.save('projects', app.projects);
  });