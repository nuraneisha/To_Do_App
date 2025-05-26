const dropdown = document.getElementById('myDropdown');

      async function fetchData() {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
      }

      async function populateDropdown(userIds) {
        dropdown.innerHTML = '';
        userIds.forEach(id => {
          const link = document.createElement('a');
          link.href = '#';
          link.textContent = `User ID: ${id}`;
          link.classList.add('user-link');
          link.addEventListener('click', () => displayList(id));
          dropdown.appendChild(link);
        });
      }

      async function myFunction() {
        try {
          const data = await fetchData();
          const userIds = [...new Set(data.map(todo => todo.userId))];
          populateDropdown(userIds);
          dropdown.classList.toggle('show');
        } catch (err) {
          console.error('Dropdown error:', err);
        }
      }

      window.onclick = (event) => {
        if (!event.target.matches('.dropbtn')) {
          dropdown.classList.remove('show');
        }
      };

      async function fetchList(userId = null) {
        try {
          const data = await fetchData();
          return userId ? data.filter(todo => todo.userId === userId) : data;
        } catch (err) {
          console.error('List fetch error:', err);
          return [];
        }
      }

      async function displayList(userId = null) {
        const tableBody = document.querySelector('#todo-table tbody');
        tableBody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

        const todos = await fetchList(userId);
        tableBody.innerHTML = '';

        todos.forEach(todo => {
          const savedPriority = localStorage.getItem(`priority-${todo.id}`) || '';
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${todo.userId}</td>
            <td>${todo.title}</td>
            <td>
              <select class="priority-dropdown" data-id="${todo.id}" style="background-color:${getPriorityColor(savedPriority)}">
                <option value="">Select</option>
                <option value="Low" ${savedPriority === 'Low' ? 'selected' : ''}>Low</option>
                <option value="Medium" ${savedPriority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="High" ${savedPriority === 'High' ? 'selected' : ''}>High</option>
              </select>
            </td>`;
          tableBody.appendChild(row);
        });

        document.querySelectorAll('.priority-dropdown').forEach(select => {
          select.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            const value = e.target.value;
            localStorage.setItem(`priority-${id}`, value);
            e.target.style.backgroundColor = getPriorityColor(value);
          });
        });
      }

      function getPriorityColor(priority) {
        switch (priority) {
          case 'Low': return 'lightgreen';
          case 'Medium': return 'orange';
          case 'High': return 'tomato';
          default: return 'white';
        }
      }

      function filterByPriority(priority) {
        const tableBody = document.querySelector('#todo-table tbody');
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
          const select = row.querySelector('select');
          const selectedValue = select.value;
          row.style.display = (selectedValue === priority) ? '' : 'none';
        });
      }

      document.addEventListener('DOMContentLoaded', () => {
        displayList();
      });