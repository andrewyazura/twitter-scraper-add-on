// this function is used by popup.js
function export_user_data(params) {
  browser.storage.local.clear();

  browser.tabs
    .query({ currentWindow: true, active: true })
    .then((tabs) => {
      let profile_tab = tabs[0];
      let username = get_username(profile_tab.url);

      browser.tabs.executeScript(profile_tab.id, {
        file: "/content-scripts/profile.js",
      });

      for (const type of params) {
        if (type == "following" || type == "followers") {
          browser.tabs
            .create({ url: get_twitter_url(username, element) })
            .then((tab) => {
              browser.tabs.executeScript(tab.id, {
                file: `/content-scripts/user-lists.js`,
              });
            })
            .catch(console.error);
        } else if (type == "retweets") {
          console.warn("retweets are not implemented yet");
        } else {
          console.warn("unknown type:", type);
        }
      }
    })
    .catch(console.error);
}

function get_twitter_url(username, path) {
  return `https://twitter.com/${username}/${path || ""}`;
}

function get_username(url) {
  return new URL(url).pathname.split("/")[1];
}
