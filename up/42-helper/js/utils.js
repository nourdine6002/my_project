function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="spinner"></div>';
  }
}

function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
  }
}

function showError(message) {
  const toast = document.createElement("div");
  toast.className = "toast toast-error";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function showSuccess(message) {
  const toast = document.createElement("div");
  toast.className = "toast toast-success";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function showCreditsError() {
  const toast = document.createElement("div");
  toast.className = "toast toast-error";
  toast.textContent = "AI credits exhausted. Please upgrade at https://openrouter.ai/settings/credits";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function formatLevel(level) {
  return parseFloat(level).toFixed(2);
}

function getProjectStatusColor(status) {
  const statusMap = {
    "finished": "success",
    "in_progress": "warning",
    "failed": "danger"
  };
  return statusMap[status] || "info";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function checkAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function getBasePath() {
  return "";
}