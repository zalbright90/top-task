export class Todo {
    constructor(title, description, dueDate, priority, projectId) {
      this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.projectId = projectId;
      this.completed = false;
      this.notes = '';
      this.checklist = [];
    }
  
    addChecklistItem(item) {
      this.checklist.push({ text: item, completed: false });
    }
  
    toggleChecklistItem(index) {
      if (this.checklist[index]) {
        this.checklist[index].completed = !this.checklist[index].completed;
      }
    }
  }