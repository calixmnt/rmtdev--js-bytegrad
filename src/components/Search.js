import {
  searchInputEl,
  jobListSearchEl,
  numberEl,
  searchFormEl,
} from "../common.js";
import { BASE_API_URL } from "../constants.js";
import renderError from "./Error.js";
import renderSpinner from "./Spinner.js";
import { renderJobItemHTML } from "./JobList.js";

const submitHandler = (e) => {
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

  renderSpinner("search");

  //Fetch Call
  fetch(`${BASE_API_URL}/jobs?searc=${searchText}`)
    .then((res) => {
      //The guard clause tant aimé de bytegrad.
      if (!res.ok) {
        throw {message : res.statusText, statusCode : res.status};
      }
      return res.json();
    })
    .then((data) => {
      const { jobItems: jobs } = data;
      renderSpinner("search");
      numberEl.textContent = jobs.length;
      jobs.slice(0, 7).forEach((job) => {
        renderJobItemHTML(job);
      });
    })
    .catch((err) => {
      renderSpinner("search");
      renderError(err.message, 3500);
    });
};

searchFormEl.addEventListener("submit", submitHandler);
