import {useSession} from "next-auth/react";

export function useUser() {
    const {data} = useSession();
    if (data?.roles?.includes('user')) return data;
    return null;
}

export function useAdmin() {
    const {data} = useSession();
    if (data?.roles?.includes('admin')) return data;
    return null;
}