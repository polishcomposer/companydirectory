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

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	echo json_encode($output); 
}
?>