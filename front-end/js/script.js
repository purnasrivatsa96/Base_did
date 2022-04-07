


function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split(".")[0]; // <-- added this line
    return filename;                                    // <-- added this line
}



function get_data(url,method,callback){
	var accessToken = sessionStorage.getItem('token');
	console.log(accessToken);
	var authHeaders = {};
	if (accessToken) {
		authHeaders.Authorization = 'Bearer ' + accessToken;
	}
	$.ajax({
		url: url, 
		type: method, 
		headers: authHeaders,
		contentType: 'application/json', 
		success: function(response){
			//add repo to sidebar
			sessionStorage.setItem('repositories',JSON.stringify(response));
			callback(sessionStorage.getItem('repositories'));
		},
		error: function(xhr,response,error){
			if (xhr.responseText != "") {
				ParsedElements = $(xhr.responseText);
				console.log(ParsedElements);
				var message = '';
				message = $(ParsedElements).filter('h1').text();
				$("#flash-index-success-fail").find("p").text(message);
				$( "#flash-index-success-fail" ).addClass( "animate--drop-in-fade-out" );
				setTimeout(function(){
					$( "#flash-index-success-fail" ).removeClass( "animate--drop-in-fade-out" );
				}, 3500);
			}
		}
	});

}




$( document ).ready(function() {
	var pageName = getPageName($(location).attr("href"));
	console.log(pageName);
    if(sessionStorage.getItem('username') && pageName=='index'){
    	console.log( "user logged in! and is in index page" );
		$('#index-username').text(sessionStorage.getItem('username'));
		

		// get values from backend
		if(!sessionStorage.getItem('repositories')){
			//console.log("aaa");
			get_data("https://localhost:3443/repositories","GET",render_index);

		}
		//render index page with values
		else{
			//console.log("bbb");
			render_index(sessionStorage.getItem('repositories'));
		}
	}
	else if( sessionStorage.getItem('username') && pageName=='details' ){
		console.log( "user logged in! and is in details page" );
	}
	else if (  sessionStorage.getItem('username') && pageName=='login'  ){
		console.log( "user logged in! and is in login page" );
	}
	else {
		console.log( "user not logged in! and is in login page" );
	}
	
  });





// On hover parameters - highlights that parameters section box in middle content
var parametersList;



/* jQuery Tags Input Revisited Plugin
 *
 * Copyright (c) Krzysztof Rusnarczyk
 * Licensed under the MIT license */

