// this function is used by popup.js
function export_user_data(params) {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then((tabs) => {
      let base_url = new URL(tabs[0].url);
      let username = base_url.pathname;

      params.forEach((element) => {
        if (element == "retweets") return;

        browser.tabs.create({ url: get_url(username, element) }).then((tab) => {
          browser.tabs.executeScript(tab.id, {
            file: `/content-scripts/${element}.js`,
          });
        });
      });
    })
    .catch(console.log);
}

function get_url(username, path) {
  return `https://twitter.com/${username}/${path || ""}`;
}

function append_cookies(name, data) {
  let url = "https://twitter.com";
  browser.cookies
    .get({
      url,
      name,
    })
    .then((cookie) => {
      let cookie_value = JSON.parse(cookie.value);
      let value = JSON.stringify({ ...cookie_value, ...data });

      browser.cookies.set({
        url,
        name,
        value,
      });
    });
}
