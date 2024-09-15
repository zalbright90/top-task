import { format } from 'date-fns';

export class UI {
  constructor(appLogic) {
    this.appLogic = appLogic;
    this.projectsContainer = document.getElementById('projects');
    this.todosContainer = document.getElementById('todos');
  }

  renderProjects() {
    this.projectsContainer.innerHTML = '';
    this.appLogic.projects.forEach(project => {
      const projectElement = this.createProjectElement(project);
      this.projectsContainer.appendChild(projectElement);
    });
    this.renderAddProjectButton();
  }

  createProjectElement(project) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
    projectElement.innerHTML = `
      <h2>${project.name}</h2>
      <button class="view-project" data-project-id="${project.id}">View</button>
    `;
    return projectElement;
  }

  renderAddProjectButton() {
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Project';
    addButton.classList.add('add-project');
    this.projectsContainer.appendChild(addButton);
  }

  renderTodos(projectId) {
    const project = this.appLogic.projects.find(p => p.id === projectId);
    if (!project) return;

    this.todosContainer.innerHTML = `<h3>${project.name} Todos</h3>`;
    project.todos.forEach(todo => {
      const todoElement = this.createTodoElement(todo);
      this.todosContainer.appendChild(todoElement);
    });
    this.renderAddTodoButton(projectId);
  }

  createTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    todoElement.classList.add(`priority-${todo.priority}`);
    todoElement.innerHTML = `
      <h4>${todo.title}</h4>
      <p>Due: ${format(new Date(todo.dueDate), 'MM/dd/yyyy')}</p>
      <button class="expand-todo" data-todo-id="${todo.id}">Expand</button>
      <button class="delete-todo" data-todo-id="${todo.id}">Delete</button>
    `;
    return todoElement;
  }

  renderAddTodoButton(projectId) {
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Todo';
    addButton.classList.add('add-todo');
    addButton.dataset.projectId = projectId;
    this.todosContainer.appendChild(addButton);
  }

  expandTodo(todoId) {
    const todo = this.appLogic.getTodoById(todoId);
    if (!todo) return;

    const expandedView = document.createElement('div');
    expandedView.classList.add('expanded-todo');
    expandedView.innerHTML = `
      <h3>${todo.title}</h3>
      <p>Description: ${todo.description}</p>
      <p>Due: ${format(new Date(todo.dueDate), 'MM/dd/yyyy')}</p>
      <p>Priority: ${todo.priority}</p>
      <p>Notes: ${todo.notes}</p>
      <h4>Checklist:</h4>
      <ul>
        ${todo.checklist.map((item, index) => `
          <li>
            <input type="checkbox" ${item.completed ? 'checked' : ''} data-index="${index}">
            ${item.text}
          </li>
        `).join('')}
      </ul>
      <button class="edit-todo" data-todo-id="${todo.id}">Edit</button>
      <button class="close-expanded">Close</button>
    `;

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.appendChild(expandedView);

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-expanded') || e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
}