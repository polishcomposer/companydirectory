let newDepName, newDepLocation, newLocName, firstNamePersonnel, lastNamePersonnel, jobTitlePersonnel = '', emailPersonnel, currentID;
let oldDepartmentName = '';
let oldLocationName = '';
let firstNamePersonnelOld = '';
let lastNamePersonnelOld = '';
let jobTitlePersonnelOld = '';
let emailPersonnelOld = '';
let depURL = '';
let locURL = '';
let showFirstNameMessage = '';
let showLastNameMessage = '';
let showEmailMessage = '';
let showDepartmentIDMessage = '';
let showJobTitleMessage = '';
let activeRecord = '';
let searchQuery = '';
let checkDepName = 0;
let checkLocName = 0;
let checkDepLocal = 0;
let firstNamePersonnelCheck = 0;
let lastNamePersonnelCheck = 0;
let jobTitlePersonnelCheck = 0;
let emailPersonnelCheck = 0;
let departmentIDPersonnelCheck = 0;
let departmentIDPersonnel = 0;
let departmentNameLength = 0;
let editedPerson = 0;
let editedPerson2 = 0;
let editDepID = -1;
let editLocID = -1;
let editPersonID = -1;
let locationsQueryList = [];
let departmentsQueryList = [];
let newLocastionsList = [];
let newDepartmentsList = [];
let currentRecords = [];
let circleColors = ['primary','secondary','success','danger','warning','info'];

$("#searchEngine").val('');
$('#showAll').on('click', () => {
  getEmployeesData();
  $("#searchEngine").val('');
  $('#filters').empty();
});
getEmployeesData();
function getEmployeesData(locationQuery, departmentQuery, keepDepartments=0, keepLocations=0, query='') {
  if(query!='') {
    searchQuery = query;
  } else {
    searchQuery = '';
  }

  if(keepDepartments==0) {
    if(departmentQuery != null) {
      if(departmentsQueryList.find(i => i == departmentQuery[0]) != undefined) {
       departmentsQueryList.splice(departmentsQueryList.indexOf(departmentQuery[0]),1);
      } else {
        departmentsQueryList.unshift(departmentQuery[0]);
      }
    } else {
      departmentsQueryList = [];
    }
  } else {
    departmentsQueryList = departmentQuery;
  }

  if(keepLocations==0) {
  if(locationQuery != null) {
    if(locationsQueryList.find(i => i == locationQuery[0]) != undefined) {
     locationsQueryList.splice(locationsQueryList.indexOf(locationQuery[0]),1);
    } else {
      locationsQueryList.unshift(locationQuery[0]);
    }
  } else {
    locationsQueryList = [];
  }
} else {
  locationsQueryList = locationQuery;
}
 
$.ajax({
    url: "libs/php/search.php",
    type: 'POST',
    dataType: 'json',
    data: {
      search: searchQuery,
      locations: locationsQueryList.join(),
      departments: departmentsQueryList.join()
    },

    success: function (result) {
      if (result.status.name == "ok") {
       
        let results='';
        let randomColor;
        for(let a=0; a<result['data'].length; a++) {
          randomColor = Math.floor(Math.random()*6);
          if(a==0) {
            showEmployee(result['data'][a]['id'], randomColor, a, 0);
            activeRecord = "activeRecord";
          } else {
            activeRecord = "";
          }
         

  results +=`<a href="#recordBlock" class="list-group-item list-group-item-action record ${activeRecord}" onClick="showEmployee(${result['data'][a]['id']}, ${randomColor}, ${a}, 1)" id="person${a}" data-toggle="list" role="tab">
  <div class="d-flex w-100">
<div class="mb-1 text-white bg-${circleColors[randomColor]} round">${result['data'][a]['firstName'][0]}${result['data'][a]['lastName'][0]}</div>
  <div class="record-right record-overflow">
${result['data'][a]['firstName']} ${result['data'][a]['lastName']}<br>
<span class="text-secondary font-weight-light littleEmail">${result['data'][a]['email']}</span>
</div>
</div>
  </a>`;  
         if(a==0) {
          window.location.hash = `#person${a}`;
         }
        }
       if(results==''){
        $('.records').html('<p class="text-secondary" id="noRecords">No records found.</p>'); 
       } else {
        $('.records').html(results); 
       }
       

       $('.records a:first-child').addClass('activeRecord');
       $('.records a:first-child').siblings().removeClass('activeRecord');
      
       $("#searchEngine").focus();
       $('#countPersonnel').html(result['data'].length);
      }
    }, error: function (jqXHR, textStatus, errorThrown) {
        console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
      }
    });
  }
//----------- Remove location query -----------
function removeLocationQuery(id) {
  $(`#locationFilter${id}`).remove();
  let removeLocationArray = [id];
  getEmployeesData(removeLocationArray, newDepartmentsList, 1, 0, $("#searchEngine").val());  
  newLocastionsList = locationsQueryList;
  newDepartmentsList = departmentsQueryList;
}
//----------- Remove department query -----------
function removeDepartmentQuery(id) {
  $(`#departmentFilter${id}`).remove();
  let removeDepartmentArray = [id];
  getEmployeesData(newLocastionsList, removeDepartmentArray, 0, 1, $("#searchEngine").val());  
  newLocastionsList = locationsQueryList;
  newDepartmentsList = departmentsQueryList;
}
//----------- Choose department query -----------
function addDepartmentQuery(id, departmentQueryName) {
  $('#records-card-list').removeClass("overflow-hidden");
  $('#records-card-list').addClass("overflow-auto");
  $(`<button type="button" class="btn btn-outline-primary btn-sm me-2 mb-2 mt-2"  onclick="removeDepartmentQuery(${id})" id="departmentFilter${id}">${departmentQueryName} x </button>`).appendTo('#filters');
 let addDepartmentArray = [id];
  getEmployeesData(newLocastionsList, addDepartmentArray, 0, 1, $("#searchEngine").val());  
 newLocastionsList = locationsQueryList;
 newDepartmentsList = departmentsQueryList;
}

$('#chooseDepartmentTrigger').on('click', function() {
  chooseDepartment();
  $('#records-card-list').addClass("overflow-hidden");
  $('#records-card-list').removeClass("overflow-auto");
});

