import { jobDetailsContentEl, jobListSearchEl } from "../common.js";

import { BASE_API_URL } from "../constants.js";
import renderError from "./Error.js";
import {renderJobDetails} from "./JobDetails.js";

import renderSpinner from "./Spinner.js";


export const renderJobItemHTML = (job) => {
  const newJobItemHtml = `
        <li class="job-item">
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
  jobListSearchEl.insertAdjacentElement("beforeend", jobItemElement);
};

const clickHandler = (e) => {
  e.preventDefault();
  const clickedItem = e.target;
  const jobItemEl = clickedItem.closest(".job-item");

  //remove previous active element for aftger added that
  document
    .querySelector(".job-item--active")
    ?.classList.remove("job-item--active");

  jobItemEl.classList.add("job-item--active");

  jobDetailsContentEl.innerHTML = "";
  renderSpinner("job-details");
  const id = jobItemEl.children[0].getAttribute("href");

  fetch(`${BASE_API_URL}/jobs/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error();
      }
      return res.json();
    })
    .then((data) => {
      const { jobItem } = data;
      renderSpinner("job-details");
      renderJobDetails(jobItem);
    })
    .catch((err) => {
      renderSpinner('job-details');
      renderError(err);
    });
};

jobListSearchEl.addEventListener("click", clickHandler);
