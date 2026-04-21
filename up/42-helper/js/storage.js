const STORAGE_KEY = "user_data";

function saveUser(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Error saving user data:", e);
    return false;
  }
}

function getUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error getting user data:", e);
    return null;
  }
}

function updateProjects(projects) {
  const user = getUser();
  if (user) {
    user.projects = projects;
    saveUser(user);
  }
}

function updateSkills(skills) {
  const user = getUser();
  if (user) {
    user.skills = skills;
    saveUser(user);
  }
}

function clearData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error("Error clearing data:", e);
    return false;
  }
}