function chooseDepartment() {
  $.ajax({
    url: "libs/php/departments.php",
    type: 'POST',
    dataType: 'json',
    data: {
    },

    success: function (depResult5) {
      if (depResult5.status.name == "ok") {
        let departments5='';
       $('#countDepartments').html(depResult5['data'].length);
        for(let b=0; b<depResult5['data'].length; b++) {
          if(newDepartmentsList.find(i => i == depResult5['data'][b]['id']) == undefined) {
              departments5 +=`<a href="#" class="list-group-item list-group-item-action"  data-bs-dismiss="modal" onclick="addDepartmentQuery(${depResult5['data'][b]['id']}, '${depResult5['data'][b]['name']}')">
              ${depResult5['data'][b]['name']} </a>`; 
          }
        }
        if(departments5=='') {
          $('#choose-departments-list').html('No more departments to choose from.'); 
        } else {
          $('#choose-departments-list').html(departments5);
       }
      }} , error: function (jqXHR, textStatus, errorThrown) {
          console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
        }
      });
    }

//----------- Choose location query -----------
function addLocationQuery(id, locationQueryName) {
  $('#records-card-list').removeClass("overflow-hidden");
  $('#records-card-list').addClass("overflow-auto");
  $(`<button type="button" class="btn btn-outline-primary btn-sm me-2 mb-2 mt-2"  onclick="removeLocationQuery(${id})" id="locationFilter${id}">${locationQueryName} x </button>`).appendTo('#filters');
 let addLocationArray = [id];
  getEmployeesData(addLocationArray, newDepartmentsList, 1, 0, $("#searchEngine").val());  
 newLocastionsList = locationsQueryList;
 newDepartmentsList = departmentsQueryList;
}

$('#chooseLocationTrigger').on('click', function() {
  chooseLocation();
  $('#records-card-list').addClass("overflow-hidden");
  $('#records-card-list').removeClass("overflow-auto");
});

$('.filtersShowRecords').on('click', function(){
  $('#records-card-list').removeClass("overflow-hidden");
  $('#records-card-list').addClass("overflow-auto");
 
  
});
function chooseLocation() {
  $.ajax({
    url: "libs/php/locations.php",
    type: 'POST',
    dataType: 'json',
    data: {
    },

    success: function (locResult5) {
      if (locResult5.status.name == "ok") {
        let locations5='';
        $('#countLocations').html(locResult5['data'].length);
          for(let a=0; a<locResult5['data'].length; a++) {
            if(newLocastionsList.find(i => i == locResult5['data'][a]['id']) == undefined) {
                locations5 +=`<a href="#" class="list-group-item list-group-item-action"  data-bs-dismiss="modal" onclick="addLocationQuery(${locResult5['data'][a]['id']}, '${locResult5['data'][a]['name']}')">
                ${locResult5['data'][a]['name']} </a>`; 
            }
          }
          if(locations5=='') {
            $('#choose-locations-list').html('No more locations to choose from.');   
          } else {
            $('#choose-locations-list').html(locations5);
          }
       
       }
      } , error: function (jqXHR, textStatus, errorThrown) {
          console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
        }
      });
    }



//----------- Search ----------- 
$("#searchEngine").on("input", function() {
 
  getEmployeesData(newLocastionsList, newDepartmentsList, 1, 1, $(this).val());
 
}); 


//----------- Employee Data Card ----------- 
      $('#closePersonCard').on('click', () => {
        $('#recordBlock').addClass('d-none');
        $('#closePersonCard').addClass('d-none');
        $('.topRow').removeClass('d-none');
        $('#hideTopButtons').removeClass('d-none');
      $('#firstColumn').removeClass('d-none');
      });
    function showEmployee(personID, circleColor, listRecord, newQuery) {
      $('#person' + listRecord).addClass('activeRecord');
      $('#person' + listRecord).siblings().removeClass('activeRecord');
      $('.records').trigger('click');
      $('.search-row').addClass('d-none');
      $('#deleteEmployeeConfirmation').attr('onclick',`deleteEmployee(${personID})`);
      if(newQuery==1) {
        $('#recordBlock').removeClass('d-none');
        $('#closePersonCard').removeClass('d-none');
        $('#personHeader').addClass('d-flex justify-content-between');
        $('.topRow').addClass('d-none');
        $('#firstColumn').addClass('d-none');
      }
  
      editedPerson = listRecord;
      $.ajax({
        url: "libs/php/getPersonByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
          id: personID
        },
    
        success: function (personInfo) {
          if (personInfo.status.name == "ok") {
            currentID = personInfo['data'][0]['id'];
      let jobTitle = '';
      if(personInfo['data'][0]['jobTitle'] != '' && personInfo['data'][0]['jobTitle'] != null) {
        jobTitle = `<div class="personQuery"><span class="text-secondary infoSpan">Job title</span><br>${personInfo['data'][0]['jobTitle']}</div>`;
      }
      
      $('#employeeData').html(`<div class="row"><div class="col d-flex w-100 align-items-center">
      <div class="text-white bg-${circleColors[circleColor]} round big-circle">${personInfo['data'][0]['firstName'][0]}${personInfo['data'][0]['lastName'][0]}</div>
      <div class="record-right"><h3>${personInfo['data'][0]['firstName']} ${personInfo['data'][0]['lastName']}</h3></div>
      </div></div>

      <div class="row"><div class="col-12 col-lg-6">
      <div class="employeeInfo">Employee job information</div>
      <hr class="infoHr">
      ${jobTitle}
      <div class="personQuery"><span class="text-secondary infoSpan">Department</span><br>${personInfo['data'][0]['department']}</div>
      <div class="personQuery"><span class="text-secondary infoSpan">Location</span><br>${personInfo['data'][0]['location']}</div>
      </div>
      
      <div class="col-12 col-lg-6">
      <div class="employeeInfo">Contact</div>
      <hr class="infoHr">
      <div class="personQuery"><span class="text-secondary infoSpan">Email</span><br>${personInfo['data'][0]['email']}</div>
      </div></div>
      <div class="row"><div class="col-12 d-flex justify-content-end">
      <button type="button" class="btn btn-sm btn-outline-primary" id="editProfileButton" data-bs-toggle="modal" data-bs-target="#modalPerson"><img src="libs/img/pencil.svg" class="extraDataImg" alt="Edit Personal Data"> Edit employee profile</button>
      </div></div>
      `)
      $("#editProfileButton").on("mouseenter mouseleave", () => {
        $("#editProfileBottomButton").toggleClass("whiteDataImg");
       
    }); 
    $('#editProfileButton').on('click', function() {
      editPerson();
      $('#records-card-list').addClass("overflow-hidden");
      $('#records-card-list').removeClass("overflow-auto");
      $('#employeeCard').addClass("overflow-hidden");
      $('#employeeCard').removeClass("overflow-auto");
      
    });
  }
}, error: function (jqXHR, textStatus, errorThrown) {
    console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
  }
}); 
    }
