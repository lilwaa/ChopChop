import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
//import { Link } from 'react-router-dom';
import '../styles/RecipeSearch.css';

const FilterGroup = ({ title, options, expanded, onToggle, selectedOptions, onOptionChange }) => {
  useEffect(() => {
    // change the title dynamically
    document.title = 'ChopGuide';
  }, []); // runs only once after the component mounts

  const [showAll, setShowAll] = useState(false);
  const displayOptions = showAll ? options : options.slice(0, 6); // Show 6 options per row
  const hasMore = options.length > 6;
  const remainingOptions = options.length - 6;

  const getGroupClassName = (title) => {
    const baseClass = 'filter-group-button';
    const titleToClass = {
      "Diet Type": "diet-type",
      "Health Labels": "health-labels",
      "Cuisine Type": "cuisine-type",
      "Meal Type": "meal-type",
      "Dish Type": "dish-type"
    };
    return `${baseClass} ${titleToClass[title]}`;
  };

  return (
    <div className="filter-group">
      <button 
        onClick={onToggle} 
        className={getGroupClassName(title)}
        aria-expanded={expanded}
      >
        <span>{title}</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {expanded && (
        <div className="filter-content">
          <div className="filter-grid">
            {displayOptions.map((option) => (
              <label key={option} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => onOptionChange(option)}
                  className="filter-checkbox"
                />
                <span className="filter-label">{formatLabel(option)}</span>
              </label>
            ))}
          </div>
          
          {hasMore && (
            <div className="see-more-container">
              <button
                onClick={() => setShowAll(!showAll)}
                className="see-more-button"
              >
                {showAll ? 'Show less' : `See ${remainingOptions} more options`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const formatLabel = (label) => {
  if (label === 'DASH') return 'DASH';
  return label
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function RecipeSearch() {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    diet: [],
    health: [],
    cuisine: [],
    meal: [],
    dish: []
  });

  const [calorieRange, setCalorieRange] = useState({
    min: '',
    max: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isValidRange, setIsValidRange] = useState(true);

  const handleCalorieChange = (type, value) => {
    const newValue = value === '' ? '' : Math.max(0, Number(value));
    setCalorieRange(prev => ({
      ...prev,
      [type]: newValue
    }));
    
    if (type === 'max' && calorieRange.min !== '' && newValue !== '') {
      setIsValidRange(Number(calorieRange.min) <= Number(newValue));
    }
    if (type === 'min' && calorieRange.max !== '' && newValue !== '') {
      setIsValidRange(Number(newValue) <= Number(calorieRange.max));
    }
  };


  const filterGroups = {
    diet: {
      title: "Diet Type",
      options: [
        "balanced",
        "high-fiber",
        "high-protein",
        "low-carb",
        "low-fat",
        "low-sodium"
      ]
    },
    health: {
      title: "Health Labels",
      options: [
        "alcohol-cocktail",
        "alcohol-free",
        "celery-free",
        "crustacean-free",
        "dairy-free",
        "DASH",
        "egg-free",
        "fish-free",
        "fodmap-free",
        "gluten-free",
        "immuno-supportive",
        "keto-friendly",
        "kidney-friendly",
        "kosher",
        "low-fat-abs",
        "low-potassium",
        "low-sugar",
        "lupine-free",
        "Mediterranean",
        "mollusk-free",
        "mustard-free",
        "no-oil-added",
        "paleo",
        "peanut-free",
        "pescatarian",
        "pork-free",
        "red-meat-free",
        "sesame-free",
        "shellfish-free",
        "soy-free",
        "sugar-conscious",
        "sulfite-free",
        "tree-nut-free",
        "vegan",
        "vegetarian",
        "wheat-free"
      ]
    },
    cuisine: {
      title: "Cuisine Type",
      options: [
        "American",
        "Asian",
        "British",
        "Caribbean",
        "Central Europe",
        "Chinese",
        "Eastern Europe",
        "French",
        "Indian",
        "Italian",
        "Japanese",
        "Kosher",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "South American",
        "South East Asian"
      ]
    },
    meal: {
      title: "Meal Type",
      options: [
        "Breakfast",
        "Dinner",
        "Lunch",
        "Snack",
        "Teatime"
      ]
    },
    dish: {
      title: "Dish Type",
      options: [
        "Biscuits and cookies",
        "Bread",
        "Cereals",
        "Condiments and sauces",
        "Desserts",
        "Drinks",
        "Main course",
        "Pancake",
        "Preps",
        "Preserve",
        "Salad",
        "Sandwiches",
        "Side dish",
        "Soup",
        "Starter",
        "Sweets"
      ]
    }
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const handleOptionChange = (group, option) => {
    setSelectedFilters(prev => {
      const currentOptions = prev[group];
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter(item => item !== option)
        : [...currentOptions, option];
      return {
        ...prev,
        [group]: newOptions
      };
    });
  };

  const handleSearch = () => {
    // Implement your search logic here
    console.log({
      searchQuery,
      calorieRange,
      selectedFilters
    });
  };

  return (
    <div className="recipe-search-container">
      <h2 className="recipe-search-title">Recipe Search</h2>
      
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes (e.g., 'chicken curry', 'vegetarian pasta')..."
          className="search-input"
        />
        <Search className="search-icon" />
      </div>

      <div className="calorie-filter">
        <h3 className="calorie-title">Calorie Range</h3>
        <div className="calorie-inputs">
          <div className="calorie-input-group">
            <label htmlFor="minCalories">Min</label>
            <input
              type="number"
              id="minCalories"
              value={calorieRange.min}
              onChange={(e) => handleCalorieChange('min', e.target.value)}
              placeholder="0"
              min="0"
              className="calorie-input"
            />
          </div>
          <span className="calorie-separator">-</span>
          <div className="calorie-input-group">
            <label htmlFor="maxCalories">Max</label>
            <input
              type="number"
              id="maxCalories"
              value={calorieRange.max}
              onChange={(e) => handleCalorieChange('max', e.target.value)}
              placeholder="∞"
              min="0"
              className="calorie-input"
            />
          </div>
        </div>
        {!isValidRange && (
          <p className="calorie-error">Minimum calories should be less than maximum calories</p>
        )}
      </div>

      <div className="filters-container">
        {Object.entries(filterGroups).map(([key, group]) => (
          <FilterGroup
            key={key}
            title={group.title}
            options={group.options}
            expanded={expandedGroups[key]}
            onToggle={() => toggleGroup(key)}
            selectedOptions={selectedFilters[key]}
            onOptionChange={(option) => handleOptionChange(key, option)}
          />
        ))}
      </div>

      <div className="search-button-container">
        <button 
          onClick={handleSearch}
          className="search-button"
        >
          Search Recipes
        </button>
      </div>
    </div>
  );
}

export default RecipeSearch;