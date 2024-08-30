import { jobDetailsContentEl, jobListBookmarksEl, jobListSearchEl } from "../common.js";

import { BASE_API_URL, JOBS_PER_PAGE } from "../constants.js";
import { getData } from "../utililities.js";
import renderError from "./Error.js";
import { renderJobDetails } from "./JobDetails.js";
import { state } from "../constants.js";

import renderSpinner from "./Spinner.js";

const renderJobList = (whichJobList = 'search') => {
  //determine correct selector for jobList (search or bookmarks)

  const jobListEl = whichJobList === 'search' ? jobListSearchEl : jobListBookmarksEl;

  // remove previous job items
  jobListEl.innerHTML = '';

  //determine the jobItems that could be rendered
  let jobItems;
  if (whichJobList === 'search') {
    jobItems = state.searchJobItems.slice((state.currentPage - 1) * JOBS_PER_PAGE, state.currentPage * JOBS_PER_PAGE);
  }else if (whichJobList === 'bookmarks'){
    jobItems = state.bookmarkJobItems;
  }

  jobItems.forEach((job) => {
    const newJobItemHtml = `
        <li class="job-item ${state.activeJobItem.id === job.id && 'job-item--active'}">
            <a class="job-item__link" href="${job.id}">
                <div class="job-item__badge">${job.badgeLetters}</div>
                <div class="job-item__middle">
                    <h3 class="third-heading">${job.title}</h3>
                    <p class="job-item__company">${job.company}</p>
                    <div class="job-item__extras">
                        <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i>${job.duration}</p>
                        <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i>${job.salary}</p>
                        <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i>${job.location}</p>
                    </div>
                </div>
                <div class="job-item__right">
                    <i class="fa-solid fa-bookmark job-item__bookmark-icon"></i>
                    <time class="job-item__time">${job.daysAgo}d</time>
                </div>
            </a>
        </li>`;

  const jobItemElement = new DOMParser().parseFromString(
    newJobItemHtml,
    "text/html"
  ).body.firstChild;
  jobListEl.insertAdjacentElement("beforeend", jobItemElement);
  });
  
};

const clickHandler = async e => {
  e.preventDefault();
  const clickedItem = e.target;
  const jobItemEl = clickedItem.closest(".job-item");

  //remove previous active element for aftger added that
  document
    .querySelectorAll(".job-item--active").forEach(jobItemWithActiveClass => {
      jobItemWithActiveClass.classList.remove("job-item--active");
    })          

  jobItemEl.classList.add("job-item--active");

  jobDetailsContentEl.innerHTML = "";
  renderSpinner("job-details");
  const id = jobItemEl.children[0].getAttribute("href");

  const allJobsItem = [...state.searchJobItems, ...state.bookmarkJobItems];
  state.activeJobItem = allJobsItem.find(j => j.id === +id);
  
  //add the id to the url
  history.pushState(null, "", `/#${id}`);

  try {
    const data = await getData(`${BASE_API_URL}/jobs/${id}`);
    const { jobItem } = data;
      renderSpinner("job-details");
      renderJobDetails(jobItem);
  } catch (err) {
    renderSpinner("job-details");
    renderError(err);
  }
};

jobListSearchEl.addEventListener("click", clickHandler);
jobListBookmarksEl.addEventListener("click", clickHandler);

export default renderJobList;