import { apiUrl } from "../components/common/Config";

export async function fetchJWT(endpoint, options = {}) {
    let token = localStorage.getItem("accessToken");

    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...options.headers,
        ...(token && { "Authorization": `Bearer ${token}` }),
    };

    try {
        let res = await fetch(endpoint, {
            ...options,
            headers,
        });

        // Nếu token hết hạn (401) → refresh token
        if (res.status === 401) {
            const refreshRes = await fetch(`${apiUrl}/refresh`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                if (refreshData.access_token) {
                    localStorage.setItem("accessToken", refreshData.access_token);
                    token = refreshData.access_token;

                    // Retry request với token mới
                    res = await fetch(endpoint, {
                        ...options,
                        headers: {
                            ...headers,
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                }
            }
        }

        return res;
    } catch (error) {
        console.error("fetchJWT error:", error);
        throw error;
    }
}