//----------- Confrim new Employee ---------- 
$('#createPersonButton').on('click', function() {
  $('#confFirstName').html(firstNamePersonnel);
  $('#confLastName').html(lastNamePersonnel);
  $('#confJobTitle').html(jobTitlePersonnel); 
  $('#confEmail').html(emailPersonnel);
  $('#confDepartment').html($("#departmentIDPersonnel option:selected").text());
});

//----------- Create Employee -----------
$('#insertPersonData').on('click', function() {
  
  if(editPersonID != -1) {
    depURL = "libs/php/updatePersonnelByID.php";
  } else {
    depURL = "libs/php/insertPersonnel.php";
  }
  
    $.ajax({
      url: depURL,
      type: 'POST',
      dataType: 'json',
      data: {
        id: currentID,
        firstName: firstNamePersonnel,
        lastName: lastNamePersonnel,
        jobTitle: jobTitlePersonnel,
        email: emailPersonnel,
        departmentID: departmentIDPersonnel
      },
      success: function (insertPersonnel) {
        $( "#createPersonButton" ).attr( "data-bs-toggle", "" );
          if (insertPersonnel.status.name == "error") {
            window.location.hash = '#newPersonError';
            $('#firstNamePersonnelValidation').html('Provide firt name.');

          if(insertPersonnel.data.firstName!='') {
            firstNamePersonnelCheck = 0;
            $('#personForm').removeClass("was-validated");
            $('#firstNamePersonnel').removeClass("is-valid");
            $('#firstNamePersonnel').addClass("is-invalid");
            $("#createPersonButton").attr('disabled', true);
            showFirstNameMessage = insertPersonnel.data.firstName + '<br>';
          }

          if(insertPersonnel.data.lastName!='') {
            lastNamePersonnelCheck = 0;
            $('#personForm').removeClass("was-validated");
            $('#lastNamePersonnel').removeClass("is-valid");
            $('#lastNamePersonnel').addClass("is-invalid");
            $("#createPersonButton").attr('disabled', true);
            showLastNameMessage = insertPersonnel.data.lastName + '<br>';
          }

          if(insertPersonnel.data.email!='') {
            emailPersonnelCheck = 0;
            $('#personForm').removeClass("was-validated");
            $('#emailPersonnel').removeClass("is-valid");
            $('#emailPersonnel').addClass("is-invalid");
            $("#createPersonButton").attr('disabled', true);
            showEmailMessage = insertPersonnel.data.email + '<br>';
          }

          if(insertPersonnel.data.jobTitle!='') {
            $('#personForm').removeClass("was-validated");
            $('#jobTitlePersonnel').removeClass("is-valid");
            $('#jobTitlePersonnel').addClass("is-invalid");
            showJobTitleMessage = insertPersonnel.data.jobTitle + '<br>';
          }

          if(insertPersonnel.data.departmentID!='') {
            firstNamePersonnelCheck = 0;
            $('#personForm').removeClass("was-validated");
            $('#departmentIDPersonnel').removeClass("is-valid");
            $('#departmentIDPersonnel').addClass("is-invalid");
            showDepartmentIDMessage = insertPersonnel.data.departmentID + '<br>';
          }

          $('#newPersonError').html(`<div class="alert alert-danger" role="alert">
          ${showFirstNameMessage}  ${showLastNameMessage}  ${showEmailMessage}  ${showDepartmentIDMessage} ${showJobTitleMessage}
        </div>
          `);
          

          $("#firstNamePersonnel").one("keyup change", function() {
            $(this).removeClass("is-invalid");
            $("#createPersonButton").attr('disabled', false);
          });
          $("#lastNamePersonnel").one("keyup change", function() {
            $(this).removeClass("is-invalid");
            $("#createPersonButton").attr('disabled', false);
          });
          $("#emailPersonnel").one("keyup change", function() {
            $(this).removeClass("is-invalid");
            $("#createPersonButton").attr('disabled', false);
          });
          $("#departmentIDPersonnel").one("change", function() {
            $(this).removeClass("is-invalid");
          });
          $("#jobTitlePersonnel").one("keyup change", function() {
            $(this).removeClass("is-invalid");
            $( "#createPersonButton" ).attr( "data-bs-toggle", "modal" );
          });
        } else  if (insertPersonnel.status.name == "ok") { 
          
          $('#records-card-list').removeClass("overflow-hidden");
          $('#records-card-list').addClass("overflow-auto");
          $('#employeeCard').removeClass("overflow-hidden");
          $('#employeeCard').addClass("overflow-auto");
          $('#newPersonError').html('');
          if(editPersonID != -1) {
            getEmployeesData();
            $('#employeeCard').addClass('d-sm-none d-none');
            $('#records-card-list').addClass('d-sm-none d-none');
           editedPerson2 = editedPerson;
           $('#editPersonSuccess').modal('toggle'); 
              setTimeout(function() {
                 $('#editPersonSuccess').modal('toggle');
                 $('#employeeCard').removeClass('d-sm-none d-none');
                 $('#records-card-list').removeClass('d-sm-none d-none');
                 $(`#person${editedPerson2}`).trigger('click'); 
                 window.location.hash = `#person${editedPerson2}`;
                }, 2000);
          } else {
         $('#insertPersonSuccess').modal('toggle'); 
         setTimeout(function() {
            $('#insertPersonSuccess').modal('toggle'); 
           }, 2000);
           getEmployeesData();
          }

         $('#recordBlock').addClass('d-none');
         $('#closePersonCard').addClass('d-none');
         $('.topRow').removeClass('d-none');
         $('#firstColumn').removeClass('d-none');

         $('#personForm').trigger("reset");
         $('#personForm').removeClass("was-validated");
         $("#newPersonButton").attr('disabled', false);
         $('#modalPerson').modal('toggle'); 
         editPersonID = -1;

        }}, error: function (jqXHR, textStatus, errorThrown) {
          console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
        }
      });

});

//----------- Add Employee Form----------- 

$("#firstNamePersonnel").on("keyup change", function() {
  if($(this).val().length<3) {
    $('#firstNamePersonnelValidation').html('Must have 3 letters minimum.');
    $("#createPersonButton").attr('disabled', true);
    firstNamePersonnelCheck = 0;
  } else {
    $("#createPersonButton").attr('disabled', false);
    firstNamePersonnelCheck = 1;
   
  if(firstNamePersonnelCheck!=0 && lastNamePersonnelCheck!=0 && emailPersonnelCheck!=0 && departmentIDPersonnelCheck !=0) { 
    $( "#createPersonButton" ).attr( "data-bs-toggle", "modal" );
  }

  if($(this).val()) {
    firstNamePersonnel = $(this).val();
      $('#createPersonButton').attr('disabled', false);
  } else {
    firstNamePersonnelCheck = 0;
      firstNamePersonnel = '';
  }
}

});

