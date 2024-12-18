import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  const navigate = useNavigate();
  const handleAddRecipe = () => {
    navigate('/addRecipe'); // Replace with your desired route
  };

  const handleBrowseRecipes = () => {
    navigate('/browseRecipes'); // Replace with your desired route
  };

  const handleEditRecipe = () => {
    navigate('/editRecipes'); // Replace with your desired route
  };

  const handleAddIngredient = () => {
    navigate('/addIngredient');
  }

  const handleEditIngredient = () => {
    navigate('/editIngredient');
  }

  return (
    <div className="main-page container-fluid">
      <div className='row section'>
        <button className="col" onClick={handleAddRecipe}>Add Recipe</button>
        <button className="col" onClick={handleBrowseRecipes}>Browse Recipes</button>
        <button className="col" onClick={handleEditRecipe}>Edit Recipe</button>
      </div>

      <div className='row section'>
        <button className="col" onClick={handleAddIngredient}>Add Ingredient</button>
        <button className="col" onClick={handleEditIngredient}>Edit Ingredient</button>
      </div>
      
    </div>
  );
}

export default MainPage;
