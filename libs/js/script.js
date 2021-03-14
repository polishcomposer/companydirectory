let oldDepartmentName = '';
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
           results +=`<a class="list-group-item list-group-item-action record" id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="home">
            <div class="d-flex w-100">
      <h5 class="mb-1 text-white bg-${circleColors[randomColor]} round">${result['data'][a]['firstName'][0]}${result['data'][a]['lastName'][0]}</h5>
            <div class="record-right">
      ${result['data'][a]['firstName']} ${result['data'][a]['lastName']}<br>
      <span class="text-secondary font-weight-light">${result['data'][a]['email']}</span>
      </div>
    </div>
            </a>`;
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
        }
      );
      $("#imgB1").on("click", () => {

        getDepartments();
        $('#records-card-list').addClass("overflow-hidden");
        $('#records-card-list').removeClass("overflow-auto");
    }
  );
  $('.showRecords').on("click", () => {
    $('#records-card-list').removeClass("overflow-hidden");
    $('#records-card-list').addClass("overflow-auto");
}
);
     
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
   $('.closeDepartmentModal').on('click', function() {
     if(checkNewDepartmentQuery!=0) {
    $("#cancelNewDepartment").trigger("click");
    checkNewDepartmentQuery = 0;
  }
   });
   $('#cancelNewDepartment').on('click', () => {
    checkNewDepartmentQuery = 0
     $('#departmentForm').trigger("reset");
     $('#departmentForm').removeClass("was-validated");
     $("#newDepartment").attr('disabled', false);
     $(".pencil-button-departments").attr('disabled', false);
     $(".trash-button-departments").attr('disabled', false);
   });
   $("#newDepartment").on("click", () => {
    checkNewDepartmentQuery = 1;
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
  let checkDepName = 0;
  let checkDepLocal = 0;
  let newDepName, newDepLocation;
  $("#departmentName").on("keyup change", function() {
    if($(this).val().length>0 && $(this).val().length<3) {
      $('#depNameValidation').html('Must have 3 letters minimum.');
      checkDepName = 0;
    } else {
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
      if(checkDepName!=0) {
        console.log(checkDepName);
        $( "#createDepButton" ).attr( "data-bs-toggle", "modal" );
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

//----------- Create Department -----------
$('#createDepartment').on('click', function() {
  oldDepartmentName = newDepName;
  $('#createDepButton').attr('disabled', true);
    $.ajax({
      url: "libs/php/insertDepartment.php",
      type: 'POST',
      dataType: 'json',
      data: {
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
          $('#newDepartmentSuccess').html(`<div class="alert alert-success" role="alert" id="successDep">
          <h4 class="alert-heading">Success!</h4><p>The department has been created.</p></div>`);
         setTimeout(function() {
          $('#successDep').fadeOut('normal');
          getDepartments();
        }, 1500);

        }}, error: function (jqXHR, textStatus, errorThrown) {
          console.log((jqXHR + '<br/>' + textStatus + '<br/>' + errorThrown));
        }
      });

});
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
        let depNameLoop;
        for(let a=0; a<depResult['data'].length; a++) {
          depNameLoop =`onClick="deleteDepartment(${depResult['data'][a]['id']}, ${a}, '${depResult['data'][a]['name']}')"`;
           departments +=`<li class="list-group-item d-flex justify-content-between align-items-center depContainter" id="trashNumber${a}">
           <div>${a+1}. ${depResult['data'][a]['name']} <br> 
           <span class="text-secondary font-weight-light department-location">${depResult['data'][a]['location']}</span></div>
           <div class="d-flex align-items-center"><button type="button" class="btn btn-sm btn-outline-primary me-2 pencil-button pencil-button-departments"  data-bs-toggle="modal" data-bs-target="#modalConfirmEditDep"><img src="libs/img/pencil.svg" class="pencil" alt="Edit Department" id="depPencilImg${a}"></button>
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
//----------- Delete Department ----------- 
    function deleteDepartment(departmentID, number, name) {
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