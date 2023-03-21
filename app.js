// Storage Controller 

// Item COntroller 
const ItemCtrl = (function() {
  // Item constructor 
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data structure /state 
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: '1200'},
      // {id: 0, name: 'Cookie', calories: '1200'},
      // {id: 0, name: 'Egg', calories: '1200'}
    ],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      // Create id 
      let ID;
      if (data.items.length > 0) {
        ID =  data.items[data.items.length - 1].id + 1;
      }else {
        ID = 0;
      }

      // Calories to number 
      calories = parseInt(calories);

      // create new item 
      newItem = new Item(ID, name, calories);

      // Add to item array 
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;

      // loop theough the items 
      data.items.forEach(item => {
        if (item.id === id) {
          found = item
        } 
      });
      return found;
    },
    setCurrentItem: function(item)  {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // Loop through item and add calories 
      data.items.forEach(item => {
        total += item.calories;
      });

      // Set total calories 
      data.totalCalories = total;

      // return total 
      return data.totalCalories;
    },
    logData: function() {
      return data
    }
  }
})();

// UI Controller 
const UICtrl = (function(){
  const UISelector = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  
  // Public methods
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;

      });

      // Insert list items 
      document.querySelector(UISelector.itemList).innerHTML = html;
    }, 

    getItemInput: function () {
      return {
        name: document.querySelector(UISelector.itemNameInput).value,
        calories: document.querySelector(UISelector.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // Show the list 
      document.querySelector(UISelector.itemList).style.display = 'block';
      
      // Create li Element 
      const li = document.createElement('li');
      // Add Class 
      li.className = 'collection-item';
      // Add id 
      li.id = `item-${item.id}`;
      // Add html 
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // Insert li item 
      document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function () {
      document.querySelector(UISelector.itemNameInput).value = '';
      document.querySelector(UISelector.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function () {
      document.querySelector(UISelector.itemList).style.display = 'none';
    },
    clearEditState: function() {
      UICtrl.clearInput();

      document.querySelector(UISelector.updateBtn).style.display = 'none';
      document.querySelector(UISelector.deleteBtn).style.display = 'none';
      document.querySelector(UISelector.backBtn).style.display = 'none';
      document.querySelector(UISelector.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelector.updateBtn).style.display = 'inline';
      document.querySelector(UISelector.deleteBtn).style.display = 'inline';
      document.querySelector(UISelector.backBtn).style.display = 'inline';
      document.querySelector(UISelector.addBtn).style.display = 'none';
    },
    showTotalCalories: function(total) {
      document.querySelector(UISelector.totalCalories).textContent = total;
    },
    getSelectors: function() {
      return UISelector;
    }
  }
})();

// App Controller 
const App = (function(ItemCtrl, UICtrl) {
  const loadEventListeners = function() {
    // Get ui selector 
    const UISelector = UICtrl.getSelectors();

    // Add item event 
    document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon click event 
    document.querySelector(UISelector.itemList).addEventListener('click', itemUpdateSubmit);
  }

  // Add item submit 
  const itemAddSubmit = function(e) {
    // console.log('Add');
    // Get form input from ui controller 
    const input = UICtrl.getItemInput();

    // Check for name and calories input 
    if (input.name !== '' && input.calories !== '') {
      // Add item 
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI List
      UICtrl.addListItem(newItem);

      // Get total calories 
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Clear input field 
      UICtrl.clearInput();
    }
    
    // console.log(input);
    
    e.preventDefault();
  }

  // Update item submit 
  const itemUpdateSubmit = function(e) {
    if (e.target.classList.contains('edit-item')) {
      // Get the list item id 
      const listId = e.target.parentNode.parentNode.id;

      // Break into and array 
      const listIdArr = listId.split('-');

      // Get the actual id 
      const id = parseInt(listIdArr[1]);

      // Get item 
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current state 
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form 
      UICtrl.addItemToForm();
    }

    
    
    e.preventDefault();
  }
  
  // Public method 
  return {
    init: function(){
      // console.log('Initialixing App...');

      // Clear edit sate / set initial state 
      UICtrl.clearEditState();

      // Fetch items from data structure 
      const items = ItemCtrl.getItems();

      // Check if any items 
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items 
        UICtrl.populateItemList(items);
      }

      // Get total calories 
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners 
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);


// Initialize App 
App.init();