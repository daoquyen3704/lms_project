import Swal from 'sweetalert2';
import { apiUrl, token } from '../components/common/Config';

export const deleteConfirm = async (endpoint) => {
    return Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${apiUrl}${endpoint}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
                const data = await res.json();

                if (res.ok && data.status === 200) {
                    // Swal.fire('Đã xoá!', data.message || 'Xoá thành công.', 'success');
                    return { success: true, data };
                } else {
                    Swal.fire('Lỗi!', data.message || 'Không xoá được.', 'error');
                    return { success: false };
                }
            } catch (error) {
                Swal.fire('Lỗi!', 'Không kết nối được server.', 'error');
                return { success: false };
            }
        }
        return { success: false };
    });
};
