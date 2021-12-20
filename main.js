import { Pagination } from './pagination.js'

let displayTotal = document.querySelector('.tester__displayTotal');
let displayMax = document.querySelector('.tester__displayMax');

let inputTotal = document.querySelector('#js-totalPages');
let inputMax = document.querySelector('#js-maxDisplayedLinks');

let btn = document.querySelector('.js-changeParamsBtn');

btn.onclick = changeParams;

inputTotal.onchange = function () {
    displayTotal.innerHTML = parseInt(inputTotal.value);
}
inputMax.onchange = function () {
    displayMax.innerHTML = parseInt(inputMax.value);
}

function changeParams() {
    let pages = [];
    document.querySelector('.pagination__links').innerHTML = "";
    let total = parseInt(inputTotal.value);
    let max = parseInt(inputMax.value);
    displayTotal.innerHTML = parseInt(inputTotal.value);
    displayMax.innerHTML = parseInt(inputMax.value);
    for (let i = 1; i <= total; i++) {
        pages.push("Page No. " + i);
    }
    console.log(pages);
    let pg = new Pagination(document.querySelector(".pagination"), pages, max);
    pg.init();
}

changeParams();

// let pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// let pages = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
// let pages = ["1page", "2page", "3page", "4page", "5page", "6page", "7page", "8page", "9page", "10page", "11page", "12page", "13page"];
// let pages = ["1page", "2page", "3page", "4page", "5page", "6page"]
// let pages = ["1page", "2page", "3page", "4page", "5page", "6page","7page", "8page"]