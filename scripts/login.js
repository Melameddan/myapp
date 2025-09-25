const sessionInfo = document.getElementById("session-info");
const logoutButton = document.getElementById("logout-btn");
const clearStorageButton = document.getElementById("clear-storage-btn");
const STORAGE_KEYS = {
  contractors: "contractorsData",
  people: "peopleData",
};
function loadSession() {
  const session = sessionStorage.getItem("loggedInUser");
  if (session) {
    try {
      const data = JSON.parse(session);
      const loginTime = new Date(data.loginTime).toLocaleString("he-IL");
      sessionInfo.textContent = `משתמש מחובר: ${data.name || "לא ידוע"} (ת.ז ${
        data.identifier || "?"
      }) מאז ${loginTime}.`;
      sessionInfo.classList.add("success");
    } catch (error) {
      console.error("Failed to parse session info", error);
      sessionInfo.textContent = "שגיאה בקריאת פרטי ההתחברות.";
      sessionInfo.classList.add("error");
    }
  } else {
    sessionInfo.textContent = "אין משתמש מחובר כרגע.";
    sessionInfo.classList.add("hint");
  }
}
function handleLogout() {
  sessionStorage.removeItem("loggedInUser");
  sessionInfo.textContent = "התנתקת בהצלחה.";
  sessionInfo.classList.remove("hint");
  sessionInfo.classList.add("success");
}
function handleClearStorage() {
  const confirmed = confirm("האם לנקות את כל הנתונים המקומיים? הפעולה אינה ניתנת לביטול.");
  if (!confirmed) {
    return;
  }
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  sessionStorage.removeItem("loggedInUser");
  sessionInfo.textContent = "הנתונים המקומיים נמחקו. טען מחדש קבצים במידת הצורך.";
  sessionInfo.classList.remove("success");
  sessionInfo.classList.add("hint");
}
logoutButton.addEventListener("click", handleLogout);
clearStorageButton.addEventListener("click", handleClearStorage);
document.addEventListener("DOMContentLoaded", loadSession);
