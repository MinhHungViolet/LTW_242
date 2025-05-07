const API_URL = 'http://localhost/backend/public/question';
const USER_API_URL = 'http://localhost/backend/public/admin/users';
const itemPerPage = 5;
let currentPage = 1;
let questions = [];
let filteredQuestions = [];
let users = [];
let selectedQuestionId = null;

async function fetchUsers() {
    try {
        const token = localStorage.getItem('adminToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch(USER_API_URL, {
            headers: headers
        });
        const data = await response.json();
        if (data.status === 'success') {
            users = data.data || [];
        } else {
            console.error('Lỗi khi lấy danh sách người dùng 1: ' + data.message);
        }
    } catch (err) {
        console.error('Lỗi khi lấy danh sách người dùng: ' + err.message);
    }
}

async function fetchQuestions() {
    try {
        const token = localStorage.getItem('adminToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch(API_URL, {
            headers: headers
        });
        const data = await response.json();
        if (data.status === 'success') {
            questions = data.data || [];
            filteredQuestions = questions.map(question => {
                const user = users.find(u => u.userId === question.customerId);
                return {
                    ...question,
                    user_name: user ? user.name : 'Chưa có thông tin',
                    user_email: user ? user.email : 'Chưa có thông tin',
                    user_phone: user ? user.phone : 'Chưa có thông tin'
                };
            });
            displayQuestions(currentPage);
        } else {
            showError('Lỗi khi lấy câu hỏi: ' + data.message);
        }
    } catch (err) {
        showError('Lỗi khi lấy câu hỏi: ' + err.message);
    }
}

async function loadData() {
    await fetchUsers();
    await fetchQuestions();
}

function showError(message) {
    const tableBody = document.getElementById('qnaTableBody');
    tableBody.innerHTML = `<tr><td colspan="10" class="text-center text-danger">${message}</td></tr>`;
}

function displayQuestions(page) {
    const start = (page - 1) * itemPerPage;
    const end = start + itemPerPage;
    const displayed = filteredQuestions.slice(start, end);

    const tbody = document.getElementById('qnaTableBody');
    tbody.innerHTML = '';

    if (displayed.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">Chưa có câu hỏi nào.</td></tr>';
    } else {
        displayed.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.questionId}</td>
                    <td>${item.customerId}</td>
                    <td>${item.user_name}</td>
                    <td>${item.user_email}</td>
                    <td>${item.user_phone}</td>
                    <td>${item.question}</td>
                    <td>${item.answer || 'Chưa trả lời'}</td>
                    <td>${item.asked_at || 'Chưa xác định'}</td>
                    <td>${item.answered_at || 'Chưa trả lời'}</td>
                    <td>
                        ${item.answer ? 
                            '<span class="badge bg-success">Đã trả lời</span>' : 
                            `<button class="btn btn-primary btn-sm" onclick="openAnswerForm(${item.questionId})">Trả lời</button>`}
                        <button class="btn btn-danger btn-sm mt-1" onclick="deleteQuestion(${item.questionId})">Xóa</button>
                    </td>
                </tr>
            `;
        });
    }
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredQuestions.length / itemPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'block';

    let ul = document.createElement('ul');
    ul.className = 'pagination pagination-primary justify-content-center';

    if (currentPage > 1) {
        ul.appendChild(createPageItem(1, '<i class="bi bi-chevron-double-left"></i>'));
        ul.appendChild(createPageItem(currentPage - 1, '<i class="bi bi-chevron-left"></i>'));
    }

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
        const li = createPageItem(i, i);
        if (i === currentPage) li.classList.add('active');
        ul.appendChild(li);
    }

    if (currentPage < totalPages) {
        ul.appendChild(createPageItem(currentPage + 1, '<i class="bi bi-chevron-right"></i>'));
        ul.appendChild(createPageItem(totalPages, '<i class="bi bi-chevron-double-right"></i>'));
    }

    paginationContainer.appendChild(ul);
}

function createPageItem(page, content) {
    const li = document.createElement('li');
    li.className = 'page-item';
    const a = document.createElement('a');
    a.className = 'page-link';
    a.innerHTML = content;
    a.href = '#';
    a.onclick = (e) => {
        e.preventDefault();
        currentPage = page;
        displayQuestions(currentPage);
    };
    li.appendChild(a);
    return li;
}

function filterQuestions() {
    const customerFilter = document.getElementById('customerFilter').value.trim();
    filteredQuestions = questions.filter(q => 
        customerFilter === '' || q.customerId.toString().includes(customerFilter)
    ).map(question => {
        const user = users.find(u => u.userId === question.customerId);
        return {
            ...question,
            user_name: user ? user.name : 'Chưa có thông tin',
            user_email: user ? user.email : 'Chưa có thông tin',
            user_phone: user ? user.phone : 'Chưa có thông tin'
        };
    });
    currentPage = 1;
    displayQuestions(currentPage);
}

function openAnswerForm(questionId) {
    selectedQuestionId = questionId;
    document.getElementById('answerQuestionId').textContent = questionId;
    document.getElementById('answerText').value = '';
    document.getElementById('answerForm').style.display = 'block';
}

function cancelAnswer() {
    selectedQuestionId = null;
    document.getElementById('answerForm').style.display = 'none';
}

async function submitAnswer() {
    const answer = document.getElementById('answerText').value.trim();
    if (!answer) {
        alert('Vui lòng nhập câu trả lời');
        return;
    }

    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            alert('Vui lòng đăng nhập để trả lời câu hỏi');
            return;
        }

        const response = await fetch(`${API_URL}/${selectedQuestionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ answer })
        });

        const data = await response.json();
        if (data.status === 'success') {
            cancelAnswer();
            await loadData();
        } else {
            alert('Lỗi khi gửi câu trả lời: ' + data.message);
        }
    } catch (err) {
        alert('Lỗi khi gửi câu trả lời: ' + err.message);
    }
}

async function deleteQuestion(questionId) {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
        return;
    }

    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}/${questionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.status === 'success') {
            await loadData();
        } else {
            alert('Lỗi khi xóa câu hỏi: ' + data.message);
        }
    } catch (err) {
        alert('Lỗi khi xóa câu hỏi: ' + err.message);
    }
}

document.addEventListener('DOMContentLoaded', loadData);