$("#lastNamePersonnel").on("keyup change", function() {
  if($(this).val().length<3) {
    $('#depNameValidation').html('Must have 3 letters minimum.');
    $("#createPersonButton").attr('disabled', true);
    lastNamePersonnelCheck = 0;
  } else {
    $("#createPersonButton").attr('disabled', false);
    lastNamePersonnelCheck = 1;
   
  if(firstNamePersonnelCheck!=0 && lastNamePersonnelCheck!=0 && emailPersonnelCheck!=0 && departmentIDPersonnelCheck !=0) { 
    $( "#createPersonButton" ).attr( "data-bs-toggle", "modal" );
  }
 
  if($(this).val()) {
    lastNamePersonnel = $(this).val();
    if(lastNamePersonnelOld !=$(this).val()) {
      $('#createPersonButton').attr('disabled', false);
    }
  } else {
    lastNamePersonnelCheck = 0;
      $('#newDepNameConfirm').html(''); 
      lastNamePersonnel = '';
  }
}

});


$("#jobTitlePersonnel").on("keyup change", function() {
  jobTitlePersonnel = $(this).val();
});

$("#emailPersonnel").on("keyup change", function() {
  if($(this).val().length<3) {
    $('#depNameValidation').html('Must have 3 letters minimum.');
    $("#createPersonButton").attr('disabled', true);
    emailPersonnelCheck = 0;
  } else if(!$(this).val().match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
    $('#depNameValidation').html('Email address is not correct.');
    $("#createPersonButton").attr('disabled', true);
    emailPersonnelCheck = 0;
  } else {
    $("#createPersonButton").attr('disabled', false);
    emailPersonnelCheck = 1;
   
  if(firstNamePersonnelCheck!=0 && emailPersonnelCheck!=0 && lastNamePersonnelCheck!=0 && departmentIDPersonnelCheck !=0) {
    $( "#createPersonButton" ).attr( "data-bs-toggle", "modal" );
  }
  if($(this).val()) {
    emailPersonnel = $(this).val();
    if(emailPersonnelOld !=$(this).val()) {
      $('#createPersonButton').attr('disabled', false);
    }
  } else {
    emailPersonnelCheck = 0;
      $('#newDepNameConfirm').html(''); 
      emailPersonnel = '';
  }
}
});
$("#departmentIDPersonnel").on('change',function() {
  if($(this).val()) {
    departmentIDPersonnelCheck = 1;
   
    departmentIDPersonnel = $('#departmentIDPersonnel').val();
    if((firstNamePersonnelCheck!=0 && lastNamePersonnelCheck!=0 && emailPersonnelCheck!=0)) { 
      $('#createPersonButton').attr( "data-bs-toggle", "modal" );
      $('#createPersonButton').attr('disabled', false);
    }
  } else {
    departmentIDPersonnelCheck = 0;
    $('#newDepNameConfirm').html(''); 
    departmentIDPersonnel = 0;
  }
});

    $('#addNewPerson').on('click', function() {
      $('#records-card-list').addClass("overflow-hidden");
      $('#records-card-list').removeClass("overflow-auto");
      editPersonID = -1;
   $('#personCardTittle').html('Add Employee Data');
   $('#createPersonButton').html('Add Employee');
      firstNamePersonnelCheck = 0;
      lastNamePersonnelCheck = 0;
      emailPersonnelCheck = 0;
      departmentIDPersonnelCheck = 0;

      $.ajax({
        url: "libs/php/departments.php",
        type: 'POST',
        dataType: 'json',
        data: {
        },
    
        success: function (depResult) {
          if (depResult.status.name == "ok") {
            let departments = '<option value="" disabled selected>Open to select</option>';
            for(let dep=0; dep<depResult['data'].length; dep++) {
              departments +=`<option value="${depResult['data'][dep]['id']}">${depResult['data'][dep]['name']}</option>`;
            }
            $('#departmentIDPersonnel').html(departments);
  }}, error: function (jqXHR, textStatus, errorThrown) {
      console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
    }
  }); 
    });


$('#editProfileTopButton').on('click', function() {
  editPerson();
  $('#records-card-list').addClass("overflow-hidden");
  $('#records-card-list').removeClass("overflow-auto");
  $('#employeeCard').addClass("overflow-hidden");
  $('#employeeCard').removeClass("overflow-auto");

});
//----------- Edit Person Data ----------- 
function editPerson() {

  editPersonID = currentID;
  $('#personCardTittle').html('Edit Employee Data');
   $('#createPersonButton').html('Save Changes');
      firstNamePersonnelCheck = 1;
      lastNamePersonnelCheck = 1;
      emailPersonnelCheck = 1;
      departmentIDPersonnelCheck = 1;
     
  $.ajax({
    url: "libs/php/getPersonByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: editPersonID
    },

    success: function (personInfo2) {
      if (personInfo2.status.name == "ok") {
$("#createPersonButton").attr('disabled', false);
firstNamePersonnel = personInfo2['data'][0]['firstName'];
lastNamePersonnel = personInfo2['data'][0]['lastName'];
jobTitlePersonnel = personInfo2['data'][0]['jobTitle'];
emailPersonnel = personInfo2['data'][0]['email'];
departmentIDPersonnel = personInfo2['data'][0]['departmentID'];
currentID = personInfo2['data'][0]['id'];

$('#firstNamePersonnel').val(personInfo2['data'][0]['firstName']);
$('#lastNamePersonnel').val(personInfo2['data'][0]['lastName']);
$('#emailPersonnel').val(personInfo2['data'][0]['email']);
$('#jobTitlePersonnel').val(personInfo2['data'][0]['jobTitle']);
$( "#createPersonButton" ).attr( "data-bs-toggle", "modal" );
$.ajax({
  url: "libs/php/departments.php",
  type: 'POST',
  dataType: 'json',
  data: {
  },

  success: function (depResult3) {
    if (depResult3.status.name == "ok") {

      
      let departments2 = '<option value="" disabled>Open to select</option>';
      for(let dep=0; dep<depResult3['data'].length; dep++) {
        if(depResult3['data'][dep]['id'] == personInfo2['data'][0]['departmentID']) {
          departments2 +=`<option value="${depResult3['data'][dep]['id']}" selected>${depResult3['data'][dep]['name']}</option>`;
        } else {
          departments2 +=`<option value="${depResult3['data'][dep]['id']}">${depResult3['data'][dep]['name']}</option>`;
        }
        
      }
      $('#departmentIDPersonnel').html(departments2);
}}, error: function (jqXHR, textStatus, errorThrown) {
console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
}
}); 


}
}, error: function (jqXHR, textStatus, errorThrown) {
console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
}
}); 


}
//----------- Delete Employee ----------- 
function deleteEmployee(personID) {
  $.ajax({
    url: "libs/php/deletePersonByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: personID
    },

    success: function (deletePersonResult) {
   if (deletePersonResult.status.name == "ok") {
    
    getEmployeesData();
    $('#deletePersonSuccess').modal('toggle'); 
    setTimeout(function() {
       $('#deletePersonSuccess').modal('toggle'); 
       getDepartments();
      }, 2000);

      }} , error: function (jqXHR, textStatus, errorThrown) {
        console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
      }
    });
}    

