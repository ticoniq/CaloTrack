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
    hideList: function () {
      document.querySelector(UISelector.itemList).style.display = 'none';
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
  
  // Public method 
  return {
    init: function(){
      // console.log('Initialixing App...');

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