<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id= <id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	
		$connCheckPersonnel = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
		$queryPersonnel = 'SELECT * FROM personnel WHERE departmentID = ' . $_POST['id'];
		$resultPersonnel = $connCheckPersonnel->query($queryPersonnel);
		$PersonnelCheck = [];
		if($resultPersonnel) {
			while ($row = mysqli_fetch_assoc($resultPersonnel)) {
				array_push($PersonnelCheck, $row);
			}
		}
	mysqli_close($connCheckPersonnel);
	
	if(count($PersonnelCheck)>0) {
		$output['status']['code'] = "300";
		$output['status']['name'] = 'error';
		$output['status']['des'] = 'Department can\'t be deleted! Assigned personnel: ' . count($PersonnelCheck);
		echo json_encode($output);
		exit;
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

	// $_REQUEST used for development / debugging. Remember to cange to $_POST for production

	$query = 'DELETE FROM department WHERE id = ' . $_POST['id'];

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