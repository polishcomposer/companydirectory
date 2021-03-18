<?php

	$executionStartTime = microtime(true);

	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');


		$connDepartment = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);	

		$queryDepartment = 'SELECT * FROM department WHERE id = ' . $_POST['departmentID'];
		$resultDepartment = $connDepartment->query($queryDepartment);
		$DepartmentCheck = [];
		if($resultDepartment) {
			while ($row = mysqli_fetch_assoc($resultDepartment)) {
				array_push($DepartmentCheck, $row);
			}
		}
			mysqli_close($connDepartment);


			$connEmail = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);	

		$queryEmail = 'SELECT * FROM personnel WHERE email = "' . $_POST['email']. '"';
		$resultEmail = $connEmail->query($queryEmail);
		$EmailCheck = [];
		if($resultEmail) {
			while ($row = mysqli_fetch_assoc($resultEmail)) {
				array_push($EmailCheck, $row);
			}
		}
			mysqli_close($connEmail);


			$connFirstLastName = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);	

		$queryFirstLastName = 'SELECT * FROM personnel WHERE firstName = "' . $_POST['firstName'] . '" AND lastName = "' . $_POST['lastName'] . '"';
		$resultFirstLastName = $connFirstLastName->query($queryFirstLastName);
		$FirstLastNameCheck = [];
		if($resultFirstLastName) {
			while ($row = mysqli_fetch_assoc($resultFirstLastName)) {
				array_push($FirstLastNameCheck, $row);
			}
		}
			mysqli_close($connFirstLastName);

		$firstNameMessage = ''; $lastNameMessage = ''; $emailMessage = '';  $departmentIDMessage = ''; $jobTitleMessage = '';
		$emptyInput = 'can\'t be empty.';
		$toManyCharacters = 'can have only 50 characters.';

		if(strlen($_POST['firstName']) > 50 || !$_POST['firstName'] || strlen($_POST['lastName']) > 50 || !$_POST['lastName'] || strlen($_POST['email']) > 50 || !$_POST['email'] || !$_POST['departmentID'] || strlen($_POST['jobTitle']) > 50 || count($DepartmentCheck)==0 || count($EmailCheck)>0 || count($FirstLastNameCheck)>0)  { 
			if(strlen($_POST['firstName']) > 50) { 
				$firstNameMessage = 'First name ' . $toManyCharacters; 
			} else if(!$_POST['firstName']) {
				$firstNameMessage = 'First name ' . $emptyInput;
			} else if(count($FirstLastNameCheck)>0) {
				$firstNameMessage = 'Someone already uses these';
			}
		
			if(strlen($_POST['lastName']) > 50) { 
				$lastNameMessage = 'Last name ' . $toManyCharacters; 
			} else if(!$_POST['lastName']) {
				$lastNameMessage = 'Last name ' . $emptyInput;
			} else if(count($FirstLastNameCheck)>0) {
				$lastNameMessage = 'first and last names.';
			}

			if(strlen($_POST['email']) > 50) { 
				$emailMessage = 'Email ' . $toManyCharacters; 
			} else if(!$_POST['email']) {
				$emailMessage = 'Email ' .  $emptyInput;
			} else if(count($EmailCheck)>0) {
				$emailMessage = 'Someone already uses this email address.';
			}

			if(!$_POST['departmentID']) {
				$departmentIDMessage = 'Department ' . $emptyInput;
			} else if(count($DepartmentCheck)==0) {
				$departmentIDMessage = 'Department doesn\'t exist.';
			}

			if(strlen($_POST['jobTitle']) > 50) { 
				$jobTitleMessage = 'Job title ' . $toManyCharacters; 
			} 
			
			$output['status']['code'] = "300";
			$output['status']['name'] = 'error';
			$output['data']['firstName'] = $firstNameMessage;
			$output['data']['lastName'] = $lastNameMessage;
			$output['data']['email'] = $emailMessage;
			$output['data']['departmentID'] = $departmentIDMessage;
			$output['data']['jobTitle'] = $jobTitleMessage;
			$output['data']['firstANDlast'] = $FirstLastNameCheck;
			echo json_encode($output);
			exit;
	
		} else { 
 
			$conn= new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);	
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

	$POSTjobTitle = '';
if($_POST['jobTitle']!='') {
	$POSTjobTitle = '"' . $_POST['jobTitle'] . '"';
}
	$query = 'INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES ("' . $_POST['firstName'] . '", "' . $_POST['lastName'] . '", ' . $POSTjobTitle . ', "' . $_POST['email'] . '", "' . $_POST["departmentID"] . '")';

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