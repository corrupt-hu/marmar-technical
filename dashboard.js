document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Dynamic Metrics Animation
    const animateMetrics = () => {
        const metrics = document.querySelectorAll('.card p');
        metrics.forEach(metric => {
            const target = parseFloat(metric.textContent.replace(/[^0-9.]/g, '')) || 0;
            let count = 0;
            const increment = target / 50;
            const isCurrency = metric.textContent.includes('$');

            const updateCount = () => {
                count += increment;
                if (count < target) {
                    metric.textContent = isCurrency ? `$${Math.floor(count).toLocaleString()}` : Math.floor(count).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    metric.textContent = isCurrency ? `$${target.toLocaleString()}` : target.toLocaleString();
                }
            };
            updateCount();
        });
    };

    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateMetrics();
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    metricsObserver.observe(document.querySelector('.metrics'));

    // Notifications Toggle
    const notifications = document.querySelector('.notifications');
    notifications.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = notifications.querySelector('.notification-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', () => {
        document.querySelector('.notification-dropdown').style.display = 'none';
    });

    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Logged out successfully!');
        // Add actual logout logic here
    });
});

// Bulk Order Management
const selectAll = document.getElementById('selectAll');
const orderCheckboxes = document.querySelectorAll('.order-checkbox');
const bulkShipBtn = document.getElementById('bulkShip');
const bulkCancelBtn = document.getElementById('bulkCancel');

selectAll.addEventListener('change', () => {
    orderCheckboxes.forEach(cb => cb.checked = selectAll.checked);
    toggleBulkButtons();
});

orderCheckboxes.forEach(cb => {
    cb.addEventListener('change', toggleBulkButtons);
});

function toggleBulkButtons() {
    const checkedCount = document.querySelectorAll('.order-checkbox:checked').length;
    bulkShipBtn.disabled = checkedCount === 0;
    bulkCancelBtn.disabled = checkedCount === 0;
}

bulkShipBtn.addEventListener('click', () => {
    const selectedOrders = Array.from(document.querySelectorAll('.order-checkbox:checked'))
        .map(cb => cb.dataset.id);
    selectedOrders.forEach(id => {
        const row = document.querySelector(`td[data-id="${id}"]`).parentElement;
        row.querySelector('.status').textContent = 'Shipped';
        row.querySelector('.status').className = 'status shipped';
    });
    alert(`Marked ${selectedOrders.length} orders as shipped!`);
    resetBulkActions();
});

bulkCancelBtn.addEventListener('click', () => {
    const selectedOrders = Array.from(document.querySelectorAll('.order-checkbox:checked'))
        .map(cb => cb.dataset.id);
    alert(`Cancelled ${selectedOrders.length} orders!`);
    resetBulkActions();
});

