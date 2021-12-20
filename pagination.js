// import { pages, max } from "./params.js"
// console.log(pages, max);

class Pagination {

    constructor(ctx, pages = 15, max = 7) {
        this.ctx = ctx
        this.pages = pages;
        this.total = pages.length;
        this.max = max;
    }
    
    init() {
        this.selectors = {
            display: ".app__display",
            linkBox: ".pagination__links",
            link: ".pagination__links-item",
            linkActive: ".pagination__links-item--active",
            rightArrow: ".js-arrow-right",
            leftArrow: ".js-arrow-left",
        }
        
        this.dynamicClasses = {
            link: "pagination__links-item",
            linkActive: "pagination__links-item--active"
        }
        
        this.stateClasses = {
            linkActive: "pagination__links-item--active",
            linkDisabled: "pagination__links-item--disabled",
            btnActive:"pagination__btn--active"
        }
        
        // variables (elements, position)
        this.leftArrowBtn = this.ctx.querySelector(this.selectors.leftArrow);
        this.rightArrowBtn = this.ctx.querySelector(this.selectors.rightArrow);
        this.linkBox = this.ctx.querySelector(this.selectors.linkBox);
        this.linksNum = this.checkTotalPages(); // this.total or total.max
        this.centerIndex = Math.ceil(this.linksNum / 2);
        this.links = this.createLinks(); // all displayed link elements
        this.currentIndex;
        this.currentLinks = new Object; // pattern for dinamyc changing of displayed links


        // event listeners
        this.leftArrowBtn.onclick = this.displayPrev.bind(this);
        this.rightArrowBtn.onclick = this.displayNext.bind(this);
        this.addClickToLinks();
        this.startingDisplay();
    }

    checkTotalPages() {
        if (this.total <= this.max) {
            return this.total;
        } else {
            return this.max;
        }
    }

    createLinks() {
        if (this.max >= this.total) {
            for (let i = 1; i <= this.linksNum; i++) {
                this.linkBox.innerHTML += `<a href="" class="${this.dynamicClasses.link}">${i}</a>`
            };
        } else {
            for (let i = 1; i <= this.linksNum - 2; i++) {
                this.linkBox.innerHTML += `<a href="" class="${this.dynamicClasses.link}">${i}</a>`
            };
            this.linkBox.innerHTML += `<a href="" class="${this.dynamicClasses.link}">...</a>`
            this.linkBox.innerHTML += `<a href="" class="${this.dynamicClasses.link}">${this.total}</a>`
        }
        let firstLink = (this.ctx.querySelector(this.selectors.link))
        firstLink.classList.add(this.dynamicClasses.linkActive)
        return [...this.ctx.querySelectorAll(this.selectors.link)];
    }

    addClickToLinks() {
        this.links.forEach((el, index) => {
            el.addEventListener("click", (event) => {
                event.preventDefault();
                let currentNum = el.innerHTML;
                console.log(currentNum);
                this.displayPage(currentNum - 1); //index of pages
                this.setCurrentLinks(currentNum);
                if (this.centerIndex < currentNum && currentNum <= (this.total - this.centerIndex)) {
                    this.markCurrentLink(this.links[this.centerIndex - 1]);
                }else{
                    this.markCurrentLink(el);
                }
            });
        })
    }

    startingDisplay(){
        document.querySelector(this.selectors.display).innerHTML = this.pages[0];
        if (this.total > this.max) {
        this.rightArrowBtn.classList.add(this.stateClasses.btnActive);
        }
    }

    setCurrentLinks(currentNum) {
        console.log("centerIndex - " + this.centerIndex, "currentNum - " + currentNum);
        if (this.total > this.max) {
            if (this.centerIndex <= currentNum && currentNum <= (this.total - this.centerIndex)) {
                console.log("middle",this.currentLinks);
                this.currentLinks = [1, "...", ...this.setMiddleLinks(currentNum), "...", this.total]
                this.arangeLinksFromPattern();
                this.leftArrowBtn.classList.add(this.stateClasses.btnActive);
                this.rightArrowBtn.classList.add(this.stateClasses.btnActive);
            } else if (currentNum > (this.total - this.centerIndex)) {
                console.log("end");
                this.currentLinks = [1, "...", ...this.setLastLinks(currentNum)]
                this.arangeLinksFromPattern()
                this.leftArrowBtn.classList.add(this.stateClasses.btnActive);
                this.rightArrowBtn.classList.remove(this.stateClasses.btnActive);
            } else if (currentNum <= this.centerIndex - 1) {
                console.log("start");
                this.currentLinks = [...this.setStartLinks(currentNum), "...", this.total]
                this.arangeLinksFromPattern(currentNum)
                this.leftArrowBtn.classList.remove(this.stateClasses.btnActive);
                this.rightArrowBtn.classList.add(this.stateClasses.btnActive);
            }
        }else{
            this.leftArrowBtn.classList.remove(this.stateClasses.btnActive);
            this.rightArrowBtn.classList.remove(this.stateClasses.btnActive);
        }
    }

    setStartLinks(currentNum){ // all but last two links ("...", this.total)
        let startLinksLength = this.linksNum - 2
        let startLinks = [];
        for(let i = 1; i <= startLinksLength; i++){
            startLinks.push(i);
        }
        return startLinks;
    }
    
    setMiddleLinks(currentNum) { // all but first two links ( "1" & "...") and last two links ("..." & this.linksNum)   
        let middleStartNum = (currentNum - (Math.floor((this.linksNum - 4) / 2))); //
        let middleLinksLength = this.linksNum - 4;
        const middleLinks = [];
        for(let i = middleStartNum; i < (middleStartNum + middleLinksLength); i++){
            middleLinks.push(i);
        }
        return middleLinks;
    }
    
    setLastLinks(currentNum){ // all but first two links ("1", "...")
        let lastStartNum = this.total - (this.linksNum - 3);
        let lastLinksLength = this.linksNum - 3;
        const lastLinks = [];
        for(let i = lastStartNum; i <= (lastStartNum + lastLinksLength); i++){
            lastLinks.push(i);
        }
        return lastLinks;
    }


    arangeLinksFromPattern(){
        this.links.forEach((el, index) => {
            el.innerHTML = this.currentLinks[index];
        })
    }

    markCurrentLink(el){
        this.ctx.querySelector(this.selectors.linkActive).classList.remove(this.stateClasses.linkActive);
        el.classList.add(this.stateClasses.linkActive);
    }
     
    displayPage(index) {
        document.querySelector(this.selectors.display).innerHTML = this.pages[index];
    }
    
    displayPrev() {
        let currentNum = parseInt(this.links[this.centerIndex - 1].innerHTML) 
        if(currentNum > 2){ 
            this.setCurrentLinks(currentNum - (this.linksNum - 4));
            this.displayPage(currentNum - (this.linksNum - 3));
            this.markCurrentLink(this.links[this.linksNum - this.centerIndex]);
        }
    }
    displayNext() {
        let currentNum = parseInt(this.links[this.centerIndex - 1].innerHTML) 
        this.setCurrentLinks(currentNum + (this.linksNum - 4));
        this.displayPage(currentNum + (this.linksNum - 5)); 
        this.markCurrentLink(this.links[this.linksNum - this.centerIndex]);
    }
    
}


export { Pagination }

// let pg = new Pagination(document.querySelector(".pagination"), pages, max);
// pg.init();