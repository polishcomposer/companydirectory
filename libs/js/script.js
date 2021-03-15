let oldDepartmentName = '';
let oldLocationName = '';
let editDepID = -1;
let editLocID = -1;
let depURL = "";
let locURL = "";
let newDepName, newDepLocation, newLocName;
let checkDepName = 0;
let checkLocName = 0;
let checkDepLocal = 0;
let departmentNameLength = 0;
$.ajax({
    url: "libs/php/search.php",
    type: 'POST',
    dataType: 'json',
    data: {
    },

    success: function (result) {
      if (result.status.name == "ok") {
        let results='';
        let circleColors = ['primary','secondary','success','danger','warning','info'];
        let randomColor;
        for(let a=0; a<result['data'].length; a++) {
          randomColor = Math.floor(Math.random()*6);
           results +=`<a class="list-group-item list-group-item-action record" id="list-home-list" data-toggle="list" href="showEmployee()" role="tab" aria-controls="home">
            <div class="d-flex w-100">
      <div class="mb-1 text-white bg-${circleColors[randomColor]} round">${result['data'][a]['firstName'][0]}${result['data'][a]['lastName'][0]}</div>
            <div class="record-right">
      ${result['data'][a]['firstName']} ${result['data'][a]['lastName']}<br>
      <span class="text-secondary font-weight-light">${result['data'][a]['email']}</span>
      </div>
    </div>
            </a>`;
        }
        let jobTitle = '';
        if(result['data'][0]['jobTitle'] != '') {
          jobTitle = `<div class="personQuery"><span class="text-secondary infoSpan">Job title</span><br>${result['data'][0]['jobTitle']}</div>`;
        }
        $('#employeeData').html(`
        <div class="row"><div class="col d-flex w-100 align-items-center">
        <div class="text-white bg-${circleColors[randomColor]} round big-circle">${result['data'][0]['firstName'][0]}${result['data'][0]['lastName'][0]}</div>
        <div class="record-right"><h3>${result['data'][0]['firstName']} ${result['data'][0]['lastName']}</h3></div>
        </div></div>

        <div class="row"><div class="col-12 col-lg-6">
        <div class="employeeInfo">Employee job information</div>
        <hr class="infoHr">
        ${jobTitle}
        <div class="personQuery"><span class="text-secondary infoSpan">Department</span><br>${result['data'][0]['department']}</div>
        <div class="personQuery"><span class="text-secondary infoSpan">Location</span><br>${result['data'][0]['location']}</div>
        </div>
        
        <div class="col-12 col-lg-6">
        <div class="employeeInfo">Contact</div>
        <hr class="infoHr">
        <div class="personQuery"><span class="text-secondary infoSpan">Email</span><br>${result['data'][0]['email']}</div>
        </div></div>
        <div class="row"><div class="col-12 d-flex justify-content-end">
        <button type="button" class="btn btn-sm btn-outline-primary" id="editProfileButton"><img src="libs/img/pencil.svg" class="extraDataImg" alt="Edit Personal Data" id="editProfileBottomButton"> Edit employee profile</button>
        </div></div>
        `)
        $("#editProfileButton").on("mouseenter mouseleave", () => {
          $("#editProfileBottomButton").toggleClass("whiteDataImg");
      });
        
//----------- Employee Data Card ----------- 
function showEmployee(id) {

/*
First Name
Last Name
Job Title
Email 
Department
Location
*/
}




        console.log(result);
       $('.records').html(results);
         
      }
    }, error: function (jqXHR, textStatus, errorThrown) {
        console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
      }
    });
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
    checkNewLocationQuery = 0
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
        console.log(checkDepName);
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
      console.log(insertLoc);
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
      console.log(insertDep);
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

        console.log(locResult);
        let locations='';
        let locNameLoop, locEdit;
        for(let a=0; a<locResult['data'].length; a++) {
          locEdit =`onClick="editLocation(${locResult['data'][a]['id']}, '${locResult['data'][a]['name']}')"`;
          locNameLoop =`onClick="deleteLocation(${locResult['data'][a]['id']}, ${a}, '${locResult['data'][a]['name']}')"`;
           locations +=`<li class="list-group-item d-flex justify-content-between align-items-center locContainter" id="trashNumber${a}">
           <div>${a+1}. ${locResult['data'][a]['name']} </div>
           <div class="d-flex align-items-center"><button type="button" class="btn btn-sm btn-outline-primary me-2 pencil-button pencil-button-locations"  data-bs-toggle="collapse" data-bs-target="#addLocation" ${locEdit}><img src="libs/img/pencil.svg" class="pencil" alt="Edit Location" id="locPencilImg${a}"></button>
            <button type="button" class="btn btn-sm btn-outline-danger trash-button trash-button-locations" data-bs-toggle="collapse" data-bs-target="#thisLocation${a}" id="thisLocTrash${a}" ${locNameLoop}><img src="libs/img/trash.svg" class="trashcan" alt="Delete Location" id="locTrashImg${a}"></button></div>
            <div id="thisLocation${a}" class="alert alert-warning confirmLocDelete collapse"></div> </li>`; 
        }
      
       $('#locations-list').html(locations);
       $(".pencil-button").on("mouseenter mouseleave", function() {
        $("img", this).toggleClass("whiteDataImg"); 
        }
      );
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

        console.log(depResult);
        let departments='';
        let depNameLoop, depEdit;
        for(let a=0; a<depResult['data'].length; a++) {
          depEdit =`onClick="editDepartment(${depResult['data'][a]['id']}, ${depResult['data'][a]['locationID']}, '${depResult['data'][a]['name']}')"`;
          depNameLoop =`onClick="deleteDepartment(${depResult['data'][a]['id']}, ${a})"`;
           departments +=`<li class="list-group-item d-flex justify-content-between align-items-center depContainter" id="trashNumber${a}">
           <div>${a+1}. ${depResult['data'][a]['name']} <br> 
           <span class="text-secondary font-weight-light department-location">${depResult['data'][a]['location']}</span></div>
           <div class="d-flex align-items-center"><button type="button" class="btn btn-sm btn-outline-primary me-2 pencil-button pencil-button-departments"  data-bs-toggle="collapse" data-bs-target="#addDepartment" ${depEdit}><img src="libs/img/pencil.svg" class="pencil" alt="Edit Department" id="depPencilImg${a}"></button>
            <button type="button" class="btn btn-sm btn-outline-danger trash-button trash-button-departments" data-bs-toggle="collapse" data-bs-target="#thisDepartment${a}" id="thisDepTrash${a}" ${depNameLoop}><img src="libs/img/trash.svg" class="trashcan" alt="Delete Department" id="depTrashImg${a}"></button></div>
            <div id="thisDepartment${a}" class="alert alert-warning confirmDepDelete collapse"></div> </li>`; 
        }
      
       $('#departments-list').html(departments);
       $(".pencil-button").on("mouseenter mouseleave", function() {
        $("img", this).toggleClass("whiteDataImg"); 
        }
      );
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
  $(`#thisLocation${number}`).html(`<div class="alertsLoc">
  <span>Please confirm deletion</span>
  <div class="d-flex justify-content-between align-items-center">
  <button type="button" class="btn btn-sm btn-secondary me-3" data-bs-toggle="collapse" data-bs-target="#thisLocation${number}" onClick="cancelLocationDeletion()">Cancel</button>
  <button type="button" class="btn btn-sm btn-success" onClick="deleteLocConf(${locationID}, ${number})">Confirm</button></div></div>`);
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
      $(`#thisDepartment${number}`).html(`<div class="alertsDep">
      <span>Please confirm deletion</span>
      <div class="d-flex justify-content-between align-items-center">
      <button type="button" class="btn btn-sm btn-secondary me-3" data-bs-toggle="collapse" data-bs-target="#thisDepartment${number}" onClick="cancelDepartmentDeletion()">Cancel</button>
      <button type="button" class="btn btn-sm btn-success" onClick="deleteDepConf(${departmentID}, ${number})">Confirm</button></div></div>`);
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