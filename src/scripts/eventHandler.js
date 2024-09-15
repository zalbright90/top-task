export class EventHandler {
    constructor(appLogic, ui) {
        this.appLogic = appLogic;
        this.ui = ui;
        this.init();
    }

    init() {
        this.addProjectListeners();
        this.addTodoListeners();
    }

    addProjectListeners() {
        const projectsContainer = document.querySelector('#projects');
        projectsContainer.addEventListener('click', this.handleProjectClick.bind(this));
    }

    addTodoListeners() {
        const todosContainer = document.querySelector('#todos');
        todosContainer.addEventListener('click', this.handleTodoClick.bind(this));
    }

    handleProjectClick(e) {
        if (e.target.classList.contains('view-project')) {
          const projectId = e.target.dataset.projectId;
          this.ui.renderTodos(projectId);
        } else if (e.target.classList.contains('add-project')) {
          this.showAddProjectModal();
        }
    }

    handleTodoClick(e) {
        if (e.target.classList.contains('expand-todo')) {
            const todoId = e.target.dataset.todoId;
            this.ui.expandTodo(todoId);
        } else if (e.target.classList.contains('delete-todo')) {
            const todoId = e.target.dataset.todoId;
            this.deleteTodo(todoId);
        } else if (e.target.classList.contains('edit-todo')) {
            const todoId = e.target.dataset.todoId;
            this.showEditTodoModal(todoId);
        } else if (e.target.classList.contains('add-todo')) {
            const projectId = e.target.dataset.projectId;
            this.showAddTodoModal(projectId);
        }
    }

    showAddProjectModal() {
        const projectName = prompt('Enter project name');
        if (projectName) {
            this.appLogic.createProject(projectName);
            this.ui.renderProjects();
            this.appLogic.saveToStorage();
        }
    }

    showAddTodoModal(projectId) {
        const title = prompt('Enter task title:');
        if (title) {
            const description = prompt('Enter task description:');
            const dueDate = prompt('Enter due date (YYYY-MM-DD):');
            const priority = prompt('Enter priority (low/medium/high):');
            this.appLogic.createTodo(title, description, new Date(dueDate), priority, projectId);
            this.ui.renderTodos(projectId);
            this.appLogic.saveToStorage();
        }
    }

    showEditTodoModal(todoId) {
        const todo = this.appLogic.getTodoById(todoId);
        if (todo) {
          const title = prompt('Edit task title:', todo.title);
          const description = prompt('Edit task description:', todo.description);
          const dueDate = prompt('Edit due date (YYYY-MM-DD):', todo.dueDate.toISOString().split('T')[0]);
          const priority = prompt('Edit priority (low/medium/high):', todo.priority);
          this.appLogic.updateTodo(todoId, { title, description, dueDate: new Date(dueDate), priority });
          this.ui.renderTodos(todo.projectId);
          this.appLogic.saveToStorage();
        }
    }

    deleteTodo(todoId) {
        const todo = this.appLogic.getTodoById(todo.id);
        if (todo && confirm('Are you sure you want to delete this task?')) {
            this.appLogic.deleteTodo(todoId);
            this.ui.renderTodos(todo.projectId);
            this.appLogic.saveToStorage();
        }
    }
}