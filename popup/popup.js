function get_exports() {
  let exports = [];
  let inputs = document.getElementsByTagName("input");

  for (const element of inputs) {
    if (element.type == "checkbox" && element.checked) {
      exports.push(element.name);
    }
  }

  // access window object of background.js script and execute export_user_data function
  browser.runtime.getBackgroundPage().then((background_window) => {
    background_window.export_user_data(exports);
  });
}

document.getElementById("submit").addEventListener("click", get_exports);
