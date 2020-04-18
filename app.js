// variable, function, selector ex
// var variable = function(selector).

var heading = document.querySelector("h1");

// console.log("This is a heading", heading); // this is like a print in python.

var songs = null

var BASEURL = "https://playlist4me.herokuapp.com"

function deleteSongOnServer(songId){
    fetch(BASEURL+"/songs/" + songId, {
        method: "DELETE",
        credentials: "include"
    }).then(function (response){
        loadData()
    });
};

function editSongOnServer(songId, name, band, rating, plays){
    var data = "name=" + encodeURIComponent(name);
    data += "&band=" + encodeURIComponent(band);
    data += "&rating=" + encodeURIComponent(rating);
    data += "&plays=" + encodeURIComponent(plays);
    fetch(BASEURL+"/songs/"+songId, {
        method: "PUT",
        credentials: "include",
        body:data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function (response){
        loadData()
    });
};


// function playSongOnServer(songId){
//     fetch(BASEURL+"/songs/" + songId, {
//         method: "POST"
//     }).then(function (response){
//         loadData()
//     });
// };



var loginButton = document.querySelector("#login-button");
console.log("the login button");

loginButton.onclick = function (){
    var usernameInput = document.querySelector("#username");
    // console.log("the username input is:", usernameInput);
    var passwordInput = document.querySelector("#password");

    var username = usernameInput.value;
    var password = passwordInput.value;
    // console.log("Logging in using username:", username, "password:", password);

    var data = "username=" + encodeURIComponent(username)
    data += "&password=" + encodeURIComponent(password);

    //3. fetch (POST): send data to server
    fetch(BASEURL+"/sessions", {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    }).then(function (response) {
        if(response.status == 404){
            alert("Login Unsuccessful")
            loadData();
        }
        else{
            alert("Login Successful")
            loadData();
        }
    });

}

var registerButton = document.querySelector("#register-button");
console.log("the register button");

registerButton.onclick = function (){
    var usernameInput = document.querySelector("#username");
    // console.log("the username input is:", usernameInput);
    var passwordInput = document.querySelector("#password");

    var username = usernameInput.value;
    var password = passwordInput.value;
    // console.log("Registering a new user using username:", username, "password:", password);

    var data = "username=" + encodeURIComponent(username)
    data += "&password=" + encodeURIComponent(password);

    //3. fetch (POST): send data to server
    fetch(BASEURL+"/users", {
        method: "POST",
        body: data,
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    }).then(function (response) {
        if(response.status == "422"){
            alert("Username Taken");
            loadData();

        }
        else{
            alert("New User Created");
            loadData();

        }
    });

}

var addButton = document.querySelector("#add-button");
//classes are dots, id's are hashtags.
console.log("the add button, button");



addButton.onclick = function (){
    //steps
    //1.capture text from input field
    var songNameInput = document.querySelector("#song-name");
    var songName = songNameInput.value;
    console.log("You entered:", songName);

    var bandNameInput = document.querySelector("#band-name");
    var bandName = bandNameInput.value;
    console.log("You entered:", bandName);

    var ratingInput = document.querySelector("#rating");
    var rating = ratingInput.value;
    console.log("You entered:", rating);

    //2. encode the data from the input field
    var data = "name=" + encodeURIComponent(songName)
    data += "&band=" + encodeURIComponent(bandName)
    data += "&rating=" + encodeURIComponent(rating);

    //3. fetch (POST): send data to server
    fetch(BASEURL+"/songs", {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    }).then(function (response) {
        loadData();
    });

};


function loadData(){
    fetch(BASEURL+"/songs", {
    credentials: "include"
    }).then(function (response) {
        response.json().then(function(dataFromServer){

            if(response.status == 200){

                document.getElementById("login-box").style.visibility = "hidden";
            //data is ready: loop over it now and add it to the DOM
                songs = dataFromServer;

                var songList = document.querySelector("#song-list")
                songList.innerHTML = "";

                songs.forEach(function (song){
                    // console.log("one song:", song)
                    var listItem = document.createElement("li");


                    var nameEl = document.createElement("div");
                    nameEl.innerHTML = "Song: " + song["name"];
                    nameEl.classList.add("name");
                    listItem.appendChild(nameEl);
            
                    var bandEl = document.createElement("div");
                    bandEl.innerHTML = "Band: " + song["band"];
                    bandEl.classList.add("band");
                    listItem.appendChild(bandEl);

                    var ratingEl = document.createElement("div");
                    ratingEl.innerHTML = "Rating: " + song["rating"];
                    ratingEl.classList.add("ratingEl");
                    listItem.appendChild(ratingEl);

                    var playsEl = document.createElement("div");
                    playsEl.innerHTML = "Plays: " + song["plays"];
                    playsEl.classList.add("playsEl");
                    listItem.appendChild(playsEl);

                    var editButton = document.createElement("button");
                    editButton.innerHTML = "Edit";
                    editButton.onclick = function(){
                        console.log("Edit button clicked for", song)
                        var newInfoBox = document.createElement("div");

                        var newSongBox = document.createElement("input");
                        newSongBox.value = song["name"];
                        newInfoBox.appendChild(newSongBox);

                        var newBandBox = document.createElement("input");
                        newBandBox.value = song["band"];
                        newInfoBox.appendChild(newBandBox);

                        var newRatingBox = document.createElement("input");
                        newRatingBox.value = song["rating"];
                        newInfoBox.appendChild(newRatingBox);

                        var num_plays = song["plays"];
                        console.log("Number of Plays:", num_plays);
    
                        var submitEdit = document.createElement("button");
                        submitEdit.innerHTML= "Submit";
                        submitEdit.onclick = function(){
                            editSongOnServer(song.id, newSongBox.value, newBandBox.value, newRatingBox.value, num_plays);
                        }
                        newInfoBox.appendChild(submitEdit);
                        

                        
                        
                        listItem.appendChild(newInfoBox);
                        // editSongOnServer(song.id);

                    }
                    listItem.appendChild(editButton);
                    

                    var deleteButton = document.createElement("button");
                    deleteButton.innerHTML = "Delete";
                    deleteButton.onclick = function () {
                        console.log("you clicked me", song)
                        if (confirm("Are you sure you want to delete " + song["name"])){
                            deleteSongOnServer(song.id);
                        }

                    };
                    listItem.appendChild(deleteButton);

                    var playButton = document.createElement("button");
                    playButton.innerHTML = "Play";
                    // playButton.onclick = function() {
                    //     console.log("you clicked the play button for", song["name"]){
                    //         playSongOnServer(song.id);
                    //     };
                    // };
                    listItem.appendChild(playButton);

                    songList.appendChild(listItem);

                    

                });

            };

            // else{
            //     document.getElementById("Songs-Heading").style.visibilty = "hidden"
            // };
        });
    });
};

loadData()
