// Elements
const itemInput = document.getElementById('input-item');
const inputForm = document.getElementById('input-form');
const itemsContainer = document.querySelector('.display-items');
const deleteItemIcon = document.querySelectorAll('.clr-icon');
const clearBtn = document.getElementById('clear-items');
const filter = document.getElementById('filter-item');
const displaySection = document.querySelector('.display-section');
const submitBtn = document.getElementById('submit-btn');
let isEditMode = false;
let editItem;

// Add Items
const addItem = (e) => {
    e.preventDefault();
    const inputText = itemInput.value;
    if (inputText === '') {
        alert('Please Enter Item Name');
        return;
    }
    // Check if Duplicate
    let hasDuplicate = false;
    const items = itemsContainer.querySelectorAll('.item');
    items.forEach((item) => {
        const text = item.querySelector('.item-text');
        if (text.textContent.toLowerCase() === inputText.toLowerCase()) {
            hasDuplicate = true;
            alert('Item already exists');
            itemInput.value = '';
            return;
        }
    });

    if (hasDuplicate) {
        return;
    }

    if (isEditMode) {
        submitBtn.classList.remove('btn-green');
        submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i> ADD ITEM';

        const itemList = itemsContainer.querySelectorAll('.item');
        itemList.forEach((item) => {
            if (item.classList.contains('editItem')) {
                deleteItemFromLS(editItem);
                item.remove();
                isEditMode = false;
                editItem = '';
            }
        });

    }

    addItemsToDOM(inputText);
    addItemsToLS(inputText);
    checkUI();
    itemInput.value = '';
}

// Add Items to DOM
const addItemsToDOM = (item) => {
    // Create Item
    const itemContainer = document.createElement('div');
    itemContainer.className = 'item';

    const itemText = document.createElement('div');
    itemText.className = 'item-text';
    itemText.textContent = item;

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa-solid fa-xmark clr-icon';

    itemContainer.appendChild(itemText);
    itemContainer.appendChild(deleteIcon);

    itemsContainer.appendChild(itemContainer);
}

// Add Items to LS
const addItemsToLS = (item) => {
    let itemFromLS = getItemsFromLS();
    console.log(itemFromLS);
    itemFromLS.push(item);

    localStorage.setItem('items', JSON.stringify(itemFromLS));
}


// Get Items from LS
const getItemsFromLS = () => {
    let itemFromLS;
    if (localStorage.getItem('items') == null) {
        itemFromLS = [];
    } else {
        itemFromLS = JSON.parse(localStorage.getItem('items'));
    }
    return itemFromLS;
}

// Display Items from LS
const displayItems = () => {
    const items = getItemsFromLS();
    items.forEach((item) => {
        addItemsToDOM(item);
    });
}

// Delete Items from localS
const deleteItemFromLS = (item) => {
    let items = getItemsFromLS();

    items = items.filter((i) => i !== item);
    localStorage.setItem('items', JSON.stringify(items));
}

// Delete Item
const deleteItem = (e) => {
    if (e.target.classList.contains('clr-icon')) {
        e.target.parentElement.remove();
        deleteItemFromLS(e.target.parentElement.querySelector('.item-text').textContent);
    } else {
        updateElement(e.target);
    }
    checkUI();
}

// Update Element
const updateElement = (target) => {
    const itemList = itemsContainer.querySelectorAll('.item');
    itemList.forEach((item) => {
        item.classList.remove('editItem');
    });
    if (isEditMode) {
        isEditMode = false;
        submitBtn.classList.remove('btn-green');
        submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Add ITEM';
        itemInput.value = '';
        return;
    }
    let inputText;
    if (target.classList.contains('item')) {
        target.classList.add('editItem');
        inputText = target.querySelector('.item-text').textContent;
    } else {
        e.target.parentElement.classList.add('editItem');
        inputText = target.parentElement.querySelector('.item-text').textContent;
    }
    isEditMode = true;
    itemInput.value = inputText;
    submitBtn.classList.add('btn-green');
    submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i> UPDATE ITEM';
    editItem = inputText;

}

// Filter
const checkItems = (e) => {
    const toCheck = e.target.value.toLowerCase();
    let items = itemsContainer.querySelectorAll('.item');

    items.forEach((item) => {
        const itemText = item.querySelector('.item-text').textContent.toLowerCase();
        if (itemText.includes(toCheck)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

}

// Clear Items
const clearItems = () => {
    itemsContainer.innerHTML = '';
    localStorage.removeItem('items');
    checkUI();
}


const checkUI = () => {
    const items = itemsContainer.querySelectorAll('.item');
    if (items.length === 0) {
        displaySection.style.display = 'none';
    } else {
        displaySection.style.display = 'block';
    }
}

window.addEventListener('load', checkUI);
window.addEventListener('DOMContentLoaded', displayItems);
// Event Listeners
inputForm.addEventListener('submit', addItem);
itemsContainer.addEventListener('click', deleteItem);
clearBtn.addEventListener('click', clearItems);
filter.addEventListener('input', checkItems);
