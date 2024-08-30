import {
  searchInputEl,
  jobListSearchEl,
  numberEl,
  searchFormEl,
  sortingBtnRecentEl,
  sortingBtnRelevantEl,
} from "../common.js";
import { BASE_API_URL } from "../constants.js";
import renderError from "./Error.js";
import renderSpinner from "./Spinner.js";
import renderJobList from "./JobList.js";
import renderPaginationButtons from "./Pagination.js";
import { getData } from "../utililities.js";
import { state } from "../constants.js";

const submitHandler = async (e) => {
  e.preventDefault();

  const searchText = searchInputEl.value;

  //Validation with regular expression
  const forbiddenPattern = /[0-9]/;
  const patternMatch = forbiddenPattern.test(searchText);
  if (patternMatch) {
    renderError("Your search may not content numbers", 3500);
    return;
  }

  //blur the search element (remove focus state)
  searchInputEl.blur();

  //remove previous list item
  jobListSearchEl.innerHTML = "";

  sortingBtnRecentEl.classList.remove("sorting__button--active");
  sortingBtnRelevantEl.classList.add("sorting__button--active");

  renderSpinner("search");

  try {
    const data = await getData(`${BASE_API_URL}/jobs?search=${searchText}`);
    const { jobItems: jobs } = data;

    //update the state
    state.searchJobItems = jobs;
    state.currentPage = 1;

    renderSpinner("search");
    numberEl.textContent = state.searchJobItems.length;

    renderPaginationButtons();
    renderJobList();
  } catch (err) {
    renderSpinner("search");
    renderError(err.message, 3500);
  }
};

searchFormEl.addEventListener("submit", submitHandler);
