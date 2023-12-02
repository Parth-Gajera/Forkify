import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkssView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookmarksView from './views/bookmarksView.js';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2 (for API link)

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    recipeView.renderSpinner();

    //0).Update resultes View to mark selected search resultes
    resultsView.update(model.getSearchResultsPage());
  

    //1).Updateing bookmarks view
    bookmarkssView.update(model.state.bookmarks);
   
    //2). Loading recipe
    await model.loadRecipe(id);
    
    
    //3). Rendering recipe
    recipeView.render(model.state.recipe);


  } catch (err) {
    recipeView.renderError();
    // console.error(err);
  }
};



const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1). get search qurey
    const query = searchView.getQuery();
    if (!query) return;

    //2).Loading search qurey
    await model.loadSearchResults(query);

    //3).Reander serach resualt
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    // console.log(model.getSearchResultsPage(1));
    resultsView.render(model.getSearchResultsPage());

    //4).Render inital pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResult();



const controlPagination = function (goToPage) {
  //1).Reander NEW serach resualt
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2).Render NEW pagination button
  paginationView.render(model.state.search);
}



const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  // console.log(model.state.recipe)
}

const controlAddBookmark = function () {
  // 1).Add/Remove the bookmarksView.
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);

  //2).Update recipe View
  recipeView.update(model.state.recipe);

  //3).Render bookmarks
  bookmarkssView.render(model.state.bookmarks);
}



const controlBookmarks = function () {
  bookmarkssView.render(model.state.bookmarks);
}



const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe)
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

     //Render bookmarkView
     bookmarksView.render(model.state.bookmarks);

     //Change ID in URL
     window.history.pushState(null,'',`#${model.state.recipe.id}`); 

    //Close Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  }
  catch (err) {
    console.error('myerror', err);
    addRecipeView.renderError(err.message);
  }
}



const init = function () {
  addRecipeView.addHandlerUpload(controlAddRecipe);
  bookmarkssView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerupdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
