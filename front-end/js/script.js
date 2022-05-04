/**
** Functional based progamming logic which has core implementation of BASE
**/

// Left side repos collapse-expand:
function RepoClick(elem) {
	
	$(elem).closest("li").find('.dropdown-menu').toggle();
	$(elem).closest("li").toggleClass("showf");
	$(elem).closest("li").siblings('li').find('ul').hide();
	$(elem).closest("li").siblings('li').removeClass("showf");
}


/**
** Function to get page name
**	params: url to use
**/
function getPageName(url) {
    var index = url.lastIndexOf("/") + 1;
    var filenameWithExtension = url.substr(index);
    var filename = filenameWithExtension.split(".")[0]; // <-- added this line
    return filename;                                    // <-- added this line
}


/**
** Function to get data
**	params: url to use
**	method: GET, POST, DELETE, PUT
**	callback: function to call on responnse
**/
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


/**
** Function to render index
**	data: data to pass
**/
function render_index(data){
	data = JSON.parse(data);
	//console.log(data);
	var i;
	if(data.length==0){
		$("#flash-index-success-fail").find("p").text("You have no repositories!");
		$( "#flash-index-success-fail" ).addClass( "animate--drop-in-fade-out" );
		setTimeout(function(){
			$( "#flash-index-success-fail" ).removeClass( "animate--drop-in-fade-out" ); // on timeout function to hide component
		}, 3500);
	}

	//render left-sidebar
	for (i = 0; i < data.length; ++i) {
		repo_id = '';
		repo_name = '';
		papers = [];
		$.each(data[i], function(name, val) {
			if (name == "_id") {
				repo_id = val;
				
			}
			if (name == "name") {
				repo_name = val;
			}

		});
		$(".sidebar-sticky ul.navbar-nav").append('\
		<li class="nav-item dropdown"' + "id=" + repo_id + '>\
			<a class="nav-link" href="#" onclick="RepoClick(this);">'+repo_name+'</a>\
			<ul class="dropdown-menu">\
				<li>\
					<div class="col-md-3">\
						<button class="btn add-paper"><img src="img/add-repo.svg"> Add Paper</button>\
					</div>\
				</li>');
		$('#ModalRepos').modal('hide'); // appending a layout tag

		// $("#" + repo_id +" ul.dropdown-menu").append('<li><a class="dropdown-item"  href="#">' + paper_name + '</a></li>');

	}
	for (i = 0; i < data.length; ++i) {
		repo_id = '';
		$.each(data[i], function(name, val) {
			if (name == "_id") {
				repo_id = val;
				
			}
			if (name == "name") {
				repo_name = val;
			}
			if(name=='papers'){
				papers_data = val;
				var i;
				for(i = 0; i < papers_data.length; ++i){
					paper_data = papers_data[i];
					//console.log(paper_data);
					$("#" + repo_id +" ul.dropdown-menu").append('<li><a href="#" class="dropdown-item" id=' + paper_data._id + '>' + paper_data.name + '</a></li>');
				}
			}

		});


		// $("#" + repo_id +" ul.dropdown-menu").append('<li><a class="dropdown-item"  href="#">' + paper_name + '</a></li>');

	}
	

}

 // on document ready function and getting values from the store

