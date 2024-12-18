import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './BrowseRecipes.css'; // CSS file for styling

function BrowseRecipes() {
  const [recipes, setRecipes] = useState([]); // Holds recipes data
  const [categories, setCategories] = useState([]); // Holds categories or subcategories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { maincategoryName } = useParams(); // Get the dynamic route parameter

  // Fetch recipes and categories (or subcategories if a main category is selected)
  const fetchRecipes = async () => {
    try {
      setLoading(true);

      // If there's a main category name, fetch subcategories
      const url = maincategoryName
        ? `http://localhost:5000/api/browseRecipes/Subcategory/${maincategoryName}`
        : 'http://localhost:5000/api/browseRecipes';

      const response = await axios.get(url);
      setRecipes(response.data.recipes || []);
      console.log(response.data);
      console.log(response.data.recipes);

      // If we are in a main category, display subcategories
      if (maincategoryName) {
        setCategories(response.data.subcategories || []);
      } else {
        // Otherwise, display main categories
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [maincategoryName]);

  // Handle when a category or subcategory button is clicked
  const handleCategoryClick = (categoryName) => {
    navigate(`/browseRecipes/Subcategory/${categoryName}`);
  };

  return (
    <div className="browse-recipes-container">
      {/* Sidebar for Categories or Subcategories */}
      <aside className="sidebar">
        <h3>{maincategoryName ? 'Subcategories' : 'Main Categories'}</h3>
        <ul className="categories-list">
          {categories.map((category, index) => (
            <li key={index}>
              <button
                className="category-button"
                onClick={() =>
                  handleCategoryClick(category.sub_category_name || category.category_name)
                }
              >
                {category.sub_category_name || category.category_name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>Browse Recipes</h1>
        {loading && <p>Loading recipes...</p>}
        {error && <p className="error">{error}</p>}

        {/* Recipes Grid */}
        {recipes.length > 0 ? (
          <div className="recipes-list">
            {recipes.map((recipe) => (
              <div key={recipe.image_id} className="recipe-item card">
                <img
                  src={`http://localhost:5000/uploads/${recipe.image_id}.jpg`}
                  alt={recipe.recipe_name}
                  className="card-img"
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.recipe_name}</h5>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recipes available.</p>
        )}
      </main>
    </div>
  );
}

export default BrowseRecipes;
