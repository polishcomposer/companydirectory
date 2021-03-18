<?php

	$executionStartTime = microtime(true);

	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');
	
	if($_POST['name']) {
		$connLocation = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
		$queryLocation = 'SELECT * FROM location WHERE name = "' . $_POST['name'] . '" AND id != ' . $_POST["id"];
		$resultLocation = $connLocation->query($queryLocation);
		$LocationCheck = [];
		if($resultLocation) {
			while ($row = mysqli_fetch_assoc($resultLocation)) {
				array_push($LocationCheck, $row);
			}
		}
	mysqli_close($connLocation);
	}

	$emptyLocation = 'Please provide the name of the Location';
	$toManyCharacters = 'The Location name can have only 50 characters.';
	$alreadyExist = 'The location with that name already exists.';

	function errors($description1) {
		$output['status']['code'] = "300";
		$output['status']['name'] = 'error';
		$output['status']['des1'] = $description1;
		echo json_encode($output);
		exit;
	}
	
	if(strlen($_POST['name']) > 50 || !$_POST['name'] || count($LocationCheck)>0) {
		if(strlen($_POST['name']) > 50) { 
			$des1 = $toManyCharacters; 
		} else if(!$_POST['name']) {
			$des1 = $emptyLocation;
		} else if(count($LocationCheck)>0) {
			$des1 = $alreadyExist;
		} else {
			$des1 = '';
		}
		errors($des1);
	} else {

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		
		mysqli_close($conn);
		echo json_encode($output);
		exit;

	}	

	$query = 'UPDATE location SET name = "' . $_POST["name"] . '" WHERE id = ' . $_POST["id"];
	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output); 
		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);
	echo json_encode($output); 
}
?>