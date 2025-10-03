import { apiUrl } from "../components/common/Config";

export async function fetchJWT(endpoint, options = {}) {
    let token = localStorage.getItem("accessToken");
    let refreshToken = localStorage.getItem("refreshToken");

    // console.log("Initial tokens:", { token, refreshToken });

    // Tạo headers cơ bản
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...options.headers,
    };

    // Thêm token nếu có
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        // console.log("Making initial request to:", endpoint);

        // Thực hiện request đầu tiên
        let res = await fetch(endpoint, {
            ...options,
            headers,
        });

        // Nếu token hết hạn (401) và có refresh token
        if (res.status === 401 && refreshToken) {
            try {
                // console.log("Token expired, attempting refresh...");

                // Gọi API refresh token với Bearer token
                const refreshRes = await fetch(`${apiUrl}/refresh`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${refreshToken}`
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken
                    }),
                });

                // console.log("Refresh response status:", refreshRes.status);

                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    // console.log("Refresh response data:", refreshData);

                    // Nếu nhận được token mới
                    if (refreshData.access_token) {
                        // console.log("Got new access token");
                        // Lưu token mới
                        localStorage.setItem("accessToken", refreshData.access_token);
                        if (refreshData.refresh_token) {
                            localStorage.setItem("refreshToken", refreshData.refresh_token);
                        }                        // Retry request ban đầu với token mới
                        return await fetch(endpoint, {
                            ...options,
                            headers: {
                                ...headers,
                                "Authorization": `Bearer ${refreshData.access_token}`,
                            },
                        });
                    }
                }

                // Nếu refresh token không thành công
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userInfoLms");
                window.location.href = "/account/login";
                return res;
            } catch (refreshError) {
                // Nếu có lỗi khi refresh token
                // console.error("Error refreshing token:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userInfoLms");
                window.location.href = "/account/login";
                return res;
            }
        }

        // Trả về response nếu không phải 401 hoặc không có refresh token
        return res;
    } catch (error) {
        console.error("fetchJWT error:", error);
        throw error;
    }
}
