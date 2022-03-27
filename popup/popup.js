function get_params() {
  let params = [];
  let export_params = [];

  for (const param of document
    .querySelector("div.params")
    .querySelectorAll("input")) {
    if (param.checked) {
      params.push(param.name);
    }
  }

  for (const export_param of document
    .querySelector("div.export-params")
    .querySelectorAll("input")) {
    if (export_param.checked) {
      export_params.push(export_param.name);
    }
  }

  // access window object of background.js script and execute export_user_data function
  browser.runtime
    .getBackgroundPage()
    .then((background_window) => {
      background_window.export_current_user_data(params, export_params);
    })
    .catch(console.error);
}

document.getElementById("submit").addEventListener("click", get_params);