//---------- Events listeners -----------

    $("#imgB1").on("mouseenter mouseleave", () => {
            $("#imgB1a").toggleClass("whiteDataImg");
        });
      $("#imgB2").on("mouseenter mouseleave", () => {
        $("#imgB2a").toggleClass("whiteDataImg");
    });

      $("#imgB1").on("click", () => {
        getDepartments();
        $('#records-card-list').addClass("overflow-hidden");
        $('#records-card-list').removeClass("overflow-auto");
      });

       $("#imgB2").on("click", () => {
        getLocations();
        $('#records-card-list').addClass("overflow-hidden");
        $('#records-card-list').removeClass("overflow-auto");   
      });

      $('.showRecords').on("click", () => {
        $('#records-card-list').removeClass("overflow-hidden");
        $('#records-card-list').addClass("overflow-auto");
      });
     
    $('.dropdown-toggle').on('click', (event) => { 
        $('.dropdown-menu').toggle();
        event.stopPropagation();
    });
    $('.dropdown-menu').on('mouseleave', () => { 
        $('.dropdown-menu').toggle();
        
    });
    $(document).on('click', () => { 
        $('.dropdown-menu').hide();
    });
   $('#imgLogo').on('click', () => {
      window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname;
   })
   let checkNewDepartmentQuery = 0;
   let checkEditDepartmentQuery = 0;
   $('.closeDepartmentModal').on('click', function() {
     if(checkNewDepartmentQuery!=0 || checkEditDepartmentQuery != 0) {
    $("#cancelNewDepartment").trigger("click");
    checkNewDepartmentQuery = 0;
    checkEditDepartmentQuery = 0;
  }
   });

   let checkNewLocationQuery = 0;
   let checkEditLocationQuery = 0;
   $('.closeLocationModal').on('click', function() {
     if(checkNewLocationQuery!=0 || checkEditLocationQuery != 0) {
    $("#cancelNewLocation").trigger("click");
    checkNewLocationQuery = 0;
    checkEditLocationQuery = 0;
  }
   });

   function cleanPersonForm() {
        $('#personForm').trigger("reset");
        $('#personForm').removeClass("was-validated");
        $("#newPersonButton").attr('disabled', false);
        firstNamePersonnel = '';
        lastNamePersonnel = '';
        jobTitlePersonnel = '';
        emailPersonnel = '';
        departmentIDPersonnel = '';
        firstNamePersonnelCheck = 0;
        lastNamePersonnelCheck = 0;
        emailPersonnelCheck = 0;
        departmentIDPersonnelCheck = 0;
        $("#createPersonButton").attr("data-bs-toggle","");
      
 
   }
   $('#cancelNewPerson').on('click', () => {
      cleanPersonForm();
      $('#records-card-list').removeClass("overflow-hidden");
      $('#records-card-list').addClass("overflow-auto");
      $('#employeeCard').removeClass("overflow-hidden");
      $('#employeeCard').addClass("overflow-auto");
   });

   $('#closePersonModal').on('click', () => {
      cleanPersonForm();
      $('#records-card-list').removeClass("overflow-hidden");
      $('#records-card-list').addClass("overflow-auto");
      $('#employeeCard').removeClass("overflow-hidden");
      $('#employeeCard').addClass("overflow-auto");
  });
   
   $('#cancelNewDepartment').on('click', () => {
    checkNewDepartmentQuery = 0;
    checkEditDepartmentQuery = 0;
     $('#departmentForm').trigger("reset");
     $('#departmentForm').removeClass("was-validated");
     $("#newDepartment").attr('disabled', false);
     $(".pencil-button-departments").attr('disabled', false);
     $(".trash-button-departments").attr('disabled', false);
   });

   $('#cancelNewLocation').on('click', () => {
    checkNewLocationQuery = 0;
    checkEditLocationQuery = 0;
     $('#LocationForm').trigger("reset");
     $('#LocationForm').removeClass("was-validated");
     $("#newLocation").attr('disabled', false);
     $(".pencil-button-locations").attr('disabled', false);
     $(".trash-button-locations").attr('disabled', false);
   });

// --------- New Department Form ------------
   $("#newDepartment").on("click", () => {
    checkNewDepartmentQuery = 1;
    $("#department-edit-title").html('Create Department:');
    $("#createDepButton").html('Create Department');
    $("#departmentName").attr('value', '');
    $("#newDepartment").attr('disabled', true);
    checkDepName = 0;
    checkDepLocal = 0;
    $( "#createDepButton" ).attr( "data-bs-toggle", "" );
    $(".pencil-button-departments").attr('disabled', true);
    $(".trash-button-departments").attr('disabled', true);

    $.ajax({
      url: "libs/php/locations.php",
      type: 'POST',
      dataType: 'json',
      data: {
      },
  
      success: function (locResult) {
        if (locResult.status.name == "ok") {
       
          let locations = '<option value="" disabled selected>Open to select</option>';
          for(let loc=0; loc<locResult['data'].length; loc++) {
            locations +=`<option value="${locResult['data'][loc]['id']}">${locResult['data'][loc]['name']}</option>`;
          }
          $('#depLocationsList').html(locations);
}}, error: function (jqXHR, textStatus, errorThrown) {
    console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
  }
});
  });

