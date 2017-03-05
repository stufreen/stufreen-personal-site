<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if (empty($_POST["name"])) {
		$nameErr = "Name is required";
	} 
	else {
		$name = test_input($_POST["name"]);
		// check if name only contains letters and whitespace
		if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
			$nameErr = "Only letters and white space allowed"; 
		}
	}

	if (empty($_POST["email"])) {
		$emailErr = "Email is required";
	} 
	else {
		$email = test_input($_POST["email"]);
		// check if e-mail address is well-formed
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$emailErr = "Invalid email format"; 
		}
	}

	if (empty($_POST["description"])) {
		$descriptionErr = "Description is required";
	} 
	else {
		$description = test_input($_POST["description"]);
	}
	
	if($nameErr == "" &&
		$emailErr == "" &&
		$descriptionErr == ""){
		mail("stufreen@gmail.com", "Message from stufreen.com", "The following message was sent by " . $name . " (" . $email . "): " . $description);
		die(true);
	}
	else{
		die(false);
	}
}

function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>