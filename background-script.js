// this function is used by popup.js
function export_current_user_data(params, export_params) {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then((tabs) => {
      if (params.includes("overwrite-cache")) {
        browser.storage.local
          .clear()
          .then(() => {
            export_user_data(tabs[0], export_params);
          })
          .catch(console.error);
      } else {
        export_user_data(tabs[0], export_params);
      }
    })
    .catch(console.error);
}

function export_user_data(user_tab, export_params) {
  let username = get_username(user_tab.url);

  for (const type of export_params) {
    if (type == "following" || type == "followers") {
      browser.storage.local
        .get(username)
        .then((result) => {
          if (result[username]) return;

          browser.tabs.executeScript(user_tab.id, {
            file: "/content-scripts/profile.js",
          });

          browser.tabs
            .create({ url: get_twitter_url(username, type) })
            .then((tab) => {
              browser.tabs.executeScript(tab.id, {
                file: `/content-scripts/user-lists.js`,
              });
            })
            .catch(console.error);
        })
        .catch(console.error);
    } else if (type == "retweets") {
      console.warn("retweets are not implemented yet");
    } else {
      console.warn("unknown type:", type);
    }
  }
}

function get_twitter_url(username, path) {
  return `https://twitter.com/${username}/${path || ""}`;
}

function get_username(url) {
  return new URL(url).pathname.split("/")[1];
}
