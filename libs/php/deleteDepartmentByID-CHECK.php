<?php


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

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	echo json_encode($output); 
}
?>