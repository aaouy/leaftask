import { refreshAccessToken, callAPI } from "./functions.js";
import { API_CONFIG } from "./config.js";

main();

async function main() {
    initThemeChange();
    await loadAllTasks();
    const submit_task_button = document.getElementById('submit-note');
    const add_task_button = document.getElementById('add-task');
    const add_task_overlay = document.querySelector('.create-note-overlay');
    const add_task_exit_button = document.getElementById('create-note-exit-button');
    const logout_modal = document.querySelector('.logout-overlay');
    const edit_task_overlay = document.querySelector('.edit-note-overlay');
    const edit_exit_button = document.getElementById('edit-note-exit-button');
    const submit_edit_button = document.getElementById('edit-note-submit');
    logout_modal.close();
    initTaskCreation(add_task_overlay, add_task_button, submit_task_button, add_task_exit_button);
    initEditSubmission(edit_task_overlay, edit_exit_button, submit_edit_button);
    initUserLogout();
    initUserDeletion();
}

function initTaskCreation(overlay, add_task_button, submit_button, exit_button) {
    const text_area = document.getElementById('create-note-description');
    add_task_button.addEventListener('click', () => {
        text_area.value = '';
        overlay.showModal();
    })
    text_area.addEventListener('input', () => {
        text_area.style.height = 'auto'; 
        text_area.style.height = `${text_area.scrollHeight}px`; 
    });
    exit_button.addEventListener('click', () => {
        overlay.close();
    })
    submit_button.addEventListener('click', async (event) => {
        event.preventDefault();
        const task_description = document.getElementById('create-note-description').value;
        const create_task_endpoint = `${API_CONFIG.API_URL}task/`;
        try {
            let response = await callAPI(create_task_endpoint, 'POST', {content: task_description});
            if (response.status == 401) {
                await refreshAccessToken();
                response = await callAPI(create_task_endpoint, 'POST', {content: task_description});
            }
            if (!response.ok) {
                throw new Error(`${response.status}`);
            } 
            console.log('task successfully created!');
            const task = await response.json();
            const task_list = document.getElementById('note-list');
            loadTask(task_list, task);
            overlay.close();
            updateNumOfTasks();
        } catch (error) {
            console.error(error);
        }
    })
}

function initEditSubmission(overlay, exit_edit_button, submit_edit_button) {
    const text_area = document.getElementById('edit-note-description');
    text_area.addEventListener('input', () => {
        text_area.style.height = 'fit-content'; 
        text_area.style.height = `${text_area.scrollHeight}px`; 
    });
    exit_edit_button.addEventListener('click', () => {
        overlay.close();
    })
    submit_edit_button.addEventListener('click', async (event) => {
        event.preventDefault();
        const new_task_description = text_area.value;
        const task_id = overlay.getAttribute('data-id');
        const edit_task_endpoint = `${API_CONFIG.API_URL}task/update/${task_id}/`;
        const edit_task_body = {content: new_task_description};
        const task_list = document.getElementById('note-list');
        const list_element = task_list.querySelector(`li[data-id="${task_id}"]`);
        try {
            let response = await callAPI(edit_task_endpoint, 'PATCH', edit_task_body);
            if (response.status == 401) {
                await refreshAccessToken();
                response = await callAPI(edit_task_endpoint, 'PATCH', edit_task_body);
            }
            if (!response.ok) {
                throw new Error('Task was not successfully edited!');
            }
            console.log('Task was successfully edited!');
            list_element.firstChild.nodeValue = new_task_description;
            overlay.close();
        } catch (error) {
            console.error(error);
        }
    })
}

function initTaskEdit(list_element, overlay) {
    const text_area = document.getElementById('edit-note-description');
    list_element.addEventListener('click', () => {
        overlay.setAttribute('data-id', list_element.getAttribute('data-id'));
        console.log(list_element.getAttribute('data-id'));
        text_area.value = list_element.firstChild.textContent;
        text_area.style.height = 'fit-content'; 
        overlay.showModal();
    })
}

function initTaskDeletion(task, delete_button) {
    async function handleDelete(event) {
        event.stopPropagation();
        const delete_button_id = delete_button.getAttribute('data-id');
        const delete_task_endpoint = `${API_CONFIG.API_URL}task/delete/${delete_button_id}/`;
        try {
            let response = await callAPI(delete_task_endpoint, 'DELETE');
            if (response.status == 401) {
                await refreshAccessToken();
                response = await callAPI(delete_task_endpoint, 'DELETE');
            }
            if (!response.ok) {
                throw new Error('Failed to delete task!');
            }
        } catch (error) {
            console.error(error);
        }
        console.log('Task successfully deleted');
        task.remove();
        delete_button.removeEventListener('click', handleDelete);
        updateNumOfTasks();
    }
    delete_button.addEventListener('click', handleDelete);

}

