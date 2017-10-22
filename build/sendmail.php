<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$name = test_input( $request->name );
	$email = test_input( $request->email );
	$description = test_input( $request->description );

	// check that name is not empty
	if ( empty($name) ) {
		die( "Name is required" );
	}

	// check if name only contains letters and whitespace
	// if (!preg_match("/^[a-zA-Z ]*$/",$name)) {
	// 	die( "Only letters and white space allowed" );
	// }

	// check that email is not empty
	if  (empty($email) ) {
		die( "Email is required" );
	}

	// check if e-mail address is well-formed
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		die( "Invalid email format" );
	}

	// check if description is empty
	if ( empty($description) ) {
		die( "Description is required" );
	}
	
	// all good, send the email
	mail("stufreen@gmail.com", "Message from stufreen.com", "The following message was sent by " . $name . " (" . $email . "): " . $description);
	die( json_encode(true) );
}

function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}