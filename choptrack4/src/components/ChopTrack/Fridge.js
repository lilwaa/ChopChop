import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig.js';
import {getUserData} from '../../firebase/userService.js';
import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import Calendar from 'react-calendar';
import { Checkbox, FormControlLabel, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Fridge.css';

function Fridge() {
  const [groceryItems, setGroceryItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // State to track selected date
  const [itemsOnSelectedDate, setItemsOnSelectedDate] = useState([]); // State to track items for the selected date
  const [checkedItems, setCheckedItems] = useState([]); // checkbox
  const [openAddAlertDialog, setOpenAddAlertDialog] = useState(false); // To control Add Alert Modal visibility
  const [openConfirmDeletionDialog, setOpenConfirmDeletionDialog] = useState(false); // To control Confirmation Dialog visibility
  const [itemToDelete, setItemToDelete] = useState(null); // To store the item to be deleted

  // Add alert form fields
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    reminderDate: '',
    cost: '',
    savings: '',
    unit: '',
    unitPrice: {
      price: '',
      unit: ''
    }
  });

  let userData = null;

    const fetchUserData = async () => {
        if (!userData) { // Fetch only if not already fetched
          try {
            userData = await getUserData();
            console.log(`Fetched User Data:`, userData);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            throw error;
          }
        }
        return userData;
    };

  // Fetch grocery items from Firestore
  const fetchItems = async () => {
    await fetchUserData();
    if (!userData) return;

    const userDocRef = doc(db, 'users', userData.uid);
    const itemRef = collection(userDocRef, 'fridge');

    const querySnapshot = await getDocs(itemRef);
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id, // Ensure Firestore doc ID is assigned
      ...doc.data()
    }));
    setGroceryItems(items);
  };

  // Fetch items on initial load
  useEffect(() => {
    fetchItems();
  }, []);

  // Group items by their reminder date
  const getItemsByDate = () => {
    const itemsByDate = {};
    groceryItems.forEach(item => {
      if (item.reminderDate) {
        // Ensure reminderDate is a Date object
        const reminderDate = item.reminderDate.toDate ? item.reminderDate.toDate() : new Date(item.reminderDate);
        const dateStr = reminderDate.toLocaleDateString(); // Format the date to match the calendar
        if (!itemsByDate[dateStr]) {
          itemsByDate[dateStr] = [];
        }
        itemsByDate[dateStr].push(item);
      }
    });
    return itemsByDate;
  };

  // Function to handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = date.toLocaleDateString();
    const itemsByDate = getItemsByDate();
    
    if (itemsByDate[dateStr]) {
      setItemsOnSelectedDate(itemsByDate[dateStr]); // Set items due on the selected date
    } else {
      setItemsOnSelectedDate([]); // If no items for the selected date, clear the list
    }
  };

  // Function to handle custom styling based on the number of items
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const itemsByDate = getItemsByDate();
      const dateStr = date.toLocaleDateString();
      
      if (itemsByDate[dateStr]) {
        if (itemsByDate[dateStr].length === 1) {
          return 'green-day'; // One item
        } else if (itemsByDate[dateStr].length > 1) {
          return 'orange-day'; // Multiple items
        }
      }
    }
    return '';
  };

  // Format the item text based on quantity, unit, and unit price
  const formatItemText = (item) => {
    if (!item.itemName) return '';
    let text = item.itemName;

    if (item.quantity) {
      // Add quantity if exists
      text = `${text} x ${item.quantity}`;
    }

    if (item.unit && item.unitPrice) {
      // Add unit and unitPrice if they exist
      text = `${text} ${item.unit} @${item.unitPrice.price}/${item.unitPrice.unit}`;
    }
    return text;
  };

  // Confirmation checkbox
  const handleCheckboxChange = async (itemId) => {
    setItemToDelete(itemId);
    setOpenConfirmDeletionDialog(true);
  };

  // Function to handle deletion after confirmation
  const handleDeleteConfirmation = async () => {
    await fetchUserData();
    if (!userData) return;

    if (itemToDelete) {
      const userDocRef = doc(db, 'users', userData.uid);
      const itemRef = doc(userDocRef, 'fridge', itemToDelete); 
      await deleteDoc(itemRef); 

      setGroceryItems(prevItems => prevItems.filter(item => item.id !== itemToDelete));
      setItemsOnSelectedDate(prevItems => prevItems.filter(item => item.id !== itemToDelete));
    }

    // Close the dialog
    setOpenConfirmDeletionDialog(false);
    setItemToDelete(null);
  };

  // Close dialog w/o delete
  const handleCancelDeletion = () => {
    setOpenConfirmDeletionDialog(false);
    setItemToDelete(null); 
  };

  // Handle refresh button click
  const handleRefreshClick = () => {
    fetchItems(); 
  };

  // Handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.includes('unitPrice')) {
      const [key] = name.split('.');
      setNewItem(prev => ({
        ...prev,
        unitPrice: {
          ...prev.unitPrice,
          [key]: value
        }
      }));
    } else {
      setNewItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Function to handle the form submission to add a new item
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetchUserData();
      if (!userData) return;
      const reminderDate = new Date(`${newItem.reminderDate}T00:00:00`); // Ensure time is 00:00:00 for that day
      const userDocRef = doc(db, 'users', userData.uid);
      await addDoc(collection(userDocRef, 'fridge'), {
        itemName: newItem.name,
        quantity: newItem.quantity,
        reminderDate: reminderDate,
        cost: newItem.cost,
        savings: newItem.savings,
        unit: newItem.unit,
        unitPrice: newItem.unitPrice,
      });

      // Reset form and close the modal
      setNewItem({
        name: '',
        quantity: '',
        reminderDate: '',
        cost: '',
        savings: '',
        unit: '',
        unitPrice: {
          price: '',
          unit: ''
        }
      });
      setOpenAddAlertDialog(false);
      fetchItems(); 
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

   // Handle the "Add Alert" button click to open the modal
   const handleAddAlertClick = () => {
    setOpenAddAlertDialog(true);
  };

  return (
    <div className="Fridge">
      <h2 className="title">Track Grocery Alerts</h2>
      
      <div className="fridge-container">
        {/* Left side: Calendar */}
        <div className="calendar-container">
          <Calendar 
            tileClassName={tileClassName}
            onClickDay={handleDateClick} // Handle date click
          />
        </div>

        {/* Right side: List of items for the selected date */}
        <div className="grocery-list">
          <h3>Items Due on {selectedDate ? selectedDate.toLocaleDateString() : ''}</h3>
          {itemsOnSelectedDate.length === 0 ? (
            <p>No items due on this date.</p>
          ) : (
            <ul>
              {itemsOnSelectedDate.map(item => (
                <li key={item.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)} // Call the updated checkbox handler
                        color="primary"
                      />
                    }
                    label={formatItemText(item)} // Display the formatted item text
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Buttons Container */}
      <div className="button-container">
        <div className="refresh-button-container">
          <Button variant="contained" color="primary" onClick={handleRefreshClick}>
            Refresh
          </Button>
        </div>
        
        {/* Add Alert Button */}
        <div className="add-alert-button-container">
          <Button variant="contained" color="secondary" onClick={handleAddAlertClick}>
            Add Alert
          </Button>
        </div>
      </div>
       {/* Add Alert Modal */}
       <Dialog open={openAddAlertDialog} onClose={() => setOpenAddAlertDialog(false)}>
        <DialogTitle>Add New Alert</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              label="Item Name"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={newItem.quantity}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reminder Date"
              name="reminderDate"
              type="date"
              value={newItem.reminderDate}
              onChange={handleInputChange}
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Cost"
              name="cost"
              value={newItem.cost}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Savings"
              name="savings"
              value={newItem.savings}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Unit"
              name="unit"
              value={newItem.unit}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Unit Price (Price)"
              name="unitPrice.price"
              value={newItem.unitPrice.price}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Unit Price (Unit)"
              name="unitPrice.unit"
              value={newItem.unitPrice.unit}
              onChange={handleInputChange}
              margin="normal"
            />
            <DialogActions>
              <Button onClick={() => setOpenAddAlertDialog(false)} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                Add Alert
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDeletionDialog} onClose={handleCancelDeletion}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to remove the alert for this item?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeletion} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmation} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Fridge;
