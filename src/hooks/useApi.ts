import { useState, useEffect } from 'react';
import {getUrl} from "../utils/api";

const useApi = (route: string, options: any = {}) => {

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            // @ts-ignore
            // const initData = window["Telegram"]['WebApp']['initData'];
            const initData = "query_id=AAGVFt08AwAAAJUW3TwV15BE&user=%7B%22id%22%3A7463573141%2C%22first_name%22%3A%22Abel%22%2C%22last_name%22%3A%22Tony%22%2C%22username%22%3A%22ProScriptSlinger4%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1727671559&hash=2d32a0b1f98969c72bb9288ca8167f86605d5a2df2d4026af5166a21b8e4d19d";
            const url = getUrl() + route;

            try {
                const response = await fetch(
                    url,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'launch-params': initData,
                        },
                        body: JSON.stringify(options),
                    }
                );

                const result = await response.json();
                if (result.status !== 'ok') {
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