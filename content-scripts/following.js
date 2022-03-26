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

function get_following() {
  return document
    .querySelector("section.css-1dbjc4n")
    .querySelector("div.css-1dbjc4n")
    .querySelector("div").children;
}

function save_following(following) {
  console.log(following);
}

var username = get_username(window.location);

browser.storage.local.get(username).then((result) => {
  let following_count = result[username]["following"];

  wait_for_element("section.css-1dbjc4n").then((element) => {
    let following = new Set();

    let interval = setInterval(() => {
      let following_elements = get_following();

      for (const element of following_elements) {
        let link = element.querySelector("a");
        if (!link) continue;

        following.add(get_username(link.href));
      }

      window.scrollTo(0, document.body.scrollHeight);

      if (following.size >= following_count) {
        clearInterval(interval);
        save_following(following);
      }
    }, 1000);
  });
});
