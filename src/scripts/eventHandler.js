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
        this.ui.createModal(
            'add-project-modal',
            'Add New Project',
            '<input type="text" id="project-name" placeholder="Project Name">',
            () => {
                const projectName = document.getElementById('project-name').value;
                if (projectName) {
                    this.appLogic.createProject(projectName);
                    this.ui.renderProjects();
                    this.appLogic.saveToStorage();
                }
            }
        );
    }

    showAddTodoModal(projectId) {
        this.ui.createModal(
            'add-todo-modal',
            'Add New Todo',
            `
            <input type="text" id="todo-title" placeholder="Todo Title">
            <input type="text" id="todo-description" placeholder="Description">
            <input type="date" id="todo-due-date" placeholder="Due Date">
            <select id="todo-priority">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            `,
            () => {
                const title = document.getElementById('todo-title').value;
                const description = document.getElementById('todo-description').value;
                const dueDate = document.getElementById('todo-due-date').value;
                const priority = document.getElementById('todo-priority').value;
    
                if (title && dueDate) {
                    this.appLogic.createTodo(title, description, new Date(dueDate), priority, projectId);
                    this.ui.renderTodos(projectId);
                    this.appLogic.saveToStorage();
                }
            }
        );
    }

    showEditTodoModal(todoId) {
        const todo = this.appLogic.getTodoById(todoId);

        if (todo) {
            this.ui.createModal(
                'edit-todo-modal',
                'Edit Todo',
                `
                <input type="text" id="todo-title" value="${todo.title}" placeholder="Todo Title">
                <input type="text" id="todo-description" value="${todo.description}" placeholder="Description">
                <input type="date" id="todo-due-date" value="${todo.dueDate.toISOString().split('T')[0]}" placeholder="Due Date">
                <select id="todo-priority">
                    <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
                    <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
                </select>
                `,
                () => {
                    const title = document.getElementById('todo-title').value;
                    const description = document.getElementById('todo-description').value;
                    const dueDate = document.getElementById('todo-due-date').value;
                    const priority = document.getElementById('todo-priority').value;

                    if (title && dueDate) {
                        this.appLogic.updateTodo(todoId, {
                            title,
                            description,
                            dueDate: new Date(dueDate),
                            priority
                        });
                        this.ui.renderTodos(todo.projectId);
                        this.appLogic.saveToStorage();
                    }
                }
            );
        }
    }

    deleteTodo(todoId) {
        const todo = this.appLogic.getTodoById(todoId);

        this.ui.createModal(
            'confirm-delete-modal',
            'Delete Todo',
            `<p>Are you sure you want to delete the task: <strong>${todo.title}</strong>?</p>`,
            () => {  // Callback when the user confirms deletion
                this.appLogic.deleteTodo(todoId);
                this.ui.renderTodos(todo.projectId);  // Re-render todos after deletion
                this.appLogic.saveToStorage();  // Save changes
            }
        );
    }
}