// Departamento.js
document.addEventListener('DOMContentLoaded', () => {
    const departmentListBody = document.getElementById('department-list-body');
    const departmentFilter = document.getElementById('department-filter');
    const departmentSearch = document.getElementById('department-search');

    const btnView = document.getElementById('btn-view-department');
    const btnEdit = document.getElementById('btn-edit-department');

    const viewModal = document.getElementById('view-department-modal');
    const editModal = document.getElementById('edit-department-modal');

    const closeModalBtns = document.querySelectorAll('.close-modal');
    const form = document.getElementById('department-form');

    let selectedDepartment = null;
    let departments = [];

    // Obtener departamentos del backend
    async function fetchDepartments() {
        try {
            const response = await fetch('/api/departamentos'); // Ajusta la ruta
            departments = await response.json();
            renderDepartments(departments);
        } catch (error) {
            departmentListBody.innerHTML = `<tr><td colspan="5">Error al cargar departamentos.</td></tr>`;
            console.error('Error al obtener departamentos:', error);
        }
    }

    // Renderizar lista
    function renderDepartments(list) {
        if (list.length === 0) {
            departmentListBody.innerHTML = `<tr><td colspan="5">No se encontraron departamentos.</td></tr>`;
            return;
        }

        departmentListBody.innerHTML = '';
        list.forEach(dep => {
            const row = document.createElement('tr');
            row.dataset.id = dep.id;
            row.innerHTML = `
                <td>${dep.name}</td>
                <td>${dep.status}</td>
                <td>${dep.creationDate}</td>
                <td>${dep.updateDate}</td>
                <td>
                    <button class="btn btn-secondary btn-sm view-btn"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-primary btn-sm edit-btn"><i class="fas fa-edit"></i></button>
                </td>
            `;
            departmentListBody.appendChild(row);
        });
    }

    // Filtros
    departmentFilter.addEventListener('change', () => {
        const value = departmentFilter.value;
        const filtered = value === 'all' ? departments : departments.filter(dep => dep.status.toLowerCase() === value);
        renderDepartments(filtered);
    });

    departmentSearch.addEventListener('input', () => {
        const query = departmentSearch.value.toLowerCase();
        const filtered = departments.filter(dep => dep.name.toLowerCase().includes(query));
        renderDepartments(filtered);
    });

    // Mostrar modal de vista
    departmentListBody.addEventListener('click', e => {
        const row = e.target.closest('tr');
        const id = row?.dataset.id;
        if (!id) return;

        const department = departments.find(dep => dep.id == id);
        if (!department) return;

        selectedDepartment = department;

        if (e.target.closest('.view-btn')) {
            document.getElementById('view-department-code').textContent = department.code;
            document.getElementById('view-department-name').textContent = department.name;
            document.getElementById('view-department-date').textContent = department.creationDate;
            document.getElementById('view-department-status').textContent = department.status;
            document.getElementById('view-department-director').textContent = department.director;
            document.getElementById('view-department-description').textContent = department.description;
            viewModal.style.display = 'block';
        }

        // Mostrar modal de edición
        if (e.target.closest('.edit-btn')) {
            document.getElementById('edit-department-id').value = department.id;
            document.getElementById('department-code-input').value = department.code;
            document.getElementById('edit-department-name').value = department.name;
            document.getElementById('department-director-input').value = department.director;
            document.getElementById('edit-department-status').value = department.status;
            document.getElementById('department-description-input').value = department.description;
            editModal.style.display = 'block';
        }
    });

    // Cierre de modales
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    });

    // Guardar cambios del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('edit-department-id').value;
        const updatedDepartment = {
            name: document.getElementById('edit-department-name').value,
            director: document.getElementById('department-director-input').value,
            status: document.getElementById('edit-department-status').value,
            description: document.getElementById('department-description-input').value,
        };

        try {
            const response = await fetch(`/api/departamentos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDepartment)
            });

            if (!response.ok) throw new Error('Error al actualizar');

            editModal.style.display = 'none';
            await fetchDepartments(); // Recargar datos
        } catch (error) {
            console.error('Error al actualizar departamento:', error);
        }
    });

    // Inicialización
    fetchDepartments();
});