// --------- New Location Form ------------
$("#newLocation").on("click", () => {
  checkNewLocationQuery = 1;
  $("#location-edit-title").html('Create Location:');
  $("#createLocButton").html('Create Location');
  $("#locationName").attr('value', '');
  $("#newLocation").attr('disabled', true);
  checkLocName = 0;
  $( "#createLocButton" ).attr( "data-bs-toggle", "" );
  $(".pencil-button-locations").attr('disabled', true);
  $(".trash-button-locations").attr('disabled', true);

});

$("#locationName").on("keyup change", function() {
  if($(this).val().length<3) {
    $('#locNameValidation').html('Must have 3 letters minimum.');
    $("#createLocButton").attr('disabled', true);
    checkLocName = 0;
  } else {
    $("#createLocButton").attr('disabled', false);
    checkLocName = 1;
  if(checkLocName!=0) {
    $( "#createLocButton" ).attr( "data-bs-toggle", "modal" );
  }
  if($(this).val()) {
    newLocName = $(this).val();
    if(oldLocationName !=$(this).val()) {
      $('#createLocButton').attr('disabled', false);
    }
  } else {
      checkLocName = 0;
      $('#newLocNameConfirm').html(''); 
      newLocName = '';
  }
}
});

  $("#departmentName").on("keyup change", function() {
    if($(this).val().length<3) {
      $('#depNameValidation').html('Must have 3 letters minimum.');
      $("#createDepButton").attr('disabled', true);
      checkDepName = 0;
    } else {
      $("#createDepButton").attr('disabled', false);
      checkDepName = 1;
    if(checkDepName!=0 && checkDepLocal!=0) {
      $( "#createDepButton" ).attr( "data-bs-toggle", "modal" );
    }
    if($(this).val()) {
      newDepName = $(this).val();
      if(oldDepartmentName !=$(this).val()) {
        $('#createDepButton').attr('disabled', false);
      }
    } else {
        checkDepName = 0;
        $('#newDepNameConfirm').html(''); 
        newDepName = '';
    }
  }
  });


  $("#depLocationsList").on('change',function() {
    checkDepLocal = 1;
    if($(this).val()) {
      newDepLocation = $('#depLocationsList').val();
      if(checkDepName!=0 || (departmentNameLength > 2 && editDepID != -1)) {
        
        $('#createDepButton').attr( "data-bs-toggle", "modal" );
        $('#createDepButton').attr('disabled', false);
      }
    } else {
      checkDepLocal = 0;
      $('#newDepNameConfirm').html(''); 
      newDepLocation = '';
    }
 
  });
  $('#createDepButton').on('click', function() { 
  if(checkDepName!=0 && checkDepLocal!=0) {
    $('#newDepartmentError').html(``);
    $('#newDepNameConfirm').html(newDepName);
    $('#newDepLocationConfirm').html($("#depLocationsList option:selected").text()); 
  }
  });

  $('#createLocButton').on('click', function() { 
    if(checkLocName!=0) {
      $('#newLocationError').html(``);
      $('#newLocNameConfirm').html(newLocName);
    }
    });
//----------- Edit Location ----------- 
function editLocation(id, name) {
  editLocID = id;
  newLocName = name;
  checkLocName = 1;
  checkEditLocationQuery = 1;
  $("#location-edit-title").html('Edit Location:');
  $("#createLocButton").html('Save Changes');
  $("#newLocation").attr('disabled', true);
  $( "#createLocButton" ).attr( "data-bs-toggle", "modal" );
  $(".pencil-button-locations").attr('disabled', true);
  $(".trash-button-locations").attr('disabled', true);
  $("#locationName").attr('value', name);
}

//----------- Edit Department ----------- 
function editDepartment(id, locationID, name) {
  editDepID = id;
  newDepName = name;
  newDepLocation = locationID;
  checkDepName = 1;
  checkDepLocal = 1;
  checkEditDepartmentQuery = 1;
  
  $("#department-edit-title").html('Edit Department:');
  $("#createDepButton").html('Save Changes');
  $("#newDepartment").attr('disabled', true);
  $( "#createDepButton" ).attr( "data-bs-toggle", "modal" );
  $(".pencil-button-departments").attr('disabled', true);
  $(".trash-button-departments").attr('disabled', true);
  $("#departmentName").attr('value', name);
  departmentNameLength = $("#departmentName").val().length;
  $.ajax({
    url: "libs/php/locations.php",
    type: 'POST',
    dataType: 'json',
    data: {
    },

    success: function (locResult) {
      if (locResult.status.name == "ok") {
     
        let locations = '<option value="" disabled selected>Open to select</option>';
        for(let loc=0; loc<locResult['data'].length; loc++) {
          if(locResult['data'][loc]['id'] == locationID) {
            locations +=`<option value="${locResult['data'][loc]['id']}" selected>${locResult['data'][loc]['name']}</option>`;
          } else {
          locations +=`<option value="${locResult['data'][loc]['id']}">${locResult['data'][loc]['name']}</option>`;
        }
        }
        $('#depLocationsList').html(locations);
} 
}, error: function (jqXHR, textStatus, errorThrown) {
  console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
}
});
}

//----------- Create Location -----------
$('#createLocation').on('click', function() {
  oldLocationName = newLocName;
  if(editLocID != -1) {
    locURL = "libs/php/updateLocationByID.php";
  } else {
    locURL = "libs/php/insertLocation.php";
  }
  $('#createLocButton').attr('disabled', true);
    $.ajax({
      url: locURL,
      type: 'POST',
      dataType: 'json',
      data: {
        id: editLocID,
        name: newLocName,
      },
      success: function (insertLoc) {
     
        $( "#createLocButton" ).attr( "data-bs-toggle", "" );
        if (insertLoc.status.name == "error") {
          checkLocName=0;
          $('#newLocationError').html(`<div class="alert alert-danger" role="alert">
          ${insertLoc.status.des1} <br>
        </div>
          `);
            $('#LocationForm').removeClass("was-validated");
            $('#locationName').removeClass("is-valid");
            $('#locationName').addClass("is-invalid");
          $("#locationName").one("keyup change", function() {
            $(this).removeClass("is-invalid");
          });
        
        } else if (insertLoc.status.name == "ok") {
          $("#cancelNewLocation").trigger("click");
          if(editLocID != -1) {
           $('#editLocationSuccess').modal('toggle'); 
              setTimeout(function() {
                 $('#editLocationSuccess').modal('toggle'); 
                 getLocations();
               }, 2000);

          } else {
            $('#newLocationSuccess').html(`<div class="alert alert-success" role="alert" id="successLoc">
            <h4 class="alert-heading">Success!</h4><p>The location has been created.</p></div>`);
          }
          editLocID = -1;
          getEmployeesData();
         setTimeout(function() {
          $('#successLoc').fadeOut('normal');
          getLocations();
        }, 2000);

        }}, error: function (jqXHR, textStatus, errorThrown) {
          console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
        }
      });

});

