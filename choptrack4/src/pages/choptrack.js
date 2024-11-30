import React from 'react';
import '../styles/choptrack.css';

import Fridge from '../components/ChopTrack/Fridge.js';
import ShoppingList from '../components/ChopTrack/ShoppingList.js';
import Budget from '../components/ChopTrack/Budget.js';
import Orders from '../components/ChopTrack/Orders.js';

function App() {
  return (
    <div className="App">

      {/*ChopTrack*/}
      <div className = "ct-header">
        Hello Person
      </div>

      {/*Grid*/}
      <div className="row">

        {/* My Fridge*/}
        <div className="box">
          <Fridge />
        </div>
        <div className="box">
          <ShoppingList />
        </div>
      </div>
      <div className="row">
        <div className="box">
          <Budget />
        </div>
        <div className="box">
          <Orders />
        </div>
      </div>
    </div>
  );
}

export default App;