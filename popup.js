document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('new-todo');
    const addButton = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');

    // Load saved todos
    chrome.storage.sync.get(['todos'], function(result) {
        console.log('Retrieved todos:', result); // Debugging log
        if (Array.isArray(result.todos)) {
            result.todos.forEach(todo => {
                addTodoToList(todo.text, todo.completed);
            });
        } else {
            console.log('No todos found or todos is not an array.');
        }
    });

    // Add new todo
    addButton.addEventListener('click', function() {
        const todoText = todoInput.value.trim();
        if (todoText) {
            const newTodo = { text: todoText, completed: false };
            addTodoToList(newTodo.text, newTodo.completed);
            saveTodoToStorage(newTodo);
            todoInput.value = '';
        }
    });

    function addTodoToList(text) {
        const li = document.createElement('li');
        li.textContent = text;
    
        // Create the Copy button with Font Awesome icon
        const copyButton = document.createElement('button2');
        copyButton.innerHTML = "Copy";
        copyButton.addEventListener('click', function() {
            copyButton.innerHTML = "Copied";
            copyToClipboard(text);
        });
    
        // Create the Delete button with Font Awesome icon
        const deleteButton = document.createElement('button2');
        deleteButton.innerHTML = "Delete";
        deleteButton.addEventListener('click', function() {
            li.remove(); // Remove the todo from the UI
            deleteTodoFromStorage(text); // Remove the todo from storage
        });
    
        const alignButtons = document.createElement('alignButtons');
        alignButtons.appendChild(copyButton);
        alignButtons.appendChild(deleteButton);
        li.appendChild(alignButtons);
        todoList.appendChild(li);
    }
    
    function deleteTodoFromStorage(text) {
        chrome.storage.sync.get(['todos'], function(result) {
            let todos = result.todos || [];
            todos = todos.filter(todo => todo.text !== text); // Filter out the todo to delete
            chrome.storage.sync.set({ todos: todos });
        });
    }
    
    function saveTodoToStorage(todo) {
        chrome.storage.sync.get(['todos'], function(result) {
            const todos = result.todos || [];
            todos.push(todo);
            chrome.storage.sync.set({ todos: todos });
        });
    }
 

    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
         
    }
});