function loadTask(task_list, task) {
    const delete_task_button = document.createElement('button');
    const list_item = document.createElement('li');
    const list_div = document.createElement('div');
    delete_task_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="undefined"><path d="m256-236-20-20 224-224-224-224 20-20 224 224 224-224 20 20-224 224 224 224-20 20-224-224-224 224Z"/></svg>';
    list_div.textContent = task.content;
    list_item.setAttribute('data-id', task.id);
    delete_task_button.setAttribute('data-id', task.id);
    list_item.appendChild(list_div);
    list_item.appendChild(delete_task_button);

    const edit_task_overlay = document.querySelector('.edit-note-overlay');
    const submit_edit_button = document.getElementById('edit-note-submit');
    const edit_exit_button = document.getElementById('edit-note-exit-button');

    initTaskEdit(list_item, edit_task_overlay, submit_edit_button, edit_exit_button);
    initTaskDeletion(list_item, delete_task_button);

    task_list.append(list_item);

}

async function loadAllTasks() {
    const load_task_endpoint = `${API_CONFIG.API_URL}task/`;
    try {
        let response = await callAPI(load_task_endpoint, 'GET', null);
        if (response.status == 401)  {
            await refreshAccessToken();
            response = await callAPI(load_task_endpoint, 'GET', null);
        }
        if (!response.ok) {
            throw new Error(response.status);
        }
        const tasks = await response.json();
        console.log(tasks);
        const task_list = document.getElementById('note-list');
        for (const task of tasks) {
            loadTask(task_list, task);
        }
        updateNumOfTasks();
        console.log('All tasks successfully loaded!');
    } catch (error) {
        console.error(error);
    }
}

function updateNumOfTasks() {
    const num_tasks = document.getElementById('note-list').querySelectorAll('li').length;
    const uncompleted_tasks = document.getElementById('uncompleted-tasks');
    if (num_tasks == 1) {
        uncompleted_tasks.innerText = `You have ${num_tasks} task to complete`;
    } else {
        uncompleted_tasks.innerText = `You have ${num_tasks} tasks to complete`;
    }
}

function initUserLogout() {
    const logout_modal = document.querySelector('.logout-overlay');
    const open_logout_button = document.getElementById('logout-button');
    open_logout_button.addEventListener('click', (event) => {
        event.stopPropagation();
        logout_modal.showModal();
    })

    const stay_logged_in = document.getElementById('logout-no');
    stay_logged_in.addEventListener('click', () => {
        logout_modal.close();
    })

    const exit_logout = document.getElementById('logout-exit');
    exit_logout.addEventListener('click', () => {
        logout_modal.close();
    })

    const logout_button = document.getElementById('logout-yes');
    logout_button.addEventListener('click', () => {
        logout_modal.close();
        window.location.href = 'home.html';
    })
}

function initUserDeletion() {
    const delete_user_button = document.getElementById('delete-acc-button');
    const delete_user_modal = document.querySelector('.delete-acc-overlay')
    delete_user_button.addEventListener('click', (event) => {
        event.stopPropagation();
        delete_user_modal.showModal();
    })

    const delete_user_no = document.getElementById('delete-acc-no');
    delete_user_no.addEventListener('click', () => {
        delete_user_modal.close();
    })

    const exit_delete_acc = document.getElementById('delete-acc-exit');
    exit_delete_acc.addEventListener('click', () => {
        delete_user_modal.close();
    })

    const delete_user_yes = document.getElementById('delete-acc-yes');
    const delete_user_endpoint = `${API_CONFIG.API_URL}user/delete/`;
    try {
        delete_user_yes.addEventListener('click', async () => {
            let response = await callAPI(delete_user_endpoint, 'DELETE');
            if (response.status == 401) {
                await refreshAccessToken();
                response = await callAPI(delete_user_endpoint, 'DELETE');
            }
            if (!response.ok) {
                console.log('Unable to delete user!');
            } else {
                localStorage.clear();
                delete_user_modal.close();
                window.location.href = 'home.html';
            }
        }) 
    } catch (error) {
        console.error(error);
    }
}

function initThemeChange() {
    let dark_mode = localStorage.getItem('darkmode');
    const theme_button = document.getElementById('theme-change');

    const enableDarkMode = () => {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkmode', 'active');
    }

    const disableDarkMode = () => {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkmode', null);
    }

    dark_mode === 'active' ? enableDarkMode() : disableDarkMode();

    theme_button.addEventListener('click', () => {
        dark_mode = localStorage.getItem('darkmode');
        dark_mode !== 'active' ? enableDarkMode() : disableDarkMode(); 
    })
}

