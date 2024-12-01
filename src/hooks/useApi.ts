import { useState, useEffect } from "react";
import { getUrl } from "../utils/api";

const useApi = (route: string, options: any = {}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // @ts-ignore
      // const initData = window["Telegram"]["WebApp"]["initData"];
      const initData =
          'query_id=AAEfTV5AAwAAAB9NXkBh0sxq&user=%7B%22id%22%3A7522372895%2C%22first_name%22%3A%22Lin%22%2C%22last_name%22%3A%22%28Softvision%29%22%2C%22username%22%3A%22lin108_softvision%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FsH6lnAKm8XwcH7btXVpTIfF3PYUMxA0qGoN4-MfxQy2dlOYDmwjLor6QpplzUV-I.svg%22%7D&auth_date=1732607057&signature=pXXTpG4Oj2X55TIVSn4tT5xr8pzC7zq2Je_yOEwPVNIx-qEk9CaAgxQNmFrrS19SWXRhvh6KApwtf1pp3HN0Dw&hash=9d46f7f36d03702552eee2894177bd8f4fdab00e16b325fd3164533ec437f702'
      const url = getUrl() + route;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "launch-params": initData,
          },
          body: JSON.stringify(options),
        });

        const result = await response.json();
        if (result.status !== "ok") {
          setError(result.payload);
          return;
        }

        setData(result.payload);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then();
  }, [route]);

  return { data, loading, error };
};

export default useApi;
