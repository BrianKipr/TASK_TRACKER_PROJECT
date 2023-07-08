(function() {
  function fetchTasks() {
    fetch('http://localhost:3000/tasks')
      .then(response => response.json())
      .then(tasks => {
        const taskTableBody = document.getElementById('task-table-body');

        // Clear existing task rows 
        taskTableBody.innerHTML = '';

        // Generate HTML for each task and append it to the table body
        tasks.forEach(task => {
          const row = document.createElement('tr');

          // Create table cells for category, description, due date, edit button, and delete button
          const categoryCell = document.createElement('td');
          categoryCell.textContent = task.category;
          row.appendChild(categoryCell);

          const descriptionCell = document.createElement('td');
          descriptionCell.textContent = task.description;
          row.appendChild(descriptionCell);

          const dueDateCell = document.createElement('td');
          dueDateCell.textContent = task.dueDate;
          row.appendChild(dueDateCell);

          //const editCell = document.createElement('td');
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.addEventListener('click', () => {
            editTask(task.id, task.category, task.description, task.dueDate);
          });
          // Add edit-btn class to the button
          editButton.classList.add('edit-btn');
          editCell.appendChild(editButton);
          row.appendChild(editCell);

          const deleteCell = document.createElement('td');
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => {
            deleteTask(task.id);
          });
          // Add delete-btn class to the button
          deleteButton.classList.add('delete-btn');
          deleteCell.appendChild(deleteButton);
          row.appendChild(deleteCell);

          // Append the row to the table body
          taskTableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.log('Error fetching tasks:', error);
      });
  }

  // Function to delete a task
  function deleteTask(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          // Task deleted successfully, fetch tasks again to update the list
          fetchTasks();
        } else {
          console.log('Failed to delete task');
        }
      })
      .catch(error => {
        console.log('Error deleting task:', error);
      });
  }

  // Function to edit a task
  function editTask(taskId, currentCategory, currentDescription, currentDueDate) {
    const newCategory = prompt('Enter the new category:', currentCategory);
    const newDescription = prompt('Enter the new description:', currentDescription);
    const newDueDate = prompt('Enter the new due date:', currentDueDate);

    if (newCategory && newDescription && newDueDate) {
      const updatedTask = {
        category: newCategory,
        description: newDescription,
        dueDate: newDueDate
      };

      fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      })
        .then(response => {
          if (response.ok) {
            // Task updated successfully, fetch tasks again to update the list
            fetchTasks();
          } else {
            console.log('Failed to update task');
          }
        })
        .catch(error => {
          console.log('Error updating task:', error);
        });
    }
  }

  // Function to add a new task
  function addTask() {
    const categorySelect = document.getElementById('category-select');
    const descriptionInput = document.getElementById('description-input');
    const dateInput = document.getElementById('date-input');

    const task = {
      category: categorySelect.value,
      description: descriptionInput.value,
      dueDate: dateInput.value
    };

    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
      .then(response => {
        if (response.ok) {
          // Task added successfully, fetch tasks again to update the list
          fetchTasks();
          // Clear input fields
          descriptionInput.value = '';
          dateInput.value = '';
        } else {
          console.log('Failed to add task');
        }
      })
      .catch(error => {
        console.log('Error adding task:', error);
      });
  }

  // Event listener for the Add Task button
  const addButton = document.getElementById('add-btn');
  addButton.addEventListener('click', addTask);

  // Fetch tasks on page load
  fetchTasks();
})();




