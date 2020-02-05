// function to display modal which users use to indicate whether they are creating an account or not
const displayModal = () => {
	var emailAddress = document.getElementById("email").value;
	var userPassword = document.getElementById("password").value;
	// conditional statement in order to determine whether user entered their email and password
	if (emailAddress == "" || userPassword == "" || (emailAddress == "" && userPassword == "")){
		responseMessage("Please Enter An Email And Password"); // will display message if email and password is NOT entered
	}else {
		// will open modal if email and password IS entered
		var modal = document.getElementById("myModal");

		modal.style.display = "block";
		
	}
}

// function to add user data to object "userinfo" and send to reqToServer
const sendUserData = (value) => {
	let isUserNew = false;
	var emailAddress = document.getElementById("email").value;
	var userPassword = document.getElementById("password").value;
	var modal = document.getElementById("myModal");

	modal.style.display = "none";
	isUserNew = value;

	// Object with details of a users information
	let userInfo = {
		email : emailAddress,
		password  : userPassword,
		exists : isUserNew
	}	

	reqToServer(userInfo)

}
// function to send request to server
const reqToServer = (userData) => {
		console.log(userData)
		// fetch method that makes POST request to server and receives response in lines 17-22
		fetch("/entry", {
			method: "POST",
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		}).then( res => {
			console.log(res);
			return res.json();
		})
			.then(response => {responseMessage(response.message)})
			.catch(error => console.error('Error:', error))

}

// function to display message from server in html tah
const responseMessage = (resp) =>{
	document.getElementById("message").innerHTML = resp;
}