const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
};

const addItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate input
  if (newItem === '') {
    alert('Please enter an item.');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    deleteItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('This item already exists!');
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
};

const addItemToDOM = (item) => {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
};
const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

const addItemToStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const getItemsFromStorage = () => {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
};

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    deleteItem(e.target.parentElement.parentElement);
    deleteItemFromStorage(e.target.parentElement.parentElement.textContent);
  } else {
    setItemToEdit(e.target);
  }
};

const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
};

const setItemToEdit = (item) => {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  // Add style to know we're editing
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228b22';

  // Add items to edit back to form input
  itemInput.value = item.textContent;
};

const deleteItem = (item) => {
  if (confirm('Are you sure you want to delete?')) {
    item.remove();
    checkUI();
  }
};

const deleteItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out the item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Reset localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const clearAllItems = () => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from localStorage
  localStorage.removeItem('items');

  checkUI();
};

const filterItems = (e) => {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  if (items.length !== 0) {
    items.forEach((item) => {
      let nodeText = item.firstChild.textContent.toLowerCase();

      if (nodeText.indexOf(text) !== -1) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }
};

const checkUI = () => {
  itemInput.value = '';

  const items = document.querySelectorAll('li');

  if (items.length === 0) {
    clearButton.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
};

// Initialize app
const init = () => {
  // Even listeners
  itemForm.addEventListener('submit', addItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearButton.addEventListener('click', clearAllItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
