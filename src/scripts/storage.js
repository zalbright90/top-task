export const storage = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    load(key) {
        const data = localStorage.getItem(key);
        return data? JSON.parse(data) : null;
    },

    saveProjects(projects) {
        this.save('projects', projects);
    }
};