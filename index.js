// ---GLOBAL---

const BASE_API_URL = "https://bytegrad.com/course-assets/js/2/api";

const bookmarksBtnEl = document.querySelector(".bookmarks-btn");
const errorEl = document.querySelector(".error");
const errorTextEl = document.querySelector(".error__text");
const jobDetailsEl = document.querySelector(".job-details");
const jobDetailsContentEl = document.querySelector(".job-details__content");
const jobListBookmarksEl = document.querySelector(".job-list--bookmarks");
const jobListSearchEl = document.querySelector(".job-list--search");
const jobListEmptyEl = document.querySelector(".job-list--empty");
const numberEl = document.querySelector(".count__number");
const paginationEl = document.querySelector(".pagination");
const paginationBtnNextEl = document.querySelector(".pagination__button--next");
const paginationBtnBackEl = document.querySelector(".pagination__button--back");
const paginationNumberNextEl = document.querySelector(
  ".pagination__number--next"
);
const paginationNumberBackEl = document.querySelector(
  ".pagination__number--back"
);
const searchFormEl = document.querySelector(".search");
const searchInputEl = document.querySelector(".search__input");
const sortingEl = document.querySelector(".sorting");
const sortingBtnRelevantEl = document.querySelector(
  ".sorting__button--relevant"
);
const sortingBtnRecentEl = document.querySelector(".sorting__button--recent");
const spinnerSearchEl = document.querySelector(".spinner--search");
const spinnerJobDetailsEl = document.querySelector(".spinner--job-details");

const hiddenError = (ms) => {
  setTimeout(() => errorEl.classList.remove("error--visible"), ms);
};

// --SEARCH COMPONENT --
(() => {
  const renderJobItemHTML = (job) => {
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

  const submitHandler = (e) => {
    e.preventDefault();
    const searchText = searchInputEl.value;

    //Validation with regular expression
    const forbiddenPattern = /[0-9]/;
    const patternMatch = forbiddenPattern.test(searchText);
    if (patternMatch) {
      errorTextEl.textContent = "Your search may not content numbers";
      errorEl.classList.add("error--visible");
      hiddenError(3500);
      return;
    }

    //blur the search element (remove focus state)
    searchInputEl.blur();

    //remove previous list item
    jobListSearchEl.innerHTML = "";

    spinnerSearchEl.classList.add("spinner--visible");

    //Fetch Call
    fetch(`${BASE_API_URL}/jobs?search=${searchText}`)
      .then((res) => {
        //The guard clause tant aimé de bytegrad.
        if (!res.ok) {
          console.error("something went wrong");
          return;
        }
        return res.json();
      })
      .then((data) => {
        const { jobItems: jobs } = data;
        spinnerSearchEl.classList.remove("spinner--visible");
        numberEl.textContent = jobs.length;
        jobs.slice(0, 7).forEach((job) => {
          renderJobItemHTML(job);
        });
      })
      .catch((err) => {
        errorTextEl.textContent = `${err}`;
        errorEl.classList.add("error--visible");
        hiddenError(3500);
      });
  };
  searchFormEl.addEventListener("submit", submitHandler);
})();

//JOB LIST COMPONENTS
(() => {
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
    spinnerJobDetailsEl.classList.add("spinner--visible");

    const id = jobItemEl.children[0].getAttribute("href");

    fetch(`${BASE_API_URL}/jobs/${id}`)
      .then((res) => {
        if (!res.ok) {
          console.error("something went wrong");
          return;
        }
        return res.json();
      })
      .then((data) => {
        const {jobItem} = data;
        spinnerJobDetailsEl.classList.remove('spinner--visible');
      })
      .catch((err) => console.error(err));
  };

  jobListSearchEl.addEventListener("click", clickHandler);
})();