function resetBulkActions() {
    selectAll.checked = false;
    orderCheckboxes.forEach(cb => cb.checked = false);
    bulkShipBtn.disabled = true;
    bulkCancelBtn.disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));

    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Logged out successfully!');
    });

    // Products Page Enhancements
    if (document.getElementById('addProductBtn')) {
        const productTable = document.getElementById('productTable');
        const productCards = document.getElementById('productCards');
        const addProductBtn = document.getElementById('addProductBtn');
        const toggleViewBtn = document.getElementById('toggleViewBtn');
        const exportProductsBtn = document.getElementById('exportProductsBtn');
        const batchUpdateBtn = document.getElementById('batchUpdateBtn');
        const productModal = document.getElementById('productModal');
        const batchUpdateModal = document.getElementById('batchUpdateModal');
        const modalClose = productModal.querySelector('.modal-close');
        const batchModalClose = batchUpdateModal.querySelector('.modal-close');
        const productForm = document.getElementById('productForm');
        const batchUpdateForm = document.getElementById('batchUpdateForm');
        const selectAllProducts = document.getElementById('selectAllProducts');
        const bulkDeleteBtn = document.getElementById('bulkDelete');
        const productSearch = document.getElementById('productSearch');
        const categoryFilter = document.getElementById('categoryFilter');
        const undoNotification = document.getElementById('undoNotification');
        const undoDeleteBtn = document.getElementById('undoDelete');
        let deletedProducts = [];
        let productOrder = Array.from(document.querySelectorAll('#productList tr')).map(row => row.dataset.id);

        // Toggle View
        toggleViewBtn.addEventListener('click', () => {
            if (productTable.classList.contains('active')) {
                productTable.classList.remove('active');
                productCards.classList.add('active');
                toggleViewBtn.innerHTML = '<i class="fas fa-th-large"></i> Toggle View';
            } else {
                productCards.classList.remove('active');
                productTable.classList.add('active');
                toggleViewBtn.innerHTML = '<i class="fas fa-table"></i> Toggle View';
            }
        });

        // Add/Edit Product Modal
        addProductBtn.addEventListener('click', () => {
            document.getElementById('modalTitle').textContent = 'Add Product';
            productForm.reset();
            productModal.style.display = 'block';
        });

        modalClose.addEventListener('click', () => productModal.style.display = 'none');
        batchModalClose.addEventListener('click', () => batchUpdateModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === productModal) productModal.style.display = 'none';
            if (e.target === batchUpdateModal) batchUpdateModal.style.display = 'none';
        });

        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const priceType = document.getElementById('priceType').value;
            const price = document.getElementById('productPrice').value;
            const dynamicPrice = document.getElementById('dynamicPrice').value || null;
            const dynamicStart = document.getElementById('dynamicStart').value;
            const dynamicEnd = document.getElementById('dynamicEnd').value;
            const duration = document.getElementById('productDuration').value;
            const maxPerDay = document.getElementById('productMaxPerDay').value;
            const slots = Array.from(document.getElementById('productSlots').selectedOptions).map(opt => opt.value).join(', ') || 'All Day';
            const blackoutDates = document.getElementById('blackoutDates').value;
            const variants = document.getElementById('productVariants').value.split(',').map(v => v.trim()).filter(v => v);
            const notes = document.getElementById('productNotes').value;
            const available = document.getElementById('productAvailable').checked;
            const imageFile = document.getElementById('productImage').files[0];
            const id = Date.now();

            const imageUrl = imageFile ? URL.createObjectURL(imageFile) : 'https://via.placeholder.com/50';
            const priceDisplay = dynamicPrice && dynamicStart && new Date(dynamicStart) <= new Date() && new Date(dynamicEnd) >= new Date()
                ? `AED ${dynamicPrice}${priceType === 'Hourly' ? '/hr' : ' (Flat)'}`
                : `AED ${price}${priceType === 'Hourly' ? '/hr' : ' (Flat)'}`;

            // Add to Table
            const tableRow = createProductRow(id, name, category, priceDisplay, duration, maxPerDay, slots, available, imageUrl, variants, notes, dynamicPrice, dynamicStart, dynamicEnd);
            document.getElementById('productList').appendChild(tableRow);

            // Add to Cards
            const card = createProductCard(id, name, category, priceDisplay, duration, maxPerDay, slots, available, imageUrl, variants, notes, dynamicPrice, dynamicStart, dynamicEnd);
            productCards.appendChild(card);

            attachProductActions(tableRow, card);
            productOrder.push(id.toString());
            productModal.style.display = 'none';
            productForm.reset();
        });

        // Product Creation Helpers
        function createProductRow(id, name, category, priceDisplay, duration, maxPerDay, slots, available, imageUrl, variants, notes, dynamicPrice, dynamicStart, dynamicEnd) {
            const row = document.createElement('tr');
            row.dataset.id = id;
            row.draggable = true;
            row.dataset.variants = JSON.stringify(variants);
            row.dataset.notes = notes;
            row.dataset.dynamicPrice = dynamicPrice || '';
            row.dataset.dynamicStart = dynamicStart || '';
            row.dataset.dynamicEnd = dynamicEnd || '';
            row.innerHTML = `
                <td><input type="checkbox" class="product-checkbox" data-id="${id}"></td>
                <td>${name}${variants.length ? ` (${variants.join(', ')})` : ''}</td>
                <td>${category}</td>
                <td>${priceDisplay}</td>
                <td>${duration} hrs</td>
                <td>${maxPerDay}</td>
                <td>${slots}</td>
                <td><input type="checkbox" ${available ? 'checked' : ''}></td>
                <td><img src="${imageUrl}" alt="${name}"></td>
                <td>
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    <button class="duplicate-btn"><i class="fas fa-copy"></i></button>
                </td>
            `;
            return row;
        }

        function createProductCard(id, name, category, priceDisplay, duration, maxPerDay, slots, available, imageUrl, variants, notes, dynamicPrice, dynamicStart, dynamicEnd) {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.dataset.id = id;
            card.draggable = true;
            card.dataset.variants = JSON.stringify(variants);
            card.dataset.notes = notes;
            card.dataset.dynamicPrice = dynamicPrice || '';
            card.dataset.dynamicStart = dynamicStart || '';
            card.dataset.dynamicEnd = dynamicEnd || '';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${name}">
                <h4>${name}${variants.length ? ` (${variants.join(', ')})` : ''}</h4>
                <p>Category: ${category}</p>
                <p>Price: ${priceDisplay}</p>
                <p>Duration: ${duration} hrs</p>
                <p>Max/Day: ${maxPerDay}</p>
                <p>Slots: ${slots}</p>
                <label>Available: <input type="checkbox" ${available ? 'checked' : ''}></label>
                <div class="card-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    <button class="duplicate-btn"><i class="fas fa-copy"></i></button>
                </div>
            `;
            return card;
        }

        // Product Actions
        function attachProductActions(row, card) {
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            const duplicateBtn = row.querySelector('.duplicate-btn');
            const cardEditBtn = card.querySelector('.edit-btn');
            const cardDeleteBtn = card.querySelector('.delete-btn');
            const cardDuplicateBtn = card.querySelector('.duplicate-btn');

            editBtn.addEventListener('click', () => editProduct(row, card));
            cardEditBtn.addEventListener('click', () => editProduct(row, card));
            deleteBtn.addEventListener('click', () => deleteProduct(row, card));
            cardDeleteBtn.addEventListener('click', () => deleteProduct(row, card));
            duplicateBtn.addEventListener('click', () => duplicateProduct(row, card));
            cardDuplicateBtn.addEventListener('click', () => duplicateProduct(row, card));
        }

        function editProduct(row, card) {
            document.getElementById('modalTitle').textContent = 'Edit Product';
            const cells = row.querySelectorAll('td');
            document.getElementById('productName').value = cells[1].textContent.split(' (')[0];
            document.getElementById('productCategory').value = cells[2].textContent;
            const priceParts = cells[3].textContent.split(' ');
            document.getElementById('priceType').value = priceParts[2] === '(Flat)' ? 'Flat' : 'Hourly';
            document.getElementById('productPrice').value = priceParts[1].replace('AED', '');
            document.getElementById('dynamicPrice').value = row.dataset.dynamicPrice;
            document.getElementById('dynamicStart').value = row.dataset.dynamicStart;
            document.getElementById('dynamicEnd').value = row.dataset.dynamicEnd;
            document.getElementById('productDuration').value = cells[4].textContent.replace(' hrs', '');
            document.getElementById('productMaxPerDay').value = cells[5].textContent;
            const slots = cells[6].textContent.split(', ').forEach(slot => {
                document.querySelector(`#productSlots option[value="${slot}"]`).selected = true;
            });
            document.getElementById('blackoutDates').value = ''; // Simplified for demo
            document.getElementById('productVariants').value = JSON.parse(row.dataset.variants).join(', ');
            document.getElementById('productNotes').value = row.dataset.notes;
            document.getElementById('productAvailable').checked = cells[7].querySelector('input').checked;
            productModal.style.display = 'block';

            productForm.onsubmit = (e) => {
                e.preventDefault();
                const priceDisplay = document.getElementById('dynamicPrice').value && new Date(document.getElementById('dynamicStart').value) <= new Date() && new Date(document.getElementById('dynamicEnd').value) >= new Date()
                    ? `AED ${document.getElementById('dynamicPrice').value}${document.getElementById('priceType').value === 'Hourly' ? '/hr' : ' (Flat)'}`
                    : `AED ${document.getElementById('productPrice').value}${document.getElementById('priceType').value === 'Hourly' ? '/hr' : ' (Flat)'}`;
                const variants = document.getElementById('productVariants').value.split(',').map(v => v.trim()).filter(v => v);
                const slots = Array.from(document.getElementById('productSlots').selectedOptions).map(opt => opt.value).join(', ') || 'All Day';

                cells[1].textContent = `${document.getElementById('productName').value}${variants.length ? ` (${variants.join(', ')})` : ''}`;
                cells[2].textContent = document.getElementById('productCategory').value;
                cells[3].textContent = priceDisplay;
                cells[4].textContent = `${document.getElementById('productDuration').value} hrs`;
                cells[5].textContent = document.getElementById('productMaxPerDay').value;
                cells[6].textContent = slots;
                cells[7].querySelector('input').checked = document.getElementById('productAvailable').checked;
                const newImage = document.getElementById('productImage').files[0];
                if (newImage) cells[8].querySelector('img').src = URL.createObjectURL(newImage);
                row.dataset.variants = JSON.stringify(variants);
                row.dataset.notes = document.getElementById('productNotes').value;
                row.dataset.dynamicPrice = document.getElementById('dynamicPrice').value;
                row.dataset.dynamicStart = document.getElementById('dynamicStart').value;
                row.dataset.dynamicEnd = document.getElementById('dynamicEnd').value;

                card.querySelector('h4').textContent = cells[1].textContent;
                card.querySelector('p:nth-child(2)').textContent = `Category: ${cells[2].textContent}`;
                card.querySelector('p:nth-child(3)').textContent = `Price: ${priceDisplay}`;
                card.querySelector('p:nth-child(4)').textContent = `Duration: ${cells[4].textContent}`;
                card.querySelector('p:nth-child(5)').textContent = `Max/Day: ${cells[5].textContent}`;
                card.querySelector('p:nth-child(6)').textContent = `Slots: ${slots}`;
                card.querySelector('input').checked = cells[7].querySelector('input').checked;
                if (newImage) card.querySelector('img').src = URL.createObjectURL(newImage);
                card.dataset.variants = row.dataset.variants;
                card.dataset.notes = row.dataset.notes;
                card.dataset.dynamicPrice = row.dataset.dynamicPrice;
                card.dataset.dynamicStart = row.dataset.dynamicStart;
                card.dataset.dynamicEnd = row.dataset.dynamicEnd;

                productModal.style.display = 'none';
                productForm.reset();
                productForm.onsubmit = null;
            };
        }

        function deleteProduct(row, card) {
            deletedProducts.push({ row: row.cloneNode(true), card: card.cloneNode(true), id: row.dataset.id });
            row.remove();
            card.remove();
            productOrder = productOrder.filter(id => id !== row.dataset.id);
            showUndoNotification();
            updateBulkButtons();
        }

        function duplicateProduct(row, card) {
            const newId = Date.now();
            const newRow = row.cloneNode(true);
            const newCard = card.cloneNode(true);
            newRow.dataset.id = newId;
            newCard.dataset.id = newId;
            newRow.querySelector('.product-checkbox').dataset.id = newId;
            document.getElementById('productList').appendChild(newRow);
            productCards.appendChild(newCard);
            attachProductActions(newRow, newCard);
            productOrder.push(newId.toString());
            updateBulkButtons();
        }

        document.querySelectorAll('#productList tr').forEach(row => {
            const card = productCards.querySelector(`.product-card[data-id="${row.dataset.id}"]`);
            attachProductActions(row, card);
        });

        // Bulk Actions
        selectAllProducts.addEventListener('change', () => {
            document.querySelectorAll('.product-checkbox').forEach(cb => cb.checked = selectAllProducts.checked);
            updateBulkButtons();
        });

        document.querySelectorAll('.product-checkbox').forEach(cb => {
            cb.addEventListener('change', updateBulkButtons);
        });

        function updateBulkButtons() {
            const checkedCount = document.querySelectorAll('.product-checkbox:checked').length;
            bulkDeleteBtn.disabled = checkedCount === 0;
            batchUpdateBtn.disabled = checkedCount === 0;
        }

        bulkDeleteBtn.addEventListener('click', () => {
            document.querySelectorAll('.product-checkbox:checked').forEach(cb => {
                const id = cb.dataset.id;
                const row = document.querySelector(`tr[data-id="${id}"]`);
                const card = document.querySelector(`.product-card[data-id="${id}"]`);
                deletedProducts.push({ row: row.cloneNode(true), card: card.cloneNode(true), id });
                row.remove();
                card.remove();
                productOrder = productOrder.filter(pid => pid !== id);
            });
            showUndoNotification();
            updateBulkButtons();
        });

        // Undo Delete
        function showUndoNotification() {
            undoNotification.style.display = 'block';
            setTimeout(() => {
                undoNotification.style.display = 'none';
                deletedProducts = [];
            }, 5000);
        }

        undoDeleteBtn.addEventListener('click', () => {
            deletedProducts.forEach(product => {
                document.getElementById('productList').appendChild(product.row);
                productCards.appendChild(product.card);
                attachProductActions(product.row, product.card);
                productOrder.push(product.id);
            });
            undoNotification.style.display = 'none';
            deletedProducts = [];
            updateBulkButtons();
        });

        // Search and Filter
        function filterProducts() {
            const searchTerm = productSearch.value.toLowerCase();
            const category = categoryFilter.value;
            document.querySelectorAll('#productList tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                const rowCategory = row.querySelector('td:nth-child(3)').textContent;
                const card = productCards.querySelector(`.product-card[data-id="${row.dataset.id}"]`);
                const matchesSearch = text.includes(searchTerm);
                const matchesCategory = !category || rowCategory === category;
                const display = matchesSearch && matchesCategory ? '' : 'none';
                row.style.display = display;
                card.style.display = display;
            });
        }

        productSearch.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);

        // Export to CSV
        exportProductsBtn.addEventListener('click', () => {
            const products = Array.from(document.querySelectorAll('#productList tr')).map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    Name: cells[1].textContent,
                    Category: cells[2].textContent,
                    Price: cells[3].textContent,
                    Duration: cells[4].textContent,
                    'Max/Day': cells[5].textContent,
                    Slots: cells[6].textContent,
                    Available: cells[7].querySelector('input').checked ? 'Yes' : 'No',
                    Variants: JSON.parse(row.dataset.variants).join(', '),
                    Notes: row.dataset.notes,
                    'Dynamic Price': row.dataset.dynamicPrice,
                    'Dynamic Start': row.dataset.dynamicStart,
                    'Dynamic End': row.dataset.dynamicEnd
                };
            });

            const csvContent = 'data:text/csv;charset=utf-8,' +
                'Name,Category,Price,Duration,Max/Day,Slots,Available,Variants,Notes,Dynamic Price,Dynamic Start,Dynamic End\n' +
                products.map(p => `${p.Name},${p.Category},${p.Price},${p.Duration},${p['Max/Day']},${p.Slots},${p.Available},${p.Variants},${p.Notes},${p['Dynamic Price']},${p['Dynamic Start']},${p['Dynamic End']}`).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'products.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // Batch Update Pricing
        batchUpdateBtn.addEventListener('click', () => {
            batchUpdateModal.style.display = 'block';
        });

        batchUpdateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('adjustmentType').value;
            const amount = parseFloat(document.getElementById('adjustmentAmount').value);
            const applyToAll = document.getElementById('applyToAll').checked;

            document.querySelectorAll('.product-checkbox' + (applyToAll ? '' : ':checked')).forEach(cb => {
                const row = document.querySelector(`tr[data-id="${cb.dataset.id}"]`);
                const card = document.querySelector(`.product-card[data-id="${cb.dataset.id}"]`);
                const priceCell = row.querySelector('td:nth-child(4)');
                const priceParts = priceCell.textContent.split(' ');
                let basePrice = parseFloat(priceParts[1].replace('AED', ''));
                
                if (type === 'percentage') {
                    basePrice *= (1 + amount / 100);
                } else {
                    basePrice += amount;
                }
                priceCell.textContent = `AED ${basePrice.toFixed(2)}${priceParts[2]}`;
                card.querySelector('p:nth-child(3)').textContent = `Price: ${priceCell.textContent}`;
            });

            batchUpdateModal.style.display = 'none';
            batchUpdateForm.reset();
        });

        // Drag-and-Drop Reordering
        let draggedItem = null;

        document.querySelectorAll('#productList tr, .product-card').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = item;
                e.dataTransfer.setData('text/plain', item.dataset.id);
            });

            item.addEventListener('dragover', (e) => e.preventDefault());

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const targetId = item.dataset.id;
                const draggedId = draggedItem.dataset.id;
                const targetIndex = productOrder.indexOf(targetId);
                const draggedIndex = productOrder.indexOf(draggedId);

                productOrder.splice(draggedIndex, 1);
                productOrder.splice(targetIndex, 0, draggedId);

                const tbody = document.getElementById('productList');
                const cardContainer = document.getElementById('productCards');
                tbody.innerHTML = '';
                cardContainer.innerHTML = '';

                productOrder.forEach(id => {
                    const row = document.querySelector(`tr[data-id="${id}"]`) || draggedItem.parentNode.querySelector(`tr[data-id="${id}"]`);
                    const card = document.querySelector(`.product-card[data-id="${id}"]`) || draggedItem.parentNode.querySelector(`.product-card[data-id="${id}"]`);
                    tbody.appendChild(row);
                    cardContainer.appendChild(card);
                });
            });
        });

        // Mock API Availability Check (runs every 10 seconds)
        setInterval(() => {
            document.querySelectorAll('#productList tr').forEach(row => {
                const maxPerDay = parseInt(row.querySelector('td:nth-child(6)').textContent);
                const mockBookings = Math.floor(Math.random() * (maxPerDay + 1)); // Simulate bookings
                const availableCell = row.querySelector('td:nth-child(8) input');
                const card = productCards.querySelector(`.product-card[data-id="${row.dataset.id}"]`);
                availableCell.disabled = mockBookings >= maxPerDay;
                if (card) card.querySelector('input').disabled = mockBookings >= maxPerDay;
            });
        }, 10000);
    }

    // Other subpage logic...
});




