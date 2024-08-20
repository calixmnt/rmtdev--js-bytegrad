import {sortingEl} from '../common.js';

const clickHandler =  e => {
    const clickedEl = e.target;
    const sortingButtonEl = clickedEl.closest('.sorting__button');
    if (!sortingButtonEl) return;
    const recent = sortingButtonEl.classList.contains('sorting__button--recent');

    if (recent) {
        
    }else {
        
    }
}

sortingEl.addEventListener('click', clickHandler);