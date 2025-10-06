// Auto-save form data to localStorage
function autoSaveForm(formId, key) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('input', () => {
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem(key, JSON.stringify(data));
    });
  }
}

// Load form data from localStorage
function loadFormData(formId, key) {
  const form = document.getElementById(formId);
  if (form && localStorage.getItem(key)) {
    const data = JSON.parse(localStorage.getItem(key));
    Object.keys(data).forEach((key) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = data[key];
    });
  }
}