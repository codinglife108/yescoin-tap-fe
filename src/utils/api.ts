import axios from "axios";

export const getUrl = () => {
  return process.env.REACT_APP_API_URL;
};

export const getImageUrl = (filename: string) => {
  return getUrl() + "/file/" + filename;
};

export const getTelegramImageUrl = (fileId: string) => {
  return getUrl() + "/telegramFile/" + fileId;
};

export const getTelegramImageUrlPlaceholder = (username: string) => {
  function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  if (!username) return require(`../assets/images/usersAvatars/${0}.jpg`);
  // Hash the input string
  const hash = hashString(username);

  // Map the hash to one of 20 possibilities
  const possibility = Math.abs(hash) % 20;

  return require(`../assets/images/usersAvatars/${possibility}.jpg`);
};

export const fetchData = async (route: string, options: any = {}) => {
  /* const startTime = new Date().getTime(); */
  // @ts-ignore
  const initData = window["Telegram"]["WebApp"]["initData"];
  // const initData =
  //     'query_id=AAEfTV5AAwAAAB9NXkBh0sxq&user=%7B%22id%22%3A7522372895%2C%22first_name%22%3A%22Lin%22%2C%22last_name%22%3A%22%28Softvision%29%22%2C%22username%22%3A%22lin108_softvision%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FsH6lnAKm8XwcH7btXVpTIfF3PYUMxA0qGoN4-MfxQy2dlOYDmwjLor6QpplzUV-I.svg%22%7D&auth_date=1732607057&signature=pXXTpG4Oj2X55TIVSn4tT5xr8pzC7zq2Je_yOEwPVNIx-qEk9CaAgxQNmFrrS19SWXRhvh6KApwtf1pp3HN0Dw&hash=9d46f7f36d03702552eee2894177bd8f4fdab00e16b325fd3164533ec437f702'
  const url = getUrl() + route;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": !options.file
          ? "application/json"
          : "multipart/form-data",
        "launch-params": initData,
      },
      body: JSON.stringify(options),
    });

    let userId = null;
    try {
      userId = (window as any).Telegram.WebApp.initDataUnsafe.user.id;
    } catch {
      // eslint-disable-next-line
      userId = null;
    }

    const result = await response.json();

    if (result.status !== "ok") {
      return { result: null, error: result.payload };
    }

    return { result: result.payload, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const fetchDataAxios = async (route: string, options: any = {}) => {
  // @ts-ignore
  const initData = window["Telegram"]["WebApp"]["initData"];
  // const initData =
  //     'query_id=AAEfTV5AAwAAAB9NXkBh0sxq&user=%7B%22id%22%3A7522372895%2C%22first_name%22%3A%22Lin%22%2C%22last_name%22%3A%22%28Softvision%29%22%2C%22username%22%3A%22lin108_softvision%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FsH6lnAKm8XwcH7btXVpTIfF3PYUMxA0qGoN4-MfxQy2dlOYDmwjLor6QpplzUV-I.svg%22%7D&auth_date=1732607057&signature=pXXTpG4Oj2X55TIVSn4tT5xr8pzC7zq2Je_yOEwPVNIx-qEk9CaAgxQNmFrrS19SWXRhvh6KApwtf1pp3HN0Dw&hash=9d46f7f36d03702552eee2894177bd8f4fdab00e16b325fd3164533ec437f702'
  console.log(initData);

  const url = getUrl() + route;

  const formData = new FormData();
  Object.keys(options).forEach((key) => {
    formData.append(key, options[key]);
  });

  try {
    const response = await axios.post(url, formData, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "launch-params": initData,
      },
    });

    // logEvent(analytics, `api:${route}`, {});

    const result = await response.data;
    if (result.status !== "ok") {
      return { result: null, error: result.payload };
    }

    return { result: result.payload, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};
