<?php

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	
		$connCheckDepartment = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
		$queryDepartment = 'SELECT * FROM department WHERE locationID = ' . $_POST['id'];
		$resultDepartment = $connCheckDepartment->query($queryDepartment);
		$DepartmentCheck = [];
		if($resultDepartment) {
			while ($row = mysqli_fetch_assoc($resultDepartment)) {
				array_push($DepartmentCheck, $row);
			}
		}
	mysqli_close($connCheckDepartment);
	
	if(count($DepartmentCheck)>0) {
		$output['status']['code'] = "300";
		$output['status']['name'] = 'error';
		$output['status']['des'] = 'Department can\'t be deleted! Assigned departments: ' . count($DepartmentCheck);
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

	

	$query = 'DELETE FROM location WHERE id = ' . $_POST['id'];

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