//----------- Create Department -----------
$('#createDepartment').on('click', function() {
  oldDepartmentName = newDepName;
  if(editDepID != -1) {
   
    depURL = "libs/php/updateDepartmentByID.php";
  } else {
    depURL = "libs/php/insertDepartment.php";
  }
  $('#createDepButton').attr('disabled', true);
    $.ajax({
      url: depURL,
      type: 'POST',
      dataType: 'json',
      data: {
        id: editDepID,
        name: newDepName,
        locationID: newDepLocation
      },
      success: function (insertDep) {
   
        $( "#createDepButton" ).attr( "data-bs-toggle", "" );
        if (insertDep.status.name == "error") {
          checkDepName=0;
          checkDepLocal=0;
          $('#newDepartmentError').html(`<div class="alert alert-danger" role="alert">
          ${insertDep.status.des1} <br>
          ${insertDep.status.des2}
        </div>
          `);
            $('#departmentForm').removeClass("was-validated");
            $('#departmentName').removeClass("is-valid");
            $('#departmentName').addClass("is-invalid");
          $("#departmentName").one("keyup change", function() {
            $(this).removeClass("is-invalid");
          });
          if (insertDep.status.des2!='') {
          $('#depLocationsList').val("");
          $('#depLocationsList').removeClass("is-valid");
          $('#depLocationsList').addClass("is-invalid");
          } else {
            checkDepLocal=1;
          }
          $("#depLocationsList").one("change", function() {
            $(this).removeClass("is-invalid");
          });
        } else if (insertDep.status.name == "ok") {
          $("#cancelNewDepartment").trigger("click");
          if(editDepID != -1) {
           $('#editDepartmentSuccess').modal('toggle'); 
              setTimeout(function() {
                 $('#editDepartmentSuccess').modal('toggle'); 
                 getDepartments();
                }, 2000);

          } else {
            $('#newDepartmentSuccess').html(`<div class="alert alert-success" role="alert" id="successDep">
            <h4 class="alert-heading">Success!</h4><p>The department has been created.</p></div>`);
          }
          editDepID = -1;
          getEmployeesData();
         setTimeout(function() {
          $('#successDep').fadeOut('normal');
          getDepartments();
        }, 2000);

        }}, error: function (jqXHR, textStatus, errorThrown) {
          console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
        }
      });

});

//----------- List of the locations ----------- 
function getLocations() {
  $.ajax({
    url: "libs/php/locations.php",
    type: 'POST',
    dataType: 'json',
    data: {
    },

    success: function (locResult) {
      if (locResult.status.name == "ok") {

        
        let locations='';
        let locNameLoop, locEdit;
        for(let a=0; a<locResult['data'].length; a++) {
          locEdit =`onClick="editLocation(${locResult['data'][a]['id']}, '${locResult['data'][a]['name']}')"`;
          locNameLoop =`onClick="deleteLocation(${locResult['data'][a]['id']}, ${a}, '${locResult['data'][a]['name']}')"`;
           locations +=`<li class="list-group-item d-flex justify-content-between align-items-center locContainter" id="trashNumber${a}">
           <div>${a+1}. ${locResult['data'][a]['name']} </div>
           <div class="d-flex align-items-center"><button type="button" class="btn btn-sm btn-outline-primary me-2 pencil-button pencil-button-locations"  data-bs-toggle="collapse" data-bs-target="#addLocation" ${locEdit}><img src="libs/img/pencil.svg" class="pencil smallPencil" alt="Edit Location" id="locPencilImg${a}"></button>
            <button type="button" class="btn btn-sm btn-outline-danger trash-button trash-button-locations" data-bs-toggle="collapse" data-bs-target="#thisLocation${a}" id="thisLocTrash${a}" ${locNameLoop}><img src="libs/img/trash.svg" class="trashcan smallTrash" alt="Delete Location" id="locTrashImg${a}"></button></div>
            <div id="thisLocation${a}" class="alert alert-warning confirmLocDelete collapse"></div> </li>`; 
        }
      
       $('#locations-list').html(locations);
       $(".pencil-button").on("mouseenter mouseleave", function() {
        $("img", this).toggleClass("whiteDataImg"); 
        }
      );
      $('.pencil-button').on('click', function() { $('.smallPencil').removeClass('whiteDataImg'); }); 
      $('.trash-button').on('click', function() { $('.smallTrash').removeClass('whiteDataImg'); }); 
      $(".trash-button").on("mouseenter mouseleave", function() {
        $("img", this).toggleClass("whiteDataImg"); 
        }
      );
       }
      } , error: function (jqXHR, textStatus, errorThrown) {
          console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
        }
      });
    }

//----------- List of the departments ----------- 
function getDepartments() {
  $.ajax({
    url: "libs/php/departments.php",
    type: 'POST',
    dataType: 'json',
    data: {
    },

    success: function (depResult) {
      if (depResult.status.name == "ok") {
        let departments='';
        let depNameLoop, depEdit;
        for(let a=0; a<depResult['data'].length; a++) {
          depEdit =`onClick="editDepartment(${depResult['data'][a]['id']}, ${depResult['data'][a]['locationID']}, '${depResult['data'][a]['name']}')"`;
          depNameLoop =`onClick="deleteDepartment(${depResult['data'][a]['id']}, ${a})"`;
           departments +=`<li class="list-group-item d-flex justify-content-between align-items-center depContainter" id="trashNumber${a}">
           <div>${a+1}. ${depResult['data'][a]['name']} <br> 
           <span class="text-secondary font-weight-light department-location">${depResult['data'][a]['location']}</span></div>
           <div class="d-flex align-items-center"><button type="button" class="btn btn-sm btn-outline-primary me-2 pencil-button pencil-button-departments"  data-bs-toggle="collapse" data-bs-target="#addDepartment" ${depEdit}><img src="libs/img/pencil.svg" class="pencil smallPencil" alt="Edit Department" id="depPencilImg${a}"></button>
            <button type="button" class="btn btn-sm btn-outline-danger trash-button trash-button-departments" data-bs-toggle="collapse" data-bs-target="#thisDepartment${a}" id="thisDepTrash${a}" ${depNameLoop}><img src="libs/img/trash.svg" class="trashcan smallTrash" alt="Delete Department" id="depTrashImg${a}"></button></div>
            <div id="thisDepartment${a}" class="alert alert-warning confirmDepDelete collapse"></div> </li>`; 
        }
      
       $('#departments-list').html(departments);
       $(".pencil-button").on("mouseenter mouseleave", function() {
        $("img", this).toggleClass("whiteDataImg"); 
        }
      );
      $('.pencil-button').on('click', function() { $('.smallPencil').removeClass('whiteDataImg'); }); 
      $('.trash-button').on('click', function() { $('.smallTrash').removeClass('whiteDataImg'); }); 
      $(".trash-button").on("mouseenter mouseleave", function() {
        $("img", this).toggleClass("whiteDataImg"); 
        }
      );
       }
      } , error: function (jqXHR, textStatus, errorThrown) {
          console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
        }
      });
    }
  
