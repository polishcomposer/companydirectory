<?php

	$executionStartTime = microtime(true);

	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');
	
	if($_POST['name'] && $_POST["locationID"]) {
		$connDepartment = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
		$queryDepartment = 'SELECT * FROM department WHERE name = "' . $_POST['name'] . '" AND locationID = ' . $_POST["locationID"];
		$resultDepartment = $connDepartment->query($queryDepartment);
		$DepartmentCheck = [];
		if($resultDepartment) {
			while ($row = mysqli_fetch_assoc($resultDepartment)) {
				array_push($DepartmentCheck, $row);
			}
		}
	mysqli_close($connDepartment);
	}




	$connLocations = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
	$queryLocation = 'SELECT * FROM location WHERE id = ' . $_POST["locationID"];
	$resultLocation = $connLocations->query($queryLocation);
	$locationCheck = [];
	if($resultLocation) {
		while ($row = mysqli_fetch_assoc($resultLocation)) {
			array_push($locationCheck, $row);
		}
	}
	mysqli_close($connLocations);

	$emptyDepartment = 'Please provide the name of the Department';
	$toManyCharacters = 'The Department name can have only 50 characters.';
	$epmtyLocation = 'Please select the location.';
	$wrongLocation = 'This location does not exist.';
	$alreadyExist = 'The department with that name already exists at this location.';

	function errors($description1, $description2) {
		$output['status']['code'] = "300";
		$output['status']['name'] = 'error';
		$output['status']['des1'] = $description1;
		$output['status']['des2'] = $description2;
		echo json_encode($output);
		exit;
	}
	
	if(strlen($_POST['name']) > 50 || !$_POST['name'] || !$_POST["locationID"] || !$resultLocation || count($DepartmentCheck)>0) {
		if(strlen($_POST['name']) > 50) { 
			$des1 = $toManyCharacters; 
		} else if(!$_POST['name']) {
			$des1 = $emptyDepartment;
		} else if(count($DepartmentCheck)>0) {
			$des1 = $alreadyExist;
		} else {
			$des1 = '';
		}
		if(!$_POST["locationID"]) {
			$des2 = $epmtyLocation;
		} else if (!$resultLocation) {
			$des2 = $wrongLocation; 
		} else {
			$des2 = '';
		}
		errors($des1, $des2);
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

	$query = 'INSERT INTO department (name, locationID) VALUES("' . $_POST['name'] . '","' . $_POST["locationID"] . '")';

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