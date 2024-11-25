import {Location} from "react-router-dom";

export const getIdFromPathname = (location: Location) => {
    const pathname = location.pathname;
    const parts = pathname.split('/');
    const id = Number(parts[parts.length - 1]);

    return isNaN(id) ? null : id;
}