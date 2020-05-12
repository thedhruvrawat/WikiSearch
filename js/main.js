window.onload = function() {
    document.getElementById("wiki-search-input").focus();
};

function ajax (keyword) { //AJAX request
	$.ajax({ 
		url: "//en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + keyword + "&prop=info&inprop=url&utf8=&format=json",
		dataType: "jsonp",
		success: function(response) {
			// console.log(response.query);
			if (response.query.searchinfo.totalhits === 0) {
				showError(keyword);
			}

			else {
				showResults(response);
			}
		},
		error: function () {
			swal("Error retrieving search results, please refresh the page");
		}
	});
}

function showResults (callback) {

	for (var i = 0; i <= 9; i++) {
		// $(".display-results").append("<div class='card mb-3 result-list result-" + i + "' style='max-width: 540px;'>" + "<span class='card-img-top img-" + i + "'></span>" + "<span class='result-title title-" + i + "'></span>" + "<br>" +"<span class='result-snippet snippet-" + i + "'></span>" + "<br>" + "<span class='result-metadata metadata-" + i + "'></span>" + "</div>" );

		$(".display-results").append("<div class='card mb-5 mycard result-" + i + "' >" + "<div class='row no-gutters'>" +
			"<div class='col-md-4'>" + "<div class='card-img img-" + i + "'></div>" + "</div>" + 
			"<div class='col-md-8'>" + 
			"<div class='card-body'>" +
				"<h5 class='card-title title-" + i + "'></h5>" + 
				"<p class='card-text snippet-" + i + "'></p>" +
				"<p class='card-text'><small class='text-muted metadata-" + i + "'></small></p>" + 
			"</div></div></div></div>");




	}

	for (var m = 0; m <= 9; m++) {
		var id = callback.query.search[m].pageid;
		// console.log(id);
		var title = callback.query.search[m].title;
		var url = title.replace(/ /g, "_");
		var imggetter = `//en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${url}&piprop=thumbnail&pithumbsize=250&pilimit=20`;
		$.ajax({
			url: imggetter,
			method: "GET",
			dataType: "jsonp",
			ajaxID: id,
			ajaxM: m,
			success: function(data) {
				var newid = this.ajaxID;
				m = this.ajaxM;
				// console.log(newid);

				if (data.query.pages[newid].hasOwnProperty("thumbnail") === true) {
					$(".img-" + m).html("<img width=100% height=100% src='"+`${data.query.pages[newid].thumbnail.source}`+"'>");

					// $(".img-" + m).css('background', 'red !important');
					// .style.background = "url(" + `${data.query.pages[newid].thumbnail.source}` +") !important";
					// ("<img src='" + `${data.query.pages[newid].thumbnail.source}` + "'>");
				  } else {
					$(".img-" + m).html("<img width=50% src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Article_icon_cropped.svg/512px-Article_icon_cropped.svg.png'>");
				  }

				}
		});
		
		
		
		var timestamp = callback.query.search[m].timestamp;
		timestamp = new Date(timestamp);
		// console.log(imggetter.query.pages);
		$(".title-" + m).html("<a href='//en.wikipedia.org/wiki/" + url + "' target='_blank'>" + callback.query.search[m].title + "</a>");
		$(".snippet-" + m).html(callback.query.search[m].snippet);
		$(".metadata-" + m).html((callback.query.search[m].size/1000).toFixed(0) + "kb (" + callback.query.search[m].wordcount + " words) - " + timestamp);
	}
}

function showError(keyword) {
	$(".display-results").append( "<div class='error'> <p>Your search <span class='keyword'>" + keyword + "</span> did not match any documents.</p> <p>Suggestions:</p><li>Make sure that all words are spelled correctly.</li><li>Try different keywords.</li><li>Try more general keywords.</li></div> ");
}

$(".result-btn-wiki").click(function (event) {
	event.preventDefault();
	$(".display-results").html("");
	var keyword = $(".result-wiki-search-form-input").val();
	document.getElementById("result-wiki-search-form-input").blur();
	ajax(keyword);
});

$(".btn-wiki").click(function(event) {
	event.preventDefault();
	var keyword = $(".wiki-search-input").val();

	if (keyword !== "") {
		$(".result-wiki-search-form-input").val(keyword);
		$(".home").addClass('hidden');
   	 	$(".result").removeClass('hidden');
    	document.getElementById("wiki-search-input").blur();
   		$(".wiki-search-input").val("");
		document.getElementById("result-wiki-search-form-input").blur();	
		$(".display-results").html("");
		ajax(keyword);
	}

	else {
		  Swal.fire({
			icon: 'error',
			title: 'No search term!',
			text: 'Enter a keyword into the search box'
		  })  

	}
	
});