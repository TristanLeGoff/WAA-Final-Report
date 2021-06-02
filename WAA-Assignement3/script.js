let lastInput = "personName";
let lastBtn = "firstBtn";
let lastError = "personError";
let tempId = "";
let lastMovie = 13;
let lastActor = "";
let allMovies = [13];

let lastInputHtml = document.getElementById(lastInput);
document.getElementById(lastInputHtml.id).focus();
document.getElementById(lastInputHtml.id).select();

lastInputHtml.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      console.log("ok")
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById(lastBtn).click();
    }
});

//function to create aleat id
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

//Api call to search if the movie exist and to get data of the movie
async function searchFilm(filmName) {
    filmName = filmName.replace(" ","+");
    let url = `https://api.themoviedb.org/3/search/movie?api_key=b3414186c1692b1fb06e0d614dcee1a1&query=${filmName}`;
    let response = await fetch(url);
    let data = await response.json();
    return data
}

//API call to get the credits of a movie
async function getActorList(filmid){
    let url = `https://api.themoviedb.org/3/movie/${filmid}/credits?api_key=b3414186c1692b1fb06e0d614dcee1a1&language=en-US`;
    let response = await fetch(url);
    let data = await response.json();
    actors = data.cast
    crew = data.crew
    return actors.concat(crew)
}

//Function call when you want to check if the person is in the movie selected
async function searchIfPerson() {
    var personError = document.getElementById(lastError);
    var personResponse = document.getElementById(lastInput).value;
    
    let personList = await getActorList(lastMovie);
    personError.innerHTML = "Bad answer !";
    personList.forEach(person => {
        if(person.original_name.toLowerCase() == personResponse.toLowerCase()) {
            personError.innerHTML = "";
            lastActor = person.original_name;
            console.log("Good Job");
            document.getElementById(lastBtn).disabled = true;
            addPersonResult(person.original_name, person.profile_path);
            lastInputHtml = document.getElementById(lastInput);
        }
    });
    console.log(personList);
}

//Function call when you want to check if the person selected has played in a movie
async function searchIfFilm() {
    var filmError = document.getElementById(lastError);
    var filmResponse = document.getElementById(lastInput).value;
    
    let filmList = await searchFilm(filmResponse);
    if(filmList.results.length<1) {
        filmError.innerHTML = "Bad Answer";
    }
    else {
        if(allMovies.includes(filmList.results[0].id) == false){
            let actorList = await getActorList(filmList.results[0].id);
            filmError.innerHTML = "Bad Answer";
            actorList.forEach(person => {
                if(person.original_name == lastActor) {
                    filmError.innerHTML = "";
                    allMovies.push(filmList.results[0].id);
                    lastMovie = filmList.results[0].id;
                    console.log("Good Job");
                    document.getElementById(lastBtn).disabled = true;
                    addFilmResult(filmList.results[0].title,filmList.results[0].release_date,filmList.results[0].backdrop_path);
                    lastInputHtml = document.getElementById(lastInput);
                }
            });
        }
    }
    console.log(filmList);
    // console.log(filmList.results[0]);
}

//Function that create new HTML when you succesfully find a person
function addPersonResult (name,imgUrl) {
    // crée un nouvel élément div
    var newDiv = document.createElement("div");
    newDiv.setAttribute("class", "myflex");

    var newImg = document.createElement("img");
    newImg.setAttribute("src", `https://image.tmdb.org/t/p/w500/${imgUrl}`);
    newImg.setAttribute("class", "imageActor");

    var newTitle = document.createElement("h1");
    newTitle.innerHTML = name;
    newTitle.setAttribute("style", "margin-left: 10px");

    newDiv.appendChild(newImg);
    newDiv.appendChild(newTitle);

    var newDiv2 = document.createElement("div");
    newDiv2.setAttribute("class", "myflex");

    var newLabel = document.createElement("label");
    newLabel.innerHTML = "Movie with this person :";

    var newInput = document.createElement("input");
    newInput.setAttribute("size", "40");
    tempId = uuidv4();
    newInput.setAttribute("id", tempId);
    lastInput = tempId;

    var newBtn = document.createElement("button");
    newBtn.innerHTML = "Find";
    tempId = uuidv4();
    newBtn.setAttribute("id", tempId);
    newBtn.setAttribute("onClick", "searchIfFilm()");
    lastBtn = tempId;

    var newError = document.createElement("p");
    tempId = uuidv4();
    newError.setAttribute("id", tempId);
    newError.setAttribute("class", "badAnswer");
    lastError = tempId;

    newDiv2.appendChild(newLabel);
    newDiv2.appendChild(newInput);
    newDiv2.appendChild(newBtn);
    newDiv2.appendChild(newError);
  
    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv = document.getElementById('div1');
    document.body.insertBefore(newDiv, currentDiv);
    document.body.insertBefore(newDiv2, currentDiv);

    lastInputHtml = document.getElementById(lastInput);

    lastInputHtml.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
        // Cancel the default action, if needed
        console.log("ok")
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById(lastBtn).click();
        }
    });

    window.scrollTo(0,document.body.scrollHeight);
    document.getElementById(newInput.id).focus();
    document.getElementById(newInput.id).select();

}

//Function that create new HTML when you succesfully find a movie
function addFilmResult(title,releaseDate,imgUrl) {
    var newDiv = document.createElement("div");
    newDiv.setAttribute("class", "part1");

    var newImg = document.createElement("img");
    newImg.setAttribute("src", `https://image.tmdb.org/t/p/w500/${imgUrl}`);
    newImg.setAttribute("class", "imageFilm");

    newDiv.appendChild(newImg);

    var newDiv2 = document.createElement("div");
    newDiv2.setAttribute("class", "part2");

    var newTitle = document.createElement("h1");
    newTitle.innerHTML = "Title : " + title;
    var newParagraph = document.createElement("p");
    newParagraph.innerHTML = "Release date : " + releaseDate;

    newDiv2.appendChild(newTitle);
    newDiv2.appendChild(newParagraph);

    var newDiv3 = document.createElement("div");
    newDiv3.setAttribute("class", "myflex");

    var newLabel = document.createElement("label");
    newLabel.innerHTML = "Person in this movie :";

    var newInput = document.createElement("input");
    newInput.setAttribute("size", "40");
    tempId = uuidv4();
    newInput.setAttribute("id", tempId);
    lastInput = tempId;

    var newBtn = document.createElement("button");
    newBtn.innerHTML = "Find";
    tempId = uuidv4();
    newBtn.setAttribute("id", tempId);
    newBtn.setAttribute("onClick", "searchIfPerson()");
    lastBtn = tempId;

    var newError = document.createElement("p");
    tempId = uuidv4();
    newError.setAttribute("id", tempId);
    newError.setAttribute("class", "badAnswer");
    lastError = tempId;

    newDiv3.appendChild(newLabel);
    newDiv3.appendChild(newInput);
    newDiv3.appendChild(newBtn);
    newDiv3.appendChild(newError);

    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv = document.getElementById('div1');
    document.body.insertBefore(newDiv, currentDiv);
    document.body.insertBefore(newDiv2, currentDiv);
    document.body.insertBefore(newDiv3, currentDiv);

    lastInputHtml = document.getElementById(lastInput);

    lastInputHtml.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
        // Cancel the default action, if needed
        console.log("ok")
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById(lastBtn).click();
        }
    });

    window.scrollTo(0,document.body.scrollHeight);

    document.getElementById(newInput.id).focus();
    document.getElementById(newInput.id).select();
}

