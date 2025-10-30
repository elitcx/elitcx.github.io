console.log('JavaScript file loaded.');

let todos = [];
let currentFilter = '';

function validateTaskInput(taskInput, dateInput) {
    if (taskInput.value.trim() === '' || dateInput.value === '') {
        return false;
    }
    return true;
}

function addTask(event) {
    event.preventDefault();
    const taskInput = document.getElementById('todo-task');
    const dateInput = document.getElementById('todo-date');
    if (!validateTaskInput(taskInput, dateInput)) {
        alert('Please provide a valid task description.');
        return;
    } else {
        console.log('Task added:', taskInput.value, 'Due date:', dateInput.value);

        todos.push({ task: taskInput.value, date: dateInput.value});
        taskInput.value = '';
        dateInput.value = '';
        renderTasks();
    }
}

function clearTasks() {
    todos = [];
    renderTasks();
}

function deleteTask(index) {
    // animate row then remove from array & re-render
    const row = document.querySelector(`#todo-list tr[data-idx="${index}"]`);
    if (row) {
        row.classList.add('leave');
        row.addEventListener('transitionend', () => {
            todos.splice(index, 1);
            renderTasks();
        }, { once: true });
    } else {
        // fallback
        todos.splice(index, 1);
        renderTasks();
    }
}

function filterTasks() {
    const q = prompt('Enter search term to filter tasks (leave empty to show all):', currentFilter || '');
    if (q === null) return; // cancelled
    currentFilter = q.trim().toLowerCase();
    renderTasks();
}

function renderTasks() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    const mapped = todos.map((t, i) => ({ ...t, __idx: i }));

    const visible = currentFilter
        ? mapped.filter(item =>
            item.task.toLowerCase().includes(currentFilter) ||
            item.date.toLowerCase().includes(currentFilter)
        )
        : mapped;

    if (visible.length === 0) {
        const message = currentFilter ? 'No matching tasks.' : 'No tasks — add one above.';
        todoList.innerHTML = `
            <tr>
                <td class="px-4 py-6 text-white" colspan="4">${message}</td>
            </tr>
        `;
        return;
    }

    visible.forEach((item) => {
        const row = document.createElement('tr');
        row.classList.add('py-2','h-8', 'bg-indigo-300', 'even:bg-indigo-200');
        row.dataset.idx = item.__idx;

        row.innerHTML = `
            <td class="h-8 px-4 py-2">${item.task}</td>
            <td class="h-8 px-4 py-2">${item.date}</td>
            <td class="h-8 px-4 py-2">Pending</td>
            <td>
                <button class="h-8 bg-red-500 text-white px-2 py-1 rounded" onclick="deleteTask(${item.__idx})">Delete</button>
            </td>
        `;

        // enter animation: append then remove enter class next frame so CSS transition runs
        row.classList.add('enter');
        todoList.appendChild(row);
        requestAnimationFrame(() => row.classList.remove('enter'));
    });
}