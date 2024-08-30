import { state, JOBS_PER_PAGE } from "../constants.js";
import {
  paginationEl,
  paginationNumberNextEl,
  paginationNumberBackEl,
  paginationBtnBackEl,
  paginationBtnNextEl,
} from "../common.js";

import renderJoblist from "./JobList.js";

const renderPaginationButtons = () => {
    if (state.currentPage >= 2) {
        paginationBtnBackEl.classList.remove('pagination__button--hidden');
    }else{
        paginationBtnBackEl.classList.add('pagination__button--hidden');
    }

    if ( (state.searchJobItems.length - state.currentPage * JOBS_PER_PAGE) <= 0) {
        paginationBtnNextEl.classList.add('pagination__button--hidden');
    }else{
        paginationBtnNextEl.classList.remove('pagination__button--hidden');
    }

    paginationNumberNextEl.textContent = state.currentPage + 1;
    paginationNumberBackEl.textContent = state.currentPage - 1;

    paginationBtnNextEl.blur();
    paginationBtnBackEl.blur();
}

const clickHandler = (e) => {
    const clickedBtnEl = e.target.closest(".pagination__button");
    console.log(clickedBtnEl)
  if (!clickedBtnEl) return;

  const nextPage = clickedBtnEl.className.includes("--next");

  nextPage ? state.currentPage++ : state.currentPage--;

  renderPaginationButtons();

  renderJoblist();
};

paginationEl.addEventListener("click", clickHandler);

export default renderPaginationButtons;