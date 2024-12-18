import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
// import AddRecipe from './components/AddRecipe';
// import EditRecipe from './components/EditRecipe';
// import AddIngredient from './components/AddIngredient';
// import EditIngredient from './components/EditIngredient';
import BrowseRecipes from './BrowseRecipes';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" exact element={<MainPage />} />
          <Route path="/browseRecipes" element={<BrowseRecipes />} />
          <Route path="/browseRecipes/Subcategory/:maincategoryName" element={<BrowseRecipes />} />
        </Routes>
      </Router>
    );
  }
}

export default App;