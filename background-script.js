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

      params.forEach((element) => {
        // retweets are not implemented yet
        if (element == "retweets") return;

        browser.tabs
          .create({ url: get_twitter_url(username, element) })
          .then((tab) => {
            browser.tabs.executeScript(tab.id, {
              file: `/content-scripts/${element}.js`,
            });
          })
          .catch(console.error);
      });
    })
    .catch(console.error);
}

function get_twitter_url(username, path) {
  return `https://twitter.com/${username}/${path || ""}`;
}

function get_username(url) {
  return new URL(url).pathname.split("/")[1];
}
