$(document).ready(function(){
	$("#ngo").click(function(){
		$.ajax({
			url : "/place/list",
			success : function(data){
				$("#ngoform").toggle();
				hideDivs( [ "#signUpForm", "#loginForm", "#supplyForm", "#placeform" ] );
				$("#places").html("");
				for(i = 0;i < data.length;i++){
					$("#places").append("<option value='"+ data[i].id+"'>" + data[i].address + "</option>");
				}
			}
		});
	});

	$("#submitNGO").click(function(){
	    var json = {};
	    json.placeId = $("#places").val();
	    json.ngoName = $("#ngoName").val();

	    $.ajax({
	        type : 'POST',
	        data :  JSON.stringify(json),
	        contentType: "application/json",
            url : "/hub/add",
            success : function(data){
                console.log("Added");
            }
        });
	});

	$("#signup").click(function(){
	    $("#signUpForm").toggle();
	    hideDivs( [ "#ngoform", "#loginForm", "#supplyForm", "#placeform" ] );
	});

	$("#login").click(function(){
        $("#loginForm").toggle();
        hideDivs( [ "#ngoform", "#signUpForm", "#supplyForm", "#placeform" ] );

    });

	$("#supply").click(function(){
	    $("#supplyForm").toggle();
	    hideDivs( [ "#ngoform", "#loginForm", "#signUpForm", "#placeform" ] );
	});

	$("#Item").click(function(){
	    var index = $("#items").children().length + 1;
	    $("#items").append("<input type='text' id='item_"+ index +"' placeholder='Food/Bedsheets/Medicene'>"
    	+"<input type='text' id='item_count_"+ index +"' placeholder='Number of items'><br>");
	})

	$("#submitSuplpy").click(function(){
	    var data = {};
	    data.name = $("#supplyName").val();
	    data.address = $("#supplyaddress").val();
	    data.numberOfPeople = $("#peopleCount").val();
	    data.phoneNumber = $("#phoneNumber").val();
	    var res = {};
	    var items = $("#items").children();
	    for(i = 0;i < items.length;i++){
	        if($("#item_" + (i + 1)).val() != undefined)
	            res[$("#item_" + (i + 1)).val()] = $("#item_count_" + (i + 1)).val();
	    }
	    data.resourceDetails = res;

	    $.ajax({
	        type : 'POST',
            data :  JSON.stringify(data),
            contentType: "application/json",
            url : "/supply/",
            success : function(data){
                console.log("Added");
            }
	    });
	});

	$("#submitVolunteer").click(function(){
	    var data = {};
	    data.username = $("#username").val();
	    data.password = $("#password").val();
	    data.location = $("#location").val();
	    data.phoneNumber = $("#phoneNo").val();
	    data.age = $("#age").val();

	    $.ajax({
            type : 'POST',
            data :  JSON.stringify(data),
            contentType: "application/json",
            url : "/addVolunteer",
            success : function(data){
                console.log("Added");
                $.ajax({
                    type : "GET",
                    url : "volunteerdetails?username="+data.username,
                    success : function(data){
                        displayVolunteer( data );
                    }
                });
            }
        });
	});

	$("#submitLogin").click(function(){
	    var data = {};
	    data.username = $("#username_login").val();
	    data.password = $("#password_login").val();

	    $.ajax({
            type : 'POST',
            data :  JSON.stringify(data),
            contentType: "application/json",
            url : "/login",
            success : function(data){
                $.ajax({
                    type : "GET",
                    url : "volunteerdetails?username="+data.username,
                    success : function(data){
                        displayVolunteer( data );
                    }
                });
            }
        });
	});

    var cookieArr = document.cookie.split(";");
    var isLoggedIn = false;
    for( var i =0; i < cookieArr.length; ++i ){
        var key = cookieArr[i].split("=");
        if( key[0].trim() == "username" ){
            isLoggedIn = true;
            break;
        }
    }

	if( isLoggedIn ){
    	    $.ajax({
                type : "GET",
                url : "volunteerdetails?username="+key[1],
                success : function(data){
                    displayVolunteer( data );
                }
            });
    	}

	$("#getHubDetails").click(function(){
	    $('#records_table').toggle();
	    $('#records_table').empty();
        $.ajax({
            type : 'GET',
            dataType: 'json',
            url : "/hub/",
            success : function(response){
                var trHTML = '';
                trHTML += '<tr><td>' + "Address" + '</td><td>' + "Owner name" + '</td><td>' + "Owner Contact" + '</td></tr>';
                $.each(response, function (i, item) {
                    trHTML += '<tr><td>' + item.address + '</td><td>' + item.ownername + '</td><td>' + item.ownercontact + '</td></tr>';
                });
                $('#records_table').append(trHTML);
                console.log( response );
            }
        });
	});
});


function togglePlaceForm(){
    $("#placeform").toggle();
    hideDivs( [ "#ngoform", "#loginForm", "#supplyForm", "#signUpForm" ] );
}

function addPlace(){
    var address =  $("#place_address").val();
    var name =  $("#owner_name").val();
    var phone_num = $("#owner_phone_num").val();
    var d = {};
    d.ownername = name;
    d.ownercontact = phone_num;
    d.address = address;
    $.ajax({
        type : "POST",
        url : "/place/add",
        data : JSON.stringify(d),
        contentType : "application/json",
        success : function(r,d){
            console.log(r);
            console.log(d);
        }
    });
}

function hideDivs(divIds){
    for( var i = 0; i < divIds.length; ++i ){
        $( divIds[ i ] ).css("display","none");
    }
}

function displayVolunteer(volunteer){
    $("#dashboard").hide();
    $("#current_assignment").html(volunteer);
    $("#volunteer").val(volunteer.username)
    $("#volunteertab").show();
}