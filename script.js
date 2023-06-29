const itemform = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const items = itemList.querySelectorAll('li');
const formBtn = itemform.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.forEach(item => addItemToDom(item));

    checkUI();
}

function onSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value;

    //Validate Input
    if(newItem === ''){
        alert('Please add an item');
        return;
    }
    //Check for Edit Mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    else{
        if(checkIfItemExists(newItem)){
            alert('That item already exists!');
            return;
        }
    }

    // Create item DOM element
    addItemToDom(newItem)

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();
    itemInput.value = "";
}

function addItemToStorage(item){
    const itemsFromStorage = getItemFromStorage();

    // Add New Item to array
    itemsFromStorage.push(item);

    // Add New Item to local Storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items')==null){
        itemsFromStorage = []
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.includes(text)){
            item.style.display = 'flex';
        }
        else{
            item.style.display = 'none';
        }
    })

}

function createButton(classes) {
        const button = document.createElement('button');
        button.className = classes;
        const icon = createIcon("fa-solid fa-xmark");
        button.appendChild(icon);
        return button;
    }

    function createIcon(classes) {
        const icon = document.createElement('i');
        icon.className = classes;
        return icon;
    }

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    }
    else{
        setItemToEdit(e.target)
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item)
}

function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}

function removeItem(item){
    if(confirm("Are you sure to delete this item?")){
        // Remove item from DOM
        item.remove();

        //Remove item from Storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e){
    while(itemList.firstChild){
        itemList.firstChild.remove();
    }

    // CLEAR FROM localStorage
    // localStorage.clear() //every item will be deleted
    localStorage.removeItem('items');
}

function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');
    if(items.length>0){
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    else{
        clearBtn.style.display='none';
        itemFilter.style.display='none';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    return;
}

function addItemToDom(newItem){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem));

    const button = createButton("remove-item btn-link text-red");

    li.appendChild(button);
    itemList.appendChild(li);
}

//Initialize app

function init(){
    itemform.addEventListener('submit', onSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}

init()


// localStorage.setItem('name','Brad');
// console.log(localStorage.getItem('name'));
// localStorage.remove('name');
// localStorage.clear()