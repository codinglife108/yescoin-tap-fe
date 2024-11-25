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
  if(!username) return require(`../assets/images/usersAvatars/${0}.jpg`);
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
  // const initData = "query_id=AAGVFt08AwAAAJUW3TwV15BE&user=%7B%22id%22%3A7463573141%2C%22first_name%22%3A%22Abel%22%2C%22last_name%22%3A%22Tony%22%2C%22username%22%3A%22ProScriptSlinger4%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1727671559&hash=2d32a0b1f98969c72bb9288ca8167f86605d5a2df2d4026af5166a21b8e4d19d";
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
  // const initData = "query_id=AAGVFt08AwAAAJUW3TwV15BE&user=%7B%22id%22%3A7463573141%2C%22first_name%22%3A%22Abel%22%2C%22last_name%22%3A%22Tony%22%2C%22username%22%3A%22ProScriptSlinger4%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1727671559&hash=2d32a0b1f98969c72bb9288ca8167f86605d5a2df2d4026af5166a21b8e4d19d";
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
