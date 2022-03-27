var connection_type = get_url_part(window.location, 2);
var username = get_url_part(window.location);

browser.storage.local.get(username).then((result) => {
  let count = result[username][connection_type];

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

        browser.storage.local.get(username).then((result) => {
          browser.storage.local
            .set({
              [username]: {
                ...result[username],
                [connection_type]: Array.from(usernames),
              },
            })
            .then(browser.runtime.connect)
            .catch(console.error);
        });
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
