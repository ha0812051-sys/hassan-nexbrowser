/* =========================
   NEXBROWSE
   SEARCH + HISTORY + MENU
========================= */

const HISTORY_KEY = "nexBrowseHistory";

const input = document.getElementById("website");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");

const menuBtn = document.getElementById("menuBtn");
const dropdownMenu = document.getElementById("dropdownMenu");


/* =========================
   MENU
========================= */

menuBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    dropdownMenu.classList.toggle("show");

});


/* Click outside menu */

document.addEventListener("click", function (event) {

    if (
        !dropdownMenu.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {
        dropdownMenu.classList.remove("show");
    }

});


/* =========================
   HISTORY
========================= */

function getHistory() {

    const saved = localStorage.getItem(HISTORY_KEY);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    }

    catch (error) {
        return [];
    }
}


function saveHistory(query, url) {

    let history = getHistory();

    history = history.filter(function (item) {

        return item.query.toLowerCase() !== query.toLowerCase();

    });


    history.unshift({

        query: query,

        url: url,

        time: new Date().toLocaleString()

    });


    /* Maximum 20 searches */

    history = history.slice(0, 20);

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

    displayHistory();
}


/* =========================
   DISPLAY HISTORY
========================= */

function displayHistory() {

    const historyList =
        document.getElementById("historyList");

    const history = getHistory();

    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">
                🔎 No searches yet
            </div>
        `;

        return;
    }


    history.forEach(function (item, index) {

        const row =
            document.createElement("div");

        row.className = "history-item";


        row.innerHTML = `

            <div class="history-info">

                <div class="history-query">
                    ${escapeHTML(item.query)}
                </div>

                <div class="history-time">
                    ${escapeHTML(item.time)}
                </div>

            </div>

            <button
                class="history-open"
                onclick="openHistory(${index})">
                ↗
            </button>

            <button
                class="history-delete"
                onclick="deleteHistory(${index})">
                🗑
            </button>

        `;


        historyList.appendChild(row);

    });

}


/* =========================
   OPEN HISTORY
========================= */

function openHistory(index) {

    const history = getHistory();

    if (history[index]) {

        window.open(
            history[index].url,
            "_blank",
            "noopener,noreferrer"
        );

    }

}


/* =========================
   DELETE HISTORY
========================= */

function deleteHistory(index) {

    let history = getHistory();

    history.splice(index, 1);

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

    displayHistory();

}


/* =========================
   CLEAR HISTORY
========================= */

clearBtn.addEventListener("click", function () {

    const history = getHistory();

    if (history.length === 0) {
        return;
    }

    const confirmClear =
        confirm("Clear all search history?");

    if (confirmClear) {

        localStorage.removeItem(HISTORY_KEY);

        displayHistory();

    }

});


/* =========================
   SEARCH
========================= */

function searchWeb() {

    const query =
        input.value.trim();


    if (!query) {

        input.focus();

        return;

    }


    let url;


    /*
       If user enters a website
    */

    if (
        query.startsWith("http://") ||
        query.startsWith("https://")
    ) {

        url = query;

    }

    else if (
        query.includes(".") &&
        !query.includes(" ")
    ) {

        url = "https://" + query;

    }

    /*
       Otherwise Google search
    */

    else {

        url =
            "https://www.google.com/search?q=" +
            encodeURIComponent(query);

    }


    saveHistory(query, url);


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================
   SEARCH BUTTON
========================= */

searchBtn.addEventListener(
    "click",
    searchWeb
);


/* =========================
   ENTER KEY
========================= */

input.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchWeb();

        }

    }
);


/* =========================
   QUICK WEBSITE
========================= */

function openSite(name, url) {

    saveHistory(name, url);

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================
   SHOW SECTIONS
========================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            ".info-section"
        );


    /*
       Hide About, Features,
       Contact, Privacy, Terms
    */

    sections.forEach(function (section) {

        section.classList.add("hidden");

    });


    /*
       History is always hidden
       when another menu section opens
    */

    const history =
        document.getElementById("history");


    /*
       Home
    */

    if (sectionId === "home") {

        history.style.display = "block";

        document.getElementById("home")
            .scrollIntoView({
                behavior: "smooth"
            });

    }


    /*
       History
    */

    else if (sectionId === "history") {

        history.style.display = "block";

        history.scrollIntoView({
            behavior: "smooth"
        });

    }


    /*
       Information sections
    */

    else {

        history.style.display = "none";

        const section =
            document.getElementById(sectionId);

        if (section) {

            section.classList.remove("hidden");

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /*
       Close menu
    */

    dropdownMenu.classList.remove("show");

}


/* =========================
   SECURITY
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   START
========================= */

displayHistory();