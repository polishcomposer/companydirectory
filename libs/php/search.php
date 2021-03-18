<?php

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

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
	$whereKeyword = '';
	$searchRequest = '';
	$firstLike = ' p.firstName LIKE "%';
	$secondLike = '%" OR p.lastName LIKE "%';
	$locationsFilter = '';
	$locationsQuery = explode( ',', $_POST['locations']);
	$departmentsFilter = '';
	$departmentsQuery = explode( ',', $_POST['departments']);

	if($_POST['search']!='') {
		if(!strpos($_POST['search'], ' ')) {  
				$searchRequest .= ' ('. $firstLike . $_POST['search'] . $secondLike . $_POST['search'] . '%") ';
		} else {
				$complexRequest =  explode(" ", $_POST['search']);
				for($req=0; $req<count($complexRequest); $req++) {
					if($req==count($complexRequest)-1) {
						$searchRequest .= ' ('. $firstLike . $complexRequest[$req] . $secondLike . $complexRequest[$req] . '%") ';
					} else {
						$searchRequest .= ' ('. $firstLike . $complexRequest[$req] . $secondLike . $complexRequest[$req] . '%") AND ';
					}
					
				}
		}  
	} else {
		$searchRequest = '';
	}

	
		
	 if($_POST['locations']!='') {
		if(count($locationsQuery)==1) {
			$locationsFilter .= ' ( d.locationID = "' . $locationsQuery[0] . '")';
		} else {
			$locationsFilter .= ' ( ';
			for($reqLoc=0; $reqLoc<count($locationsQuery); $reqLoc++) {
				if($reqLoc==count($locationsQuery)-1) {
					$locationsFilter .= ' d.locationID = "' . $locationsQuery[$reqLoc] . '") ';
				} else {
					$locationsFilter .= ' d.locationID = "' . $locationsQuery[$reqLoc] . '" OR ';
				}
				
			}
		}
	} else {
	
		$locationsFilter = '';
	} 

	if($_POST['departments']!='') {
		if(count($departmentsQuery)==1) {
			$departmentsFilter .= ' ( p.departmentID = "' . $departmentsQuery[0] . '")';
		} else {
			$departmentsFilter .= ' ( ';
			for($reqDep=0; $reqDep<count($departmentsQuery); $reqDep++) {
				if($reqDep==count($departmentsQuery)-1) {
					$departmentsFilter .= ' p.departmentID = "' . $departmentsQuery[$reqDep] . '") ';
				} else {
					$departmentsFilter .= ' p.departmentID = "' . $departmentsQuery[$reqDep] . '" OR ';
				}
				
			}
		}
	} else {
	
		$departmentsFilter = '';
	} 

	if ($_POST['search']!='' && $_POST['locations']=='' && $_POST['departments']=='') {
		$query = 'SELECT p.id, p.lastName, p.firstName, p.email FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE ' . $searchRequest . ' ORDER BY p.firstName ';
	} else if ($_POST['search']=='' && $_POST['locations']!='' && $_POST['departments']=='') {
		$query = 'SELECT p.id, p.lastName, p.firstName, p.email FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID)  WHERE ' . $locationsFilter . '  ORDER BY p.firstName';
	} else if ($_POST['search']=='' && $_POST['locations']=='' && $_POST['departments']!='') {
		$query = 'SELECT p.id, p.lastName, p.firstName, p.email FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID)   WHERE ' . $departmentsFilter . ' ORDER BY  p.firstName';
	} else if($_POST['search']!='' && $_POST['locations']!='' && $_POST['departments']=='') {
		$query = 'SELECT p.id, p.lastName, p.firstName, p.email FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE  ' . $searchRequest . '  AND  ' . $locationsFilter . ' ORDER BY p.firstName ';
	} else if ($_POST['search']!='' && $_POST['locations']=='' && $_POST['departments']!='') {
		$query = 'SELECT p.id, p.lastName, p.firstName, p.email FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE   ' . $searchRequest . '  AND ' . $departmentsFilter . ' ORDER BY p.firstName  ';
	} else if ($_POST['search']=='' && $_POST['locations']!='' && $_POST['departments']!='') {
		$query = 'SELECT p.id, p.lastName, p.firstName, p.email FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE  ' . $locationsFilter . ' AND  ' . $departmentsFilter . ' ORDER BY p.firstName  ';
	} else if ($_POST['search']!='' && $_POST['locations']!='' && $_POST['departments']!='') {
		$query = 'SELECT p.id, p.lastName, p.firstName, p.email FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE ' . $searchRequest . ' AND  ' . $departmentsFilter . ' AND ' . $locationsFilter . ' ORDER BY p.firstName';
	} else {
		$query = 'SELECT p.id, p.lastName, p.firstName, p.email FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.firstName';
	}


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

   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	mysqli_close($conn);

	echo json_encode($output); 

?>