$( document ).ready(function() {
	var pageName = getPageName($(location).attr("href"));
	console.log(pageName);
    if(sessionStorage.getItem('username') && pageName=='index'){
    	console.log( "user logged in! and is in index page" );
		$('#index-username').text(sessionStorage.getItem('username'));
		

		// get values from backend from store
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

// Top bar buttons navigation to filter "keywords" and "methodology" section:
$('.m-section-main').hide();
$('.top-bar .btn').click(function () {
	$(".top-bar .btn").removeClass("active");
	$(this).addClass("active");

	$('.inner-content').hide();
	$('#rightcontent' + $(this).attr('target')).show();
});

// On hover keywords - highlights that columns in middle content
var keywordsList;
$(document).on({
    mouseenter: function () {
		var keywordText = $(this).find(".tag-text").text();

		keywordsList = $('.keywords-tree a.first:contains("'+keywordText+'")');
		$.each(keywordsList, function(){
			$(this).closest("li").addClass("k-active");
		});
    },
	// mouse event functions
    mouseleave: function () {
        $.each(keywordsList, function(){
			$(this).closest("li").removeClass("k-active");
		});
    }
}, "#form-tags-3_tagsinput .tag");


// On hover parameters - highlights that parameters section box in middle content
var parametersList;
$(document).on({
    mouseenter: function () {
		var parameterText = $(this).find(".tag-text").text();

		parametersList = $('.keywords-tree .parameters-list li:contains("'+parameterText+'")');
		$.each(parametersList, function(){
			$(this).closest(".tab-content").parent("a").css("background","blue");
		});
    },
    mouseleave: function () {
        $.each(parametersList, function(){
			$(this).closest(".tab-content").parent("a").removeAttr("style");
		}); // mouse event function to remove style
    }
}, "#form-tags-4_tagsinput .tag");

// For taginputs
$(function() {
  $('#form-tags-1').tagsInput();
  $('#form-tags-2').tagsInput();
  $('#form-tags-3').tagsInput();
  $('#form-tags-4').tagsInput();
  $('.zoom-form-tags').tagsInput();
  
});


/* 
 *jQuery Tags Input Revisited Plugin
 * 
 */

(function($) {
	var delimiter = [];
	var inputSettings = [];
	var callbacks = [];

	$.fn.addTag = function(value, options) {
		options = jQuery.extend({
			focus: false,
			callback: true
		}, options);
		
		this.each(function() {
			var id = $(this).attr('id');

			var tagslist = $(this).val().split(_getDelimiter(delimiter[id]));
			if (tagslist[0] === '') tagslist = [];

			value = jQuery.trim(value);
			// console.log(value);
			if ((inputSettings[id].unique && $(this).tagExist(value)) || !_validateTag(value, inputSettings[id], tagslist, delimiter[id])) {
				$('#' + id + '_tag').addClass('error');
				return false;
			}
			
			$('<span>', {class: 'tag'}).append(
				$('<span>', {class: 'tag-text'}).text(value),
				$('<button>', {class: 'tag-remove'}).click(function() {
					return $('#' + id).removeTag(encodeURI(value));
				})
			).insertAfter('#' + id + '_addTag');

			tagslist.push(value);


			$('#' + id + '_tag').val('');
			if (options.focus) {
				$('#' + id + '_tag').focus();
			} else {
				$('#' + id + '_tag').blur();
			}

			$.fn.tagsInput.updateTagsField(this, tagslist);

			if (options.callback && callbacks[id] && callbacks[id]['onAddTag']) {
				var f = callbacks[id]['onAddTag'];
				f.call(this, this, value);
			}
			
			if (callbacks[id] && callbacks[id]['onChange']) {
				var i = tagslist.length;
				var f = callbacks[id]['onChange'];
				f.call(this, this, value);
			}
		});

		return false;
	};

	$.fn.removeTag = function(value) {
		value = decodeURI(value);
		
		this.each(function() {
			var id = $(this).attr('id');

			var old = $(this).val().split(_getDelimiter(delimiter[id]));

			$('#' + id + '_tagsinput .tag').remove();
			
			var str = '';
			for (i = 0; i < old.length; ++i) {
				if (old[i] != value) {
					str = str + _getDelimiter(delimiter[id]) + old[i];
				}
			}

			$.fn.tagsInput.importTags(this, str);

			if (callbacks[id] && callbacks[id]['onRemoveTag']) {
				var f = callbacks[id]['onRemoveTag'];
				f.call(this, this, value);
			}
		});

		return false;
	};
// check for tags
	$.fn.tagExist = function(val) {
		var id = $(this).attr('id');
		var tagslist = $(this).val().split(_getDelimiter(delimiter[id]));
		return (jQuery.inArray(val, tagslist) >= 0);
	};
// importing tags
	$.fn.importTags = function(str) {
		var id = $(this).attr('id');
		$('#' + id + '_tagsinput .tag').remove();
		$.fn.tagsInput.importTags(this, str);
	};

// passing input to tags
	$.fn.tagsInput = function(options) {
		var settings = jQuery.extend({
			interactive: true,
			placeholder: 'Type to add new keyword',
			minChars: 0,
			maxChars: null,
			limit: null,
			validationPattern: null,
			width: 'auto',
			height: 'auto',
			autocomplete: null,
			hide: true,
			delimiter: ',',
			unique: true,
			removeWithBackspace: true
		}, options);

		var uniqueIdCounter = 0;
// validating tags
		this.each(function() {
			if (typeof $(this).data('tagsinput-init') !== 'undefined') return;

			$(this).data('tagsinput-init', true);

			if (settings.hide) $(this).hide();
			
			var id = $(this).attr('id');
			if (!id || _getDelimiter(delimiter[$(this).attr('id')])) {
				id = $(this).attr('id', 'tags' + new Date().getTime() + (++uniqueIdCounter)).attr('id');
			}

			var data = jQuery.extend({
				pid: id,
				real_input: '#' + id,
				holder: '#' + id + '_tagsinput',
				input_wrapper: '#' + id + '_addTag',
				fake_input: '#' + id + '_tag'
			}, settings);
			// console.log("data");
			// console.log(data);
			// console.log("data");
			delimiter[id] = data.delimiter;
			inputSettings[id] = {
				minChars: settings.minChars,
				maxChars: settings.maxChars,
				limit: settings.limit,
				validationPattern: settings.validationPattern,
				unique: settings.unique
			};

			if (settings.onAddTag || settings.onRemoveTag || settings.onChange) {
				callbacks[id] = [];
				callbacks[id]['onAddTag'] = settings.onAddTag;
				callbacks[id]['onRemoveTag'] = settings.onRemoveTag;
				callbacks[id]['onChange'] = settings.onChange;
			}

			var markup = $('<div>', {id: id + '_tagsinput', class: 'tagsinput'}).append(
				$('<div>', {id: id + '_addTag'}).append(
					settings.interactive ? $('<input>', {onclick: 'setInputFocus(this);', id: id + '_tag', class: 'tag-input', value: '', placeholder: settings.placeholder}) : null
				)
			);

			$(markup).insertAfter(this);

			$(data.holder).css('width', settings.width);
			$(data.holder).css('min-height', settings.height);
			$(data.holder).css('height', settings.height);

			if ($(data.real_input).val() !== '') {
				$.fn.tagsInput.importTags($(data.real_input), $(data.real_input).val());
			}
			
			// Stop here if interactive option is not chosen
			if (!settings.interactive) return;
			
			$(data.fake_input).val('');
			$(data.fake_input).data('pasted', false);
			
			$(data.fake_input).on('focus', data, function(event) {
				$(data.holder).addClass('focus');
				
				if ($(this).val() === '') {
					$(this).removeClass('error');
				}
			});
			
			$(data.fake_input).on('blur', data, function(event) {
				$(data.holder).removeClass('focus');
			});

			if (settings.autocomplete !== null && jQuery.ui.autocomplete !== undefined) {
				$(data.fake_input).autocomplete(settings.autocomplete);
				$(data.fake_input).on('autocompleteselect', data, function(event, ui) {
					$(event.data.real_input).addTag(ui.item.value, {
						focus: true,
						unique: settings.unique
					});
					
					return false;
				});
				
				$(data.fake_input).on('keypress', data, function(event) {
					if (_checkDelimiter(event)) {
						$(this).autocomplete("close");
					}
				});
			} else {
				$(data.fake_input).on('blur', data, function(event) {
					$(event.data.real_input).addTag($(event.data.fake_input).val(), {
						focus: true,
						unique: settings.unique
					});
					
					return false;
				});
			}
			
			// If a user types a delimiter create a new tag
			$(data.fake_input).on('keypress', data, function(event) {
				if (_checkDelimiter(event)) {
					event.preventDefault();
					
					$(event.data.real_input).addTag($(event.data.fake_input).val(), {
						focus: true,
						unique: settings.unique
					});
					
					return false;
				}
			});
			
			$(data.fake_input).on('paste', function () {
				$(this).data('pasted', true);
			});
			
			// If a user pastes the text check if it shouldn't be splitted into tags
			$(data.fake_input).on('input', data, function(event) {
				if (!$(this).data('pasted')) return;
				
				$(this).data('pasted', false);
				
				var value = $(event.data.fake_input).val();
				
				value = value.replace(/\n/g, '');
				value = value.replace(/\s/g, '');
				
				var tags = _splitIntoTags(event.data.delimiter, value);
				
				if (tags.length > 1) {
					for (var i = 0; i < tags.length; ++i) {
						$(event.data.real_input).addTag(tags[i], {
							focus: true,
							unique: settings.unique
						});
					}
					
					return false;
				}
			});
			
			// Deletes last tag on backspace
			data.removeWithBackspace && $(data.fake_input).on('keydown', function(event) {
				if (event.keyCode == 8 && $(this).val() === '') {
					 event.preventDefault();
					 var lastTag = $(this).closest('.tagsinput').find('.tag:last > span').text();
					 var id = $(this).attr('id').replace(/_tag$/, '');
					 $('#' + id).removeTag(encodeURI(lastTag));
					 $(this).trigger('focus');
				}
			});

			// Removes the error class when user changes the value of the fake input
			$(data.fake_input).keydown(function(event) {
				// enter, alt, shift, esc, ctrl and arrows keys are ignored
				if (jQuery.inArray(event.keyCode, [13, 37, 38, 39, 40, 27, 16, 17, 18, 225]) === -1) {
					$(this).removeClass('error');
				}
			});
		});

		return this;
	};
// updating tags
	$.fn.tagsInput.updateTagsField = function(obj, tagslist) {
		var id = $(obj).attr('id');
		$(obj).val(tagslist.join(_getDelimiter(delimiter[id])));
	};

//importing tags
	$.fn.tagsInput.importTags = function(obj, val) {
		$(obj).val('');
		
		
		var id = $(obj).attr('id');


		var tags = _splitIntoTags(delimiter[id], val); 
	
		for (i = 0; i < tags.length; ++i) {
			$(obj).addTag(tags[i], {
				focus: false,
				callback: false
			});
		}
		
		if (callbacks[id] && callbacks[id]['onChange']) {
			var f = callbacks[id]['onChange'];
			f.call(obj, obj, tags);
		}
	};
	
// delimiter parsing
	var _getDelimiter = function(delimiter) {
		if (typeof delimiter === 'undefined') {
			return delimiter;
		} else if (typeof delimiter === 'string') {
			return delimiter;
		} else {
			return delimiter[0];
		}
	};

// validating tag
	var _validateTag = function(value, inputSettings, tagslist, delimiter) {
		var result = true;
		
		if (value === '') result = false;
		if (value.length < inputSettings.minChars) result = false;
		if (inputSettings.maxChars !== null && value.length > inputSettings.maxChars) result = false;
		if (inputSettings.limit !== null && tagslist.length >= inputSettings.limit) result = false;
		if (inputSettings.validationPattern !== null && !inputSettings.validationPattern.test(value)) result = false;
		
		if (typeof delimiter === 'string') {
			if (value.indexOf(delimiter) > -1) result = false;
		} else {
			$.each(delimiter, function(index, _delimiter) {
				if (value.indexOf(_delimiter) > -1) result = false;
				return false;
			});
		}
		
		return result;
	};
 
// check delimiter value
	var _checkDelimiter = function(event) {
		var found = false;
		
		if (event.which === 13) {
			return true;
		}

		if (typeof event.data.delimiter === 'string') {
			if (event.which === event.data.delimiter.charCodeAt(0)) {
				found = true;
			}
		} else {
			$.each(event.data.delimiter, function(index, delimiter) {
				if (event.which === delimiter.charCodeAt(0)) {
					found = true;
				}
			});
		}
		
		return found;
	 };

	// split the value into tags using delimiter
	 var _splitIntoTags = function(delimiter, value) {
		 if (value === '') return [];
		 
		 if (typeof delimiter === 'string') {
			 return value.split(delimiter);
		 } else {
			 var tmpDelimiter = '∞';
			 var text = value;
			 
			 $.each(delimiter, function(index, _delimiter) {
				 text = text.split(_delimiter).join(tmpDelimiter);
			 });
			 
			 return text.split(tmpDelimiter);
		 }
		 
		 return [];
	 };

	
	 
// handle click function of different components	 

	 $( "#forgot-link" ).click(function() {
		$( "#flash-forgot-password" ).addClass( "animate--drop-in-fade-out" );
		setTimeout(function(){
		  $( "#flash-forgot-password" ).removeClass( "animate--drop-in-fade-out" );
		}, 3500);

		
	  });
	 
// handle click function of signup link component	 
	
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
	 
// handle click function of login  component
	
	$( "#login-link" ).click(function() {
		login('https://localhost:3443/users/login','POST',load_index);
	});
	
	function load_index(result){
		window.location = "index.html";
	}

	
/**
** This function handles login functionality
**	params:
**	url: url
**	method: method
**	callback: callback
**/

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

	
/**
** Function to handle signout functionality
**	params:
**	url: url
**	method: method
**	callback: callback
**/
	
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
	


/** function to get message
**	params:
**	response: Response
**	success: message
**/

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

/** function to upload repo
**	params:
**	url: URL
**	method: GET, POST, DELETE
**	repo name
**	callback function
**/	
function upload_repo(url,method,repo_name,callback){
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
		dataType: 'json',
		data: JSON.stringify({"name": repo_name}),
		success: function(response){
			$("#flash-index-success-fail").find("p").text("repository " + response.name +  " successfully added");
			//console.log($("#flash-index-success-fail").find("p").text());
			
			$( "#flash-index-success-fail" ).addClass( "animate--drop-in-fade-out" );
			setTimeout(function(){
				$( "#flash-index-success-fail" ).removeClass( "animate--drop-in-fade-out" );
			}, 3500);

			//add repo to sidebar
			
			if(!sessionStorage.getItem('repositories')){
				sessionStorage.setItem('repositories',JSON.stringify(response));
			}
			else{
				var repos_data = sessionStorage.getItem("repositories");
				repos_data = JSON.parse(repos_data);
				repos_data.push(response);
				sessionStorage.setItem('repositories',JSON.stringify(repos_data));
			}
			
			

	  		repos_data = JSON.parse(sessionStorage.getItem('repositories'));
			last_added_repo = repos_data[repos_data.length - 1];
			
			


			$(".sidebar-sticky ul.navbar-nav").append('\
			<li class="nav-item dropdown"' + "id=" + last_added_repo._id + '>\
			<a class="nav-link" href="#" onclick="RepoClick(this);">'+last_added_repo.name+'</a>\
			<ul class="dropdown-menu">\
				<li>\
					<div class="col-md-3">\
						<button class="btn add-paper"><img src="img/add-repo.svg"> Add Paper</button>\
					</div>\
				</li>');
			$('#ModalRepos').modal('hide');
			

		},
		error: function(xhr,response,error){
			$("#flash-index-success-fail").find("p").text("Error adding repository " + repo_name);

			//console.log($("#flash-index-success-fail").find("p").text());
			$( "#flash-index-success-fail" ).addClass( "animate--drop-in-fade-out" );
			setTimeout(function(){
				$( "#flash-index-success-fail" ).removeClass( "animate--drop-in-fade-out" );
			}, 3500);
		}
	});

}

/**
**Function to get repository name
**/
function RepoName() {
	var repo_name  = prompt("Please Enter Repository Name", "");
	
	if (repo_name != null) {
	  upload_repo('https://localhost:3443/repositories','POST',repo_name)
	  
	}
}

// $("#dropzone input").change(function(){
// 	RepoName();
// });

	
// handling click function of add repo button
$( ".add-repo" ).click(function() {
	RepoName();
});

/**
**This function handles uploading research paper to BASE
** params:
**	url: URL
**	method: GET, POST, DELETE, PUT
** 	repo_id: directory id
**	paper_name: research paper name
**/
function upload_paper(url,method,repo_id,paper_name,callback){
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
		dataType: 'json',
		data: JSON.stringify({"name": paper_name}),
		success: function(response){
			$("#flash-index-success-fail").find("p").text("Paper " + paper_name +  " successfully added");
			//console.log($("#flash-index-success-fail").find("p").text());
			
			$( "#flash-index-success-fail" ).addClass( "animate--drop-in-fade-out" );
			setTimeout(function(){
				$( "#flash-index-success-fail" ).removeClass( "animate--drop-in-fade-out" );
			}, 3500);

		

			repos_data = JSON.parse(sessionStorage.getItem('repositories'));
			//console.log(repos_data);

			
			for (i = 0; i < repos_data.length; ++i) {
				
				repo_data = repos_data[i];
				if(repo_data._id == repo_id){
					
					papers_data = repo_data.papers;
					
					papers_data.push(response);
					
					repo_data.papers = papers_data; 
					
				}
				repos_data[i] = repo_data;

			}
			
			sessionStorage.setItem('repositories',JSON.stringify(repos_data)); // saving the value in the store
			

			
			$("#" + repo_id +" ul.dropdown-menu").append('<li><a href="#" class="dropdown-item" id=' + response._id + '>' + paper_name + '</a></li>');
		},
		error: function(xhr,response,error){
			$("#flash-index-success-fail").find("p").text("Error adding Paper " + paper_name);

			//console.log($("#flash-index-success-fail").find("p").text());
			$( "#flash-index-success-fail" ).addClass( "animate--drop-in-fade-out" );
			setTimeout(function(){
				$( "#flash-index-success-fail" ).removeClass( "animate--drop-in-fade-out" );
			}, 3500);
		}
	});
}

/**
**Handles uploading paper to a repo based on repo id
**/
function PaperName(repo_id) {
	var paper_name  = prompt("Please Enter Paper Name", "");
	
	if (paper_name != null) {
	  upload_paper('https://localhost:3443/repositories/'+repo_id + '/papers','POST',repo_id,paper_name)
	  
	}
}

// handling add paper action
$(document).on('click', ".add-paper", function() {
	var repo_id = $(this).closest('.dropdown').attr('id');
	//console.log(repo_id);
	PaperName(repo_id);     
});


//render center content
function render_center(repo_id,paper_id) {
	//get paper data from session storage
	var repos_data = JSON.parse(sessionStorage.getItem('repositories'));
	var papers_data;
	for (i = 0; i < repos_data.length; ++i) {		
		repo_data = repos_data[i];
		if(repo_data._id == repo_id){
			papers_data = repo_data.papers;	
		}	
	}
	
	var paper_data;
	for (i = 0; i < papers_data.length; ++i) {		
		if(papers_data[i]._id == paper_id){
			paper_data = papers_data[i];	
		}	
	}
	//set title
	console.log(paper_data);
	$(".main .title-main").text(paper_data.name);

	//set keywords 
	keywords = paper_data.keywords;
	console.log(keywords);

	$('#form-tags-1').addTag('foo');
}

// handling the dropdown component
$(document).on('click', ".dropdown-item", function() {
	var repo_id  = $(this).closest('.dropdown').attr('id');
	var paper_id = $(this).attr('id');
	render_center(repo_id,paper_id); 
});

function traverse(entry, path) {
  path = path || "";
  if (entry.isFile) {
    // Get file
    entry.file(function(file) {
      console.log("File:", path + file.name);
	});
  } else if (entry.isDirectory) {
    // Get folder contents
    var dirReader = entry.createReader();
    dirReader.readEntries(function(entries) {
      for (var i = 0; i < entries.length; i++) {
        traverse(entries[i], path + entry.name + "/");
      }
	});
  }
}

})(jQuery);


//Methodology taginput for right section
function Methodsearch(ele) {
    if(event.key === 'Enter') {
		Ontype = ele.value;
		$(".typeInput").val("");   
		$("#Met-container").append('<div class="methodology-HEM-box"><h5>'+Ontype+'</h5></div>');     
    }
}


//Methodology taginput for middle bottom section
function Methodologysearch(ele) {
    if(event.key === 'Enter') {
		Onmtype = ele.value;
		$(".typeInput").val("");   
		$("#Methodologysearch-c").append('<h5>'+Onmtype+'</h5>');     
    }
}

//Parameteres with values taginput for middle section
$(document).ready(function() {
	$('.para-addbtn').click(function() {
		paraName = $("#para-add").val();
		paraval = $("#value-add").val();

		$("#para-add, #value-add").val("");
		$(".Para-addList").append('<li>'+paraName+' <span class="num">'+paraval+'</span></li>');     
	});
	
	
});

// function to handle focus action
function setInputFocus(elem){
	$(elem).focus();
}

