$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.search-results').html('');
		$('.inspiration-results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		//call the function & pass it the search tags as parameters
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit(function(event){
		//zero out results if previous search has run



		$('.search-results').html('');

		$('.inspiration-results').html('');

		$('.results').html('');

		//get the value of the tags the user submitted
		var searchTerm = $(this).find('input[name="answerers"]').val();
		//console log the user entered search tags just to be sure of input capture
		console.log(searchTerm);
		//call the function and pass it the search tags
		getTopAnswerers(searchTerm);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {

	// clone our result template code
	var result = $('.templates .question').clone();

	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a>' +
		'</p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to the DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

var showAnsResults = function(searchTerm) {
	return 'Top answerers for ' + searchTerm;
};

var showUser = function (userScore) {
	var result = $('.templates .user-score').clone();
	result.find('.user-avatar')
		.attr('src', userScore.user.profile_image)
		.after(userScore.user.display_name)
		.parent()
		.attr('href', userScore.user.link);
	result.find('.reputation')
		.text(userScore.user.reputation);
	result.find('.post-count')
		.text(userScore.post_count);
	result.find('.accept-rate')
		.text(userScore.user.accept_rate);

	return result;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {

	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'};

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
		.done(function(result){
			/*declare var to hold the info from the showSearchResults function
			 for readability*/
			var searchResults = showSearchResults(request.tagged, result.items.length);
			//show that info in the search-results DIV
			$('.search-results').html(searchResults);

			$.each(result.items, function(i, item) {
				var question = showQuestion(item);
				$('.search-results').append(question);
			});
		})
		.fail(function(jqXHR, error, errorThrown){
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
};

//this function finds the top answerers for the tag input by user
var getTopAnswerers = function(searchTerm) {
	//append searchTerm var to the url
	var url = 'http://api.stackexchange.com/2.2/tags/' + searchTerm + '/top-answerers/all_time'
	//parameters required to be passed to the StackOverflow API
	var ajax = { url: url,
		data: {site: 'stackoverflow'},
		dataType: 'jsonp',
		type: 'GET'};

	console.log(searchTerm);
	console.log(url);

	$.ajax(ajax)
		.done(function(result){
			var ansResults = showAnsResults(searchTerm);

			$('.inspiration-results').html(ansResults);
			//append each result to the DOM
			$.each(result.items, function(i, item) {
				var user = showUser(item);
				$('.inspiration-results').append(user);
			});
		})
		.fail(function(jqXHR, error, errorThrown){
			var errorElem = showError(error);
			$('.inspiration-results').append(errorElem);
		});
};