//----------- Delete Location ----------- 
function deleteLocation(locationID, number) {
  $('.pencil-button-locations').attr('disabled', true);
  $('.trash-button-locations').attr('disabled', true);
  $("#newLocation").attr('disabled', true);

  $.ajax({
    url: "libs/php/deleteLocationByID-CHECK.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: locationID
    },

    success: function (deleteLocResult) {
      if (deleteLocResult.status.name == "error") {
      $(`#thisLocation${number}`).removeClass('alert-warning');
      $(`#thisLocation${number}`).html(`<div class="justify-content-center alertsLoc2 alertsLoc2-danger">${deleteLocResult.status.des}</div>`);
          setTimeout(function() {
          $(`#errorDeleteLoc${number}`).fadeOut('normal');
          getLocations();
          cancelLocationDeletion();
          }, 2000);  

       } else if (deleteLocResult.status.name == "ok") {
        $(`#thisLocation${number}`).html(`<div class="alertsLoc">
  <span>Please confirm deletion</span>
  <div class="d-flex justify-content-between align-items-center">
  <button type="button" class="btn btn-sm btn-secondary me-3" data-bs-toggle="collapse" data-bs-target="#thisLocation${number}" onClick="cancelLocationDeletion()">Cancel</button>
  <button type="button" class="btn btn-sm btn-success" onClick="deleteLocConf(${locationID}, ${number})">Confirm</button></div></div>`);
     
      }} , error: function (jqXHR, textStatus, errorThrown) {
        console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
      }
    });





 
}
function deleteLocConf(locationID, number) {
  $.ajax({
    url: "libs/php/deleteLocationByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: locationID
    },

    success: function (deleteLocResult) {
      if (deleteLocResult.status.name == "error") {
      $(`#thisLocation${number}`).removeClass('alert-warning');
      $(`#thisLocation${number}`).html(`<div class="justify-content-center alertsLoc2 alertsLoc2-danger">${deleteLocResult.status.des}</div>`);
          setTimeout(function() {
          $(`#errorDeleteLoc${number}`).fadeOut('normal');
          getLocations();
          cancelLocationDeletion();
          }, 2000);  

       } else if (deleteLocResult.status.name == "ok") {
        $(`#thisLocation${number}`).removeClass('alert-warning');
        $(`#thisLocation${number}`).html(`<div class=" justify-content-center alertsLoc2 alertsLoc2-success">
        Success! The location has been deleted.</div>`);
          setTimeout(function() {
          $(`#thisLocation${number}`).fadeOut('normal');
          getLocations();
          cancelLocationDeletion();
          }, 1500); 
     
      }} , error: function (jqXHR, textStatus, errorThrown) {
        console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
      }
    });
 }
function cancelLocationDeletion() {
  $("#newLocation").attr('disabled', false);
  $('.pencil-button-locations').attr('disabled', false);
  $('.trash-button-locations').attr('disabled', false);
  }

//----------- Delete Department ----------- 
    function deleteDepartment(departmentID, number) {
      $('.pencil-button-departments').attr('disabled', true);
      $('.trash-button-departments').attr('disabled', true);
      $("#newDepartment").attr('disabled', true);


      $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
          id: departmentID
        },
    
        success: function (deleteDepResult) {
          if (deleteDepResult.status.name == "error") {
          $(`#thisDepartment${number}`).removeClass('alert-warning');
          $(`#thisDepartment${number}`).html(`<div class="justify-content-center alertsDep2 alertsDep2-danger">${deleteDepResult.status.des}</div>`);
              setTimeout(function() {
              $(`#errorDeleteDep${number}`).fadeOut('normal');
              getDepartments();
              cancelDepartmentDeletion();
              }, 2000);  

           } else if (deleteDepResult.status.name == "ok") {
          $(`#thisDepartment${number}`).html(`<div class="alertsDep">
      <span>Please confirm deletion</span>
      <div class="d-flex justify-content-between align-items-center">
      <button type="button" class="btn btn-sm btn-secondary me-3" data-bs-toggle="collapse" data-bs-target="#thisDepartment${number}" onClick="cancelDepartmentDeletion()">Cancel</button>
      <button type="button" class="btn btn-sm btn-success" onClick="deleteDepConf(${departmentID}, ${number})">Confirm</button></div></div>`);
         
          }} , error: function (jqXHR, textStatus, errorThrown) {
            console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
          }
        });

    }
   
    function deleteDepConf(departmentID, number) {
      $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
          id: departmentID
        },
    
        success: function (deleteDepResult) {
          if (deleteDepResult.status.name == "error") {
          $(`#thisDepartment${number}`).removeClass('alert-warning');
          $(`#thisDepartment${number}`).html(`<div class="justify-content-center alertsDep2 alertsDep2-danger">${deleteDepResult.status.des}</div>`);
              setTimeout(function() {
              $(`#errorDeleteDep${number}`).fadeOut('normal');
              getDepartments();
              cancelDepartmentDeletion();
              }, 2000);  

           } else if (deleteDepResult.status.name == "ok") {
            $(`#thisDepartment${number}`).removeClass('alert-warning');
            $(`#thisDepartment${number}`).html(`<div class=" justify-content-center alertsDep2 alertsDep2-success">
            Success! The department has been deleted.</div>`);
              setTimeout(function() {
              $(`#thisDepartment${number}`).fadeOut('normal');
              getDepartments();
              cancelDepartmentDeletion();
              }, 1500); 
         
          }} , error: function (jqXHR, textStatus, errorThrown) {
            console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
          }
        });
     }
      function cancelDepartmentDeletion() {
      $("#newDepartment").attr('disabled', false);
      $('.pencil-button-departments').attr('disabled', false);
      $('.trash-button-departments').attr('disabled', false);
      }

    


(function() {
  'use strict';
  window.addEventListener('load', function() {
    let forms = document.getElementsByClassName('needs-validation');
    Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();