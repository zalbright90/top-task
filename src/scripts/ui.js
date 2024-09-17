import { format } from 'date-fns';

export class UI {
  constructor(appLogic) {
    this.appLogic = appLogic;
    this.projectsContainer = document.getElementById('projects');
    this.todosContainer = document.getElementById('todos');
  }

  renderAddProjectButton() {
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Project';
    addButton.classList.add('add-project');
    this.projectsContainer.appendChild(addButton);
  }

  renderProjects() {
    this.projectsContainer.innerHTML = '';
    this.renderAddProjectButton();
    this.appLogic.projects.forEach(project => {
      const projectElement = this.createProjectElement(project);
      this.projectsContainer.appendChild(projectElement);
    });

    this.projectsContainer.addEventListener('click', event => {
      if (event.target.classList.contains('delete-project')) {
        const projectId = event.target.dataset.projectId;
        this.appLogic.deleteProject(projectId);
        this.renderProjects();
        this.appLogic.saveToStorage();
      }
    });
  }

  createProjectElement(project) {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
    projectElement.innerHTML = `
      <h2>${project.name}</h2>
      <button class="view-project" data-project-id="${project.id}">View</button>
      <button class="delete-project" data-project-id="${project.id}">Delete</button>
    `;
    return projectElement;
  }



  renderTodos(projectId) {
    const project = this.appLogic.projects.find(p => p.id === projectId);
    if (!project) return;

    this.todosContainer.innerHTML = `<h3>${project.name} Todos</h3>`;
    this.renderAddTodoButton(projectId);
    project.todos.forEach(todo => {
      const todoElement = this.createTodoElement(todo);
      this.todosContainer.appendChild(todoElement);
    });
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
    addButton.textContent = 'Add Task';
    addButton.classList.add('add-todo');
    addButton.dataset.projectId = projectId;
    this.todosContainer.appendChild(addButton);
  }

  expandTodo(todoId) {
    const todo = this.appLogic.getTodoById(todoId);
    if (!todo) return;  // Ensure the todo exists

    // Create the modal using the createModal method
    this.createModal(
        'expand-todo-modal',
        `Task: ${todo.title}`,
        `
        <p><strong>Description:</strong> ${todo.description}</p>
        <p><strong>Due Date:</strong> ${new Date(todo.dueDate).toLocaleDateString()}</p>
        <p><strong>Priority:</strong> ${todo.priority}</p>
        <p><strong>Notes:</strong> ${todo.notes || 'No notes added'}</p>
        <h4>Checklist:</h4>
        <ul>
          ${todo.checklist.map((item, index) => `
            <li>
              <input type="checkbox" ${item.completed ? 'checked' : ''} data-index="${index}">
              ${item.text}
            </li>
          `).join('')}
        </ul>
        `,
        () => {
            console.log("Task expanded modal closed");
        }
    );
  }

  createModal(modalId, title, contentHtml, submitCallback) {
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.classList.add('modal');
  
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
  
    const modalTitle = document.createElement('h3');
    modalTitle.innerText = title;
    modalContent.appendChild(modalTitle);
  
    modalContent.innerHTML += contentHtml;
  
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    submitButton.classList.add('submit-button');
    modalContent.appendChild(submitButton);
  
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.classList.add('cancel-button');
    modalContent.appendChild(cancelButton);
  
    modal.appendChild(modalContent);
    document.body.appendChild(modal); 
  
    modal.classList.remove('hidden');
  
    cancelButton.addEventListener('click', () => {
        modal.remove();
    });
  
    submitButton.addEventListener('click', () => {
        submitCallback();
        modal.remove();
    });
  }
}