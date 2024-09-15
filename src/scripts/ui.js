import { format } from 'date-fns';

export class UI {
    constructor(appLogic) {
        this.appLogic = appLogic;
        this.projectsContainer = document.getElementById('projects');
        this.todosContainer = document.getElementById('todos');
        this.init();
    }

    init() {
        this.renderProjects();
        this.addEventListeners();
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
        <button class="view-project" data-project-id="${project.id}>View Project</button>
        `
        return projectElement;
    }

    renderAddProjectButton() {
        const addButton = document.createElement('button');
        addButton.textContent = 'Add Project';
        addButton.classList.add('add-project');
        this.projectsContainer.appendChild(addButton);
    }

    renderTodos(projectId) {
        const project = this.appLogic.project.find(p => p.id === projectId);
        if (!project) return;

        this.todosContainer.innerHTML = `<h3>${project.name} Tasks</h3>`;
        project.todos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todosContainer.appendChild(todoElement);
        });
        this.renderAddProjectButton(projectId);
    }

    createTodoElement(todo) {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo');
        todoElement.innerHTML = `
            <h4>${todo.title}</h4>
            <p>Due: ${format(new Date(todo.dueDate), 'MM/dd/yyyy')}</p>
            <p>Priority: ${todo.priority}</p>
            <button class="edit-todo" data-todo-id="${todo.id}">Edit</button>
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

    addEventListeners() {
        this.projectsContainer.addEventListener('click', this.handleProjectClick.bind(this));
        this.todosContainer.addEventListener('click', this.handleTodoClick.bind(this));
      }
    
    handleProjectClick(e) {
        if (e.target.classList.contains('view-project')) {
          const projectId = e.target.dataset.projectId;
          this.renderTodos(projectId);
        } else if (e.target.classList.contains('add-project')) {
          this.showAddProjectModal();
        }
    }
    
    handleTodoClick(e) {
        if (e.target.classList.contains('edit-todo')) {
          const todoId = e.target.dataset.todoId;
          this.showEditTodoModal(todoId);
        } else if (e.target.classList.contains('delete-todo')) {
          const todoId = e.target.dataset.todoId;
          this.deleteTodo(todoId);
        } else if (e.target.classList.contains('add-todo')) {
          const projectId = e.target.dataset.projectId;
          this.showAddTodoModal(projectId);
        }
    }
    
    showAddProjectModal() {
        const projectName = prompt('Enter project name:');
        if (projectName) {
          this.appLogic.createProject(projectName);
          this.renderProjects();
        }
    }
    
    showAddTodoModal(projectId) {
        const title = prompt('Enter task title:');
        if (title) {
          const description = prompt('Enter task description:');
          const dueDate = prompt('Enter due date (YYYY-MM-DD):');
          const priority = prompt('Enter priority (low/medium/high):');
          this.appLogic.createTodo(title, description, new Date(dueDate), priority, projectId);
          this.renderTodos(projectId);
        }
    }
    
    showEditTodoModal(todoId) {
        const todo = this.appLogic.getTodoById(todoId);
        if (todo) {
          const title = prompt('Edit task title:', todo.title);
          const description = prompt('Edit task description:', todo.description);
          const dueDate = prompt('Edit due date (YYYY-MM-DD):', format(new Date(todo.dueDate), 'yyyy-MM-dd'));
          const priority = prompt('Edit priority (low/medium/high):', todo.priority);
          this.appLogic.updateTodo(todoId, { title, description, dueDate: new Date(dueDate), priority });
          this.renderTodos(todo.projectId);
        }
    }
    
    deleteTodo(todoId) {
        const todo = this.appLogic.getTodoById(todoId);
        if (todo && confirm('Are you sure you want to delete this task?')) {
          this.appLogic.deleteTodo(todoId);
          this.renderTodos(todo.projectId);
        }
    }
}