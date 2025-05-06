async function fetchQnaCount() {
    try {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5b3VyX2FwaV9kb21haW4uY29tIiwiYXVkIjoieW91cl9hcGlfZG9tYWluLmNvbSIsImlhdCI6MTc0NjI3MjE4OCwiZXhwIjoxNzQ2ODc2OTg4LCJ1c2VySWQiOjExLCJlbWFpbCI6InF1b2NkYXRhZG1pbkBlbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifQ.6l0-lxKa-GXQItFzYp9PEs989w6R9AeIyF-u3s9O2cI';
        const response = await fetch('http://localhost/backend/public/question/count', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        if (data.status === 'success') {
            document.getElementById('qnaCount').textContent = data.data;
        } else {
            document.getElementById('qnaCount').textContent = 'Error';
            console.error('Lỗi khi lấy số câu hỏi: ' + data.message);
        }
    } catch (err) {
        document.getElementById('qnaCount').textContent = 'Error';
        console.error('Lỗi khi lấy số câu hỏi: ' + err.message);
    }
}

async function fetchLatestQna() {
    try {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5b3VyX2FwaV9kb21haW4uY29tIiwiYXVkIjoieW91cl9hcGlfZG9tYWluLmNvbSIsImlhdCI6MTc0NjI3MjE4OCwiZXhwIjoxNzQ2ODc2OTg4LCJ1c2VySWQiOjExLCJlbWFpbCI6InF1b2NkYXRhZG1pbkBlbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifQ.6l0-lxKa-GXQItFzYp9PEs989w6R9AeIyF-u3s9O2cI';
        const response = await fetch('http://localhost/backend/public/question/latest', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        if (data.status === 'success') {
            const tbody = document.querySelector('#recentQnaTable tbody');
            tbody.innerHTML = ''; // Xóa nội dung cũ
            data.data.forEach((qna, index) => {
                if (index < 5) { // Hạn chế hiển thị 5 câu hỏi
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="col-3">
                            <div class="d-flex align-items-center">
                                <div class="avatar avatar-md">
                                    <img src="../assets/compiled/jpg/${index % 5 + 1}.jpg">
                                </div>
                                <p class="font-bold ms-3 mb-0">User ${qna.customerId}</p>
                            </div>
                        </td>
                        <td class="col-auto">
                            <p class="mb-0">${qna.question}</p>
                        </td>
                    `;
                    tbody.appendChild(tr);
                }
            });
        } else {
            console.error('Lỗi khi lấy câu hỏi mới nhất: ' + data.message);
        }
    } catch (err) {
        console.error('Lỗi khi lấy câu hỏi mới nhất: ' + err.message);
    }
}

// Gọi cả hai hàm khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    fetchQnaCount();
    fetchLatestQna();
});