function wait_for_element(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function get_username(url) {
  return new URL(url).pathname.split("/")[1];
}

function get_user_elements() {
  return document
    .querySelector("section.css-1dbjc4n")
    .querySelector("div.css-1dbjc4n")
    .querySelector("div").children;
}

function save_data(usernames) {
  browser.storage.local.get(username).then((result) => {
    browser.storage.local.set({
      [username]: {
        ...result[username],
        [type]: Array.from(usernames),
      },
    });
  });
}

var type = window.location.pathname.split("/")[2];
var username = get_username(window.location);

browser.storage.local.get(username).then((result) => {
  let count = result[username][type];

  wait_for_element("section.css-1dbjc4n").then((element) => {
    let usernames = new Set();

    let interval = setInterval(() => {
      let user_elements = get_user_elements();

      for (const element of user_elements) {
        let link = element.querySelector("a");
        if (!link) continue;

        usernames.add(get_username(link.href));
      }

      window.scrollTo(0, document.body.scrollHeight);

      if (usernames.size >= count) {
        clearInterval(interval);
        save_data(usernames);
      }
    }, 1000);
  });
});
