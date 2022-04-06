const history_size = -3;

var relation_type = get_url_part(window.location, 2);
var username = get_url_part(window.location);

(async () => {
  let users = await browser.storage.local.get("users");
  let max_size = users.users[username][relation_type];
  if (max_size <= 0) return;

  await wait_for_element("section.css-1dbjc4n");

  // promise is required to wait for the interval to be cleared
  await new Promise((resolve) => {
    let usernames = new Set();
    let size_history = [-2, -1];

    let interval = setInterval(async () => {
      let user_elements = document
        .querySelector("section.css-1dbjc4n")
        .querySelector("div.css-1dbjc4n")
        .querySelector("div").children;

      for (const element of user_elements) {
        let link = element.querySelector("a");
        if (!link) continue;

        usernames.add(get_url_part(link.href));
      }

      console.debug(usernames.size, "/", max_size);
      window.scrollTo(0, document.body.scrollHeight);

      if (
        usernames.size >= max_size ||
        size_history.slice(history_size).every((v, i, a) => v == a[0])
      ) {
        // stop the interval and resolve
        // if the number of usernames is greater than or equal to the expected amount,
        // or the number of usernames has not changed for the last history_size iterations
        clearInterval(interval);
        usernames = Array.from(usernames).slice(0, max_size);
        await store_connections(usernames);
        resolve();
      }

      size_history.push(usernames.size);
      size_history = size_history.slice(history_size);
    }, 800);
  });
})();

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

async function store_connections(usernames) {
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

  let relations = await browser.storage.local.get("relations");
  await browser.storage.local.set({
    relations: [...relations.relations, ...new_connections],
  });

  let users = await browser.storage.local.get("users");
  await browser.storage.local.set({
    users: {
      ...new_users,
      ...users.users, // existing nodes overwrite new ones
    },
  });
}