(function($) {
	

	 $( "#forgot-link" ).click(function() {
		$( "#flash-forgot-password" ).addClass( "animate--drop-in-fade-out" );
		setTimeout(function(){
		  $( "#flash-forgot-password" ).removeClass( "animate--drop-in-fade-out" );
		}, 3500);

		
	  });

	  $( "#signup-link" ).click(function() {
		if($('#signup-password').val() != $('#signup-confirm-password').val()){

			$( "#flash-password-mismatch" ).addClass( "animate--drop-in-fade-out" );
			setTimeout(function(){
			$( "#flash-password-mismatch" ).removeClass( "animate--drop-in-fade-out" );
			}, 3500);

		}
		else{

			$.ajax({
				url: 'https://localhost:3443/users/signup', 
				type: 'POST', 
				contentType: 'application/json', 
				dataType: 'json',
				data: JSON.stringify({"username": $('#signup-email').val(),"password":$('#signup-password').val()}),
				success: function(response){
					//console.log(response);
					$("#flash-signup-result").find("p").text(response.status);
					alert(response.status);
					$( "#flash-signup-result" ).addClass( "animate--drop-in-fade-out" );
					setTimeout(function(){
						$( "#flash-signup-result" ).removeClass( "animate--drop-in-fade-out" );
					}, 3500);
				},
				error: function(xhr,response,error){

					if (xhr.responseText != "") {

						var jsonResponseText = $.parseJSON(xhr.responseText);
						var jsonResponseStatus = '';
						var message = '';
						$.each(jsonResponseText, function(name, val) {
							if (name == "err") {
								jsonResponseStatus = $.parseJSON(JSON.stringify(val));
								//console.log(jsonResponseStatus);
								 $.each(jsonResponseStatus, function(name2, val2) {
									 if (name2 == "message") {
										//console.log(val2);
										 message = val2;
									 }
								 });
							}
						});
			
						$("#flash-signup-result").find("p").text(message);
						$( "#flash-signup-result" ).addClass( "animate--drop-in-fade-out" );
						setTimeout(function(){
							$( "#flash-signup-result" ).removeClass( "animate--drop-in-fade-out" );
						}, 3500);
					}
	
				}
			});
		}
	
	});

	$( "#login-link" ).click(function() {
		login('https://localhost:3443/users/login','POST',load_index);
	});


	
	
	function login(url,method,callback){
			$.ajax({
				url: url, 
				type: method, 
				contentType: 'application/json', 
				dataType: 'json',
				data: JSON.stringify({"username": $('#login-email').val(),"password":$('#login-password').val()}),
				success: function(response){
					
	
					sessionStorage.setItem('username', response.user.username);
					sessionStorage.setItem('token', response.token);
					sessionStorage.setItem('_id', response._id);
					//console.log(response.token);
					//console.log(response.user.username);
					// location.href = "index.html";
					callback(response);
					
					
					
				},
				error: function(xhr,response,error){
					if (xhr.responseText != "") {
	
						var jsonResponseText = $.parseJSON(xhr.responseText);
						var jsonResponseStatus = '';
						var message = '';
						$.each(jsonResponseText, function(name, val) {
							if (name == "err") {
								jsonResponseStatus = $.parseJSON(JSON.stringify(val));
								//console.log(jsonResponseStatus);
								 $.each(jsonResponseStatus, function(name2, val2) {
									 if (name2 == "message") {
										//console.log(val2);
										 message = val2;
									 }
								 });
							}
						});
			
						$("#flash-signup-result").find("p").text(message);
						$( "#flash-signup-result" ).addClass( "animate--drop-in-fade-out" );
						setTimeout(function(){
							$( "#flash-signup-result" ).removeClass( "animate--drop-in-fade-out" );
						}, 3500);
					}
				}
				
			});


	}


	$( ".signout" ).click(function() {
		signout('https://localhost:3443/users/logout','GET',load_login);
	});
	
	function load_login(result){
		window.location = "login.html";
	}

	
	
	function signout(url,method,callback){
			$.ajax({
				url: url, 
				type: method, 
				contentType: 'application/json', 
				success: function(response){
					sessionStorage.clear();
					// location.href = "index.html";
					callback(response);
					
				},
				error: function(xhr,response,error){
					if (xhr.responseText != "") {
	
						var jsonResponseText = $.parseJSON(xhr.responseText);
						var jsonResponseStatus = '';
						var message = '';
						$.each(jsonResponseText, function(name, val) {
							if (name == "err") {
								jsonResponseStatus = $.parseJSON(JSON.stringify(val));
								//console.log(jsonResponseStatus);
								 $.each(jsonResponseStatus, function(name2, val2) {
									 if (name2 == "message") {
										//console.log(val2);
										 message = val2;
									 }
								 });
							}
						});
			
						$("#flash-signup-result").find("p").text(message);
						$( "#flash-signup-result" ).addClass( "animate--drop-in-fade-out" );
						setTimeout(function(){
							$( "#flash-signup-result" ).removeClass( "animate--drop-in-fade-out" );
						}, 3500);
					}
				}
				
			});


	}
	




function flash_message(response,success){
	if(success==true){
		console.log(response.status);
		$("#flash-index-success-fail").find("p").text(response);
		//console.log($("#flash-index-success-fail").find("p").text());
		$( "#flash-index-success-fail" ).addClass( "animate--drop-in-fade-out" );
		setTimeout(function(){
			$( "#flash-index-success-fail" ).removeClass( "animate--drop-in-fade-out" );
		}, 3500);
	}
	else{
		xhr = response;
		if (xhr.responseText != "") {

			var jsonResponseText = $.parseJSON(xhr.responseText);
			var jsonResponseStatus = '';
			var message = '';
			$.each(jsonResponseText, function(name, val) {
				if (name == "err") {
					jsonResponseStatus = $.parseJSON(JSON.stringify(val));
					//console.log(jsonResponseStatus);
						$.each(jsonResponseStatus, function(name2, val2) {
							if (name2 == "message") {
							//console.log(val2);
								message = val2;
							}
						});
				}
			});

			$("#flash-index-success-fail").find("p").text(message);
			$( "#flash-index-success-fail" ).addClass( "animate--drop-in-fade-out" );
			setTimeout(function(){
				$( "#flash-index-success-fail" ).removeClass( "animate--drop-in-fade-out" );
			}, 3500);
		}
	}
}


})(jQuery);



function setInputFocus(elem){
	$(elem).focus();
}