document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Logout Buttons
    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        alert('Logged out successfully!');
        window.location.href = 'login.html'; // Assuming a login page exists
    };
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('logoutProfile').addEventListener('click', logout);

    // User Profile Actions
    document.getElementById('viewProfile').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Profile view not implemented yet.');
        // Future: Open profile modal or redirect
    });
    document.getElementById('settings').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Settings not implemented yet.');
        // Future: Open settings modal
    });

    // Global Search
    document.getElementById('globalSearch').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const orders = document.querySelectorAll('.order-list li');
        const tasks = document.querySelectorAll('.task-list li');
        orders.forEach(order => {
            order.style.display = order.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
        tasks.forEach(task => {
            task.style.display = task.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    });

    // Hero Metrics Buttons
    document.getElementById('refreshRevenue').addEventListener('click', () => {
        const revenue = document.getElementById('todayRevenue');
        revenue.textContent = Math.floor(Math.random() * 1000 + 500); // Mock update
        revenue.parentElement.classList.add('pulse');
        setTimeout(() => revenue.parentElement.classList.remove('pulse'), 500);
    });

    document.getElementById('viewOrders').addEventListener('click', () => {
        window.location.href = 'orders.html';
    });

    document.getElementById('ratingDetails').addEventListener('click', () => {
        alert(`Average Rating: ${document.getElementById('avgRating').textContent}\nBased on recent customer feedback.`);
        // Future: Open detailed rating modal
    });

    // Quick Stats Buttons
    document.getElementById('managePending').addEventListener('click', () => {
        window.location.href = 'orders.html?filter=pending';
    });

    document.getElementById('viewCustomers').addEventListener('click', () => {
        window.location.href = 'customers.html';
    });

    document.getElementById('manageServices').addEventListener('click', () => {
        window.location.href = 'products.html';
    });

    // Recent Orders
    document.getElementById('refreshOrders').addEventListener('click', () => {
        const orderList = document.getElementById('orderList');
        const mockOrder = `<li data-id="${Date.now()}"><span>#${Math.floor(Math.random() * 10000)} - New Customer</span><span class="status pending">Pending</span><button class="order-btn" data-action="view"><i class="fas fa-eye"></i></button></li>`;
        orderList.insertAdjacentHTML('afterbegin', mockOrder);
        attachOrderActions(orderList.children[0]);
    });

    function attachOrderActions(order) {
        const btn = order.querySelector('.order-btn');
        const action = btn.dataset.action;
        btn.addEventListener('click', () => {
            const id = order.dataset.id;
            if (action === 'view') window.location.href = `orders.html#${id}`;
            else if (action === 'track') alert(`Tracking for Order #${id}: In transit`);
            else if (action === 'details') alert(`Details for Order #${id}: Delivered on Mar 28`);
        });
    }
    document.querySelectorAll('.order-btn').forEach(attachOrderActions);

    // Task Scheduler
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDue = document.getElementById('taskDue');
    const taskList = document.getElementById('taskList');

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (taskInput.value.trim()) {
            const id = Date.now();
            const dueDate = new Date(taskDue.value);
            const today = new Date();
            const dueText = dueDate.toDateString() === today.toDateString() ? 'Due Today' : `Due ${dueDate.toLocaleDateString()}`;
            const li = document.createElement('li');
            li.dataset.id = id;
            li.innerHTML = `
                <input type="checkbox" id="task${id}">
                <label for="task${id}">${taskInput.value}</label>
                <span class="due">${dueText}</span>
                <button class="task-btn" data-action="edit"><i class="fas fa-edit"></i></button>
            `;
            taskList.appendChild(li);
            attachTaskActions(li);
            taskInput.value = '';
            taskDue.value = today.toISOString().split('T')[0];
        }
    });

    function attachTaskActions(task) {
        const checkbox = task.querySelector('input[type="checkbox"]');
        const btn = task.querySelector('.task-btn');
        checkbox.addEventListener('change', () => {
            task.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            task.style.opacity = checkbox.checked ? '0.6' : '1';
        });
        btn.addEventListener('click', () => {
            if (btn.dataset.action === 'edit') {
                const label = task.querySelector('label');
                const newText = prompt('Edit Task:', label.textContent);
                if (newText) label.textContent = newText;
            } else if (btn.dataset.action === 'delete') {
                task.remove();
            }
        });
    }
    document.querySelectorAll('.task-list li').forEach(attachTaskActions);

    document.getElementById('clearTasks').addEventListener('click', () => {
        if (confirm('Clear all completed tasks?')) {
            document.querySelectorAll('.task-list input:checked').forEach(cb => cb.parentElement.remove());
        }
    });

    // Weather Widget
    document.getElementById('refreshWeather').addEventListener('click', () => {
        const temp = Math.floor(Math.random() * 5) + 30; // 30-34°C
        const desc = temp > 32 ? 'Sunny - High AC Demand' : 'Sunny - Moderate Demand';
        document.getElementById('weatherTemp').textContent = temp;
        document.getElementById('weatherDesc').textContent = desc;
    });

    // Quick Actions
    document.getElementById('quickAddProduct').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'products.html#add';
    });

    document.getElementById('quickAddOrder').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'orders.html#add';
    });

    document.getElementById('quickAddTask').addEventListener('click', (e) => {
        e.preventDefault();
        taskInput.focus();
    });

    document.getElementById('quickGenerateReport').addEventListener('click', (e) => {
        e.preventDefault();
        const csv = 'Date,Revenue,Orders\nMar 28,1250,12';
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        link.download = 'daily_report.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});

// Dark Theme Styles (Add to CSS or as a separate <style> tag)
const darkThemeStyles = `
    body.dark-theme {
        background: #1a1a2e;
        color: #e0e0e0;
    }
    .sidebar {
        background: linear-gradient(135deg, #16213e, #0f3460);
    }
    .dashboard-header {
        background: linear-gradient(90deg, #e94560, #ff6b6b);
    }
    .hero-card, .widget {
        background: #16213e;
        box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
    }
    .metric, .stat-item h4, .order-list li, .task-list li {
        color: #e0e0e0;
    }
    .search-bar input {
        background: #0f3460;
        color: #e0e0e0;
    }
    .profile-dropdown {
        background: #16213e;
    }
`;
document.head.insertAdjacentHTML('beforeend', `<style>${darkThemeStyles}</style>`);


document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle (Global)
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }

    // Theme Toggle (Global)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Logout (Global)
    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        localStorage.removeItem('vendorProfile'); // Clear profile data on logout
        alert('Logged out successfully!');
        window.location.href = 'login.html'; // Assuming a login page
    };
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutProfile = document.getElementById('logoutProfile');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (logoutProfile) logoutProfile.addEventListener('click', logout);

    // Profile Page Functionality
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        // DOM Elements
        const vendorAvatar = document.getElementById('vendorAvatar');
        const headerAvatar = document.getElementById('headerAvatar');
        const avatarUpload = document.getElementById('avatarUpload');
        const vendorName = document.getElementById('vendorName');
        const headerName = document.getElementById('headerName');
        const vendorEmail = document.getElementById('vendorEmail');
        const editProfileBtn = document.getElementById('editProfileBtn');
        const profileForm = document.getElementById('profileForm');
        const saveProfile = document.getElementById('saveProfile');
        const cancelEdit = document.getElementById('cancelEdit');
        const activityList = document.getElementById('activityList');
        const clearActivity = document.getElementById('clearActivity');
        const emailNotifications = document.getElementById('emailNotifications');
        const smsAlerts = document.getElementById('smsAlerts');
        const enable2FA = document.getElementById('enable2FA');
        const twoFactor = document.getElementById('twoFactor');
        const globalSearch = document.getElementById('globalSearch');

        // Load Profile Data (Mock)
        let profileData = JSON.parse(localStorage.getItem('vendorProfile')) || {
            avatar: 'https://via.placeholder.com/120',
            name: 'John Doe',
            email: 'john.doe@marmar.ae',
            businessName: 'Mar Mar Technical Services',
            contactNumber: '+971-50-123-4567',
            address: '123 Al Maktoum St, Dubai, UAE',
            tradeLicense: 'TRN123456',
            emailNotifications: true,
            smsAlerts: false,
            twoFactor: false
        };

        // Initialize UI with Profile Data
        function loadProfileData() {
            if (vendorAvatar) vendorAvatar.src = profileData.avatar;
            if (headerAvatar) headerAvatar.src = profileData.avatar;
            if (vendorName) vendorName.textContent = profileData.name;
            if (headerName) headerName.textContent = profileData.name;
            if (vendorEmail) vendorEmail.textContent = profileData.email;
            if (document.getElementById('businessName')) document.getElementById('businessName').value = profileData.businessName;
            if (document.getElementById('contactNumber')) document.getElementById('contactNumber').value = profileData.contactNumber;
            if (document.getElementById('businessAddress')) document.getElementById('businessAddress').value = profileData.address;
            if (document.getElementById('tradeLicense')) document.getElementById('tradeLicense').value = profileData.tradeLicense;
            if (emailNotifications) emailNotifications.checked = profileData.emailNotifications;
            if (smsAlerts) smsAlerts.checked = profileData.smsAlerts;
            if (twoFactor) {
                twoFactor.checked = profileData.twoFactor;
                if (enable2FA) enable2FA.textContent = profileData.twoFactor ? 'Disable' : 'Enable';
            }
        }
        loadProfileData();

        // Avatar Upload
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const imageUrl = reader.result;
                        if (vendorAvatar) vendorAvatar.src = imageUrl;
                        if (headerAvatar) headerAvatar.src = imageUrl;
                        profileData.avatar = imageUrl;
                        localStorage.setItem('vendorProfile', JSON.stringify(profileData));
                        logActivity('Updated profile picture');
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select a valid image file.');
                }
            });
        }

        // Edit Profile
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                profileForm.querySelectorAll('input:not([type="checkbox"]), textarea').forEach(input => {
                    input.removeAttribute('readonly');
                    input.style.background = '#fff';
                });
                saveProfile.style.display = 'inline-block';
                cancelEdit.style.display = 'inline-block';
                editProfileBtn.style.display = 'none';
            });
        }

        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                profileData.businessName = document.getElementById('businessName').value.trim();
                profileData.contactNumber = document.getElementById('contactNumber').value.trim();
                profileData.address = document.getElementById('businessAddress').value.trim();
                profileData.tradeLicense = document.getElementById('tradeLicense').value.trim();
                localStorage.setItem('vendorProfile', JSON.stringify(profileData));
                profileForm.querySelectorAll('input:not([type="checkbox"]), textarea').forEach(input => {
                    input.setAttribute('readonly', true);
                    input.style.background = '#f9fafb';
                });
                saveProfile.style.display = 'none';
                cancelEdit.style.display = 'none';
                editProfileBtn.style.display = 'inline-block';
                logActivity('Updated business information');
                alert('Profile saved successfully!');
            });
        }

        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => {
                loadProfileData();
                profileForm.querySelectorAll('input:not([type="checkbox"]), textarea').forEach(input => {
                    input.setAttribute('readonly', true);
                    input.style.background = '#f9fafb';
                });
                saveProfile.style.display = 'none';
                cancelEdit.style.display = 'none';
                editProfileBtn.style.display = 'inline-block';
            });
        }

        // Activity Log
        function logActivity(message) {
            if (!activityList) return;
            const timestamp = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            const li = document.createElement('li');
            li.textContent = `${message} - ${timestamp}`;
            activityList.insertBefore(li, activityList.firstChild);
            // Limit to 10 entries
            while (activityList.children.length > 10) {
                activityList.removeChild(activityList.lastChild);
            }
        }

        if (clearActivity) {
            clearActivity.addEventListener('click', () => {
                if (confirm('Clear all activity logs?')) {
                    activityList.innerHTML = '';
                }
            });
        }

        // Settings Toggles
        if (emailNotifications) {
            emailNotifications.addEventListener('change', () => {
                profileData.emailNotifications = emailNotifications.checked;
                localStorage.setItem('vendorProfile', JSON.stringify(profileData));
                logActivity(`Turned email notifications ${emailNotifications.checked ? 'on' : 'off'}`);
            });
        }

        if (smsAlerts) {
            smsAlerts.addEventListener('change', () => {
                profileData.smsAlerts = smsAlerts.checked;
                localStorage.setItem('vendorProfile', JSON.stringify(profileData));
                logActivity(`Turned SMS alerts ${smsAlerts.checked ? 'on' : 'off'}`);
            });
        }

        if (enable2FA && twoFactor) {
            enable2FA.addEventListener('click', () => {
                if (!twoFactor.checked) {
                    const code = prompt('Enter 2FA setup code (mock):');
                    if (code) {
                        twoFactor.checked = true;
                        enable2FA.textContent = 'Disable';
                        profileData.twoFactor = true;
                        localStorage.setItem('vendorProfile', JSON.stringify(profileData));
                        logActivity('Enabled Two-Factor Authentication');
                    }
                } else {
                    if (confirm('Disable Two-Factor Authentication?')) {
                        twoFactor.checked = false;
                        enable2FA.textContent = 'Enable';
                        profileData.twoFactor = false;
                        localStorage.setItem('vendorProfile', JSON.stringify(profileData));
                        logActivity('Disabled Two-Factor Authentication');
                    }
                }
            });
        }

        // Global Search
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const activities = activityList.querySelectorAll('li');
                activities.forEach(activity => {
                    activity.style.display = activity.textContent.toLowerCase().includes(term) ? '' : 'none';
                });
            });
        }
    }

    // Ensure Dark Theme Styles are Available
    const darkThemeStyles = `
        body.dark-theme {
            background: #1a1a2e;
            color: #e0e0e0;
        }
        .sidebar {
            background: linear-gradient(135deg, #16213e, #0f3460);
        }
        .dashboard-header {
            background: linear-gradient(90deg, #e94560, #ff6b6b);
        }
        .profile-card {
            background: #16213e;
            box-shadow: 0 6px 20px rgba(255, 255, 255, 0.1);
        }
        .profile-info h2, .profile-details h3, .profile-activity h3, .profile-settings h3 {
            color: #e0e0e0;
        }
        .form-group input, .form-group textarea {
            background: #0f3460;
            color: #e0e0e0;
            border-color: #1a1a2e;
        }
        .form-group input[readonly], .form-group textarea[readonly] {
            background: #16213e;
            color: #888;
        }
        .activity-list {
            border-color: #1a1a2e;
        }
        .activity-list li {
            color: #e0e0e0;
            border-bottom-color: #1a1a2e;
        }
        .settings-toggle label {
            color: #e0e0e0;
        }
    `;
    if (!document.querySelector('style#darkTheme')) {
        document.head.insertAdjacentHTML('beforeend', `<style id="darkTheme">${darkThemeStyles}</style>`);
    }
});