var relation_type = get_url_part(window.location, 2);
var username = get_url_part(window.location);

browser.storage.local.get("users").then((result) => {
  let count = result.users[username][relation_type];

  wait_for_element("section.css-1dbjc4n").then((element) => {
    let usernames = new Set();

    let interval = setInterval(() => {
      let user_elements = document
        .querySelector("section.css-1dbjc4n")
        .querySelector("div.css-1dbjc4n")
        .querySelector("div").children;

      for (const element of user_elements) {
        let link = element.querySelector("a");
        if (!link) continue;

        usernames.add(get_url_part(link.href));
      }

      window.scrollTo(0, document.body.scrollHeight);

      if (usernames.size >= count) {
        clearInterval(interval);
        store_connections(usernames);
      }
    }, 1000);
  });
});

function get_url_part(url, index) {
  if (!index) index = 1;
  return new URL(url).pathname.split("/")[index];
}

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

function store_connections(usernames_) {
  let usernames = Array.from(usernames_);

  let new_connections = usernames.map((element) => {
    if (relation_type == "followers") {
      return { source: element, target: username };
    } else if (relation_type == "following") {
      return { source: username, target: element };
    }
  });

  let new_users = Object.fromEntries(
    usernames.map((element) => {
      return [element, {}];
    })
  );

  browser.storage.local.get("relations").then((result) => {
    browser.storage.local
      .set({
        relations: [...result.relations, ...new_connections],
      })
      .then(browser.runtime.connect)
      .catch(console.error);
  });

  browser.storage.local.get("users").then((result) => {
    browser.storage.local.set({
      users: {
        ...new_users,
        ...result.users, // existing nodes should overwrite new ones
      },
    });
  });
}
