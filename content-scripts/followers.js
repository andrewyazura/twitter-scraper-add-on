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

function get_followers() {
  return document
    .querySelector("section.css-1dbjc4n")
    .querySelector("div.css-1dbjc4n")
    .querySelector("div").children;
}

function save_followers(followers) {
  console.log(followers);
}

var username = get_username(window.location);

browser.storage.local.get(username).then((result) => {
  let followers_count = result[username]["followers"];

  wait_for_element("section.css-1dbjc4n").then((element) => {
    let followers = new Set();

    let interval = setInterval(() => {
      let followers_elements = get_followers();

      for (const element of followers_elements) {
        let link = element.querySelector("a");
        if (!link) continue;

        followers.add(get_username(link.href));
      }

      window.scrollTo(0, document.body.scrollHeight);

      if (followers.size >= followers_count) {
        clearInterval(interval);
        save_followers(followers);
      }
    }, 1000);
  });
});
