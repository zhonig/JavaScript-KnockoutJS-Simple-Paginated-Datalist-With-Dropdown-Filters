//Base URL
let baseURL = 'https://api.performline.com/';

//Authorization Key
let authorizationKey = '8a26bba7614feb3987ddfec7c6d31755ae5d7c47';

//Limit Per Page
let limit = 10;

//Total Observable Web Pages In Server
let total = ko.observable();

//Current Page Observable
let currentPage = ko.observable(1);

//Brands Observable Array -- Used for select dropdown
let brands = ko.observableArray();

//Currently Selected Brand Observable -- Used for select dropdown
let selectedBrand = ko.observable();

//Campaigns Observable Array -- Used for select dropdown 2
let campaigns = ko.observableArray();

//Currently Selected Campaign -- Used for select dropdown
let selectedCampaign = ko.observable();

//Web Pages Data Observable Array -- Used for table data
let webPagesData = ko.observableArray();

//Apply Model Object Bindings to HTML Body
ko.applyBindings({
	brands: brands,
	selectedBrand: selectedBrand,
	campaigns: campaigns,
	selectedCampaign: selectedCampaign,
	webPagesData: webPagesData,
	limit: limit,
	total: total,
	//On Previous Page Button Click
	togglePreviousPage: function (data, event) {
		event.preventDefault();
		
		//Decrement Current Page By 1
		currentPage(currentPage() - 1);
		
		//Clear and Load Web Pages
		clearandloadWebPages();
	},
	//On Next Page Button Click
	toggleNextPage: function (data, event) {
		event.preventDefault();
		
		//Increment Current Page By 1
		currentPage(currentPage() + 1);
		
		//Clear and Load Web Pages
		clearandloadWebPages();
	},
	//Sorted Web Pages Data By Score in descending order and URL in ascending order -- Computed function
	sortedWebPagesByScoreAndUrl: ko.computed(function () {
		return webPagesData().sort(function (l, r) {
			let leftScore = l.Score;
			let rightScore = r.Score;
			let leftUrl = l.Url;
			let rightUrl = r.Url;
			
			//Sort Score in descending order
			if (leftScore < rightScore) { return 1; }
			if (leftScore > rightScore) { return -1; }
			
			//Sort Url in ascending order
			if (leftUrl < rightUrl) { return -1; }
			if (leftUrl > rightUrl) { return 1; }
		});
	})
}, document.getElementsByTagName('body')[0]);

//If Brand Dropdown is changed
selectedBrand.subscribe(function (newValue) {
	//Reset Current Page
	currentPage(1);
	
	//Reset Total
	total(0);
	
	//Reset Campaigns
	campaigns([]);
	
	//If new brand was selected
	if(newValue) {
		//Get Campaigns by Selected Brand ID
		getCampaignsByBrandID(newValue.Id, function (data) {
			campaigns(data.Results);
		});
		
		//Clear and Load Web Pages
		clearandloadWebPages();
	}
	//Else -- if select options caption was selected
	else {
		//Reset Web Pages Data
		webPagesData([]);
	}
});

//If Campaign Dropdown is changed
selectedCampaign.subscribe(function (newValue) {
	//Reset Current Page
	currentPage(1);
	
	//Reset Total
	total(0);
	
	//Clear and Load Web Pages
	clearandloadWebPages();
});

//Initialize Program
init();

//Initialization Function
function init() {
	getAllBrands(function (data) {
		brands(data.Results);
	});
}

//Clear and Load Web Pages
function clearandloadWebPages() {
	//Reset Web Pages Data
	webPagesData([]);
	
	//Get Web Pages by Selected Brand ID
	if(!ko.unwrap(selectedCampaign)) {
		getWebPagesByBrandID(ko.unwrap(selectedBrand).Id, updateWebPagesDataView);
	}
	//Else -- Get Web Pages By Campaign ID
	else {
		getWebPagesByCampaignID(ko.unwrap(selectedCampaign).Id, updateWebPagesDataView); 
	}
}

//Update Web Pages Data Table View
function updateWebPagesDataView(data) {
	let webPages = data.Results;
	if(!ko.unwrap(total)) total(data.ResultCount.Total);
	for (let i = 0; i < webPages.length; i++) {
		//Get Web Page Data by Web Page ID
		getWebPageDataByWebPageID(webPages[i].Id, function (data) {
			webPagesData.push(data.Results[0]);
		});
	}
}

//Get All Brands
function getAllBrands(callback) {
	rest('GET', baseURL + 'common/brands/', null, callback);
}

//Get Campaigns By Brand ID
function getCampaignsByBrandID(id, callback) {
	rest('GET', baseURL + 'common/campaigns/?brandId=' + id, null, callback);
}

//Get Web Pages By Brand ID
function getWebPagesByBrandID(id, callback) {
	rest('GET', baseURL + 'web/pages/?brand=' + id + '&limit=' + limit + '&offset=' + (currentPage() === 1 ? 0 : (currentPage() * limit)), null, callback);
}

//Get Web Pages By Campaign ID
function getWebPagesByCampaignID(id, callback) {
	rest('GET', baseURL + 'web/pages/?campaign=' + id + '&limit=' + limit + '&offset=' + (currentPage() === 1 ? 0 : (currentPage() * limit)), null, callback);
}

//Get Web Page Data By Web Page ID
function getWebPageDataByWebPageID(id, callback) {
	rest('GET', baseURL + 'web/pages/' + id, null, callback);
}

//AJAX calls to server using jQuery
function rest(type, url, data, success, err) {
	$.ajax({
		type: type,
		url: url,
		beforeSend: function(xhr) { 
		  xhr.setRequestHeader('Authorization', 'Token ' + authorizationKey); 
		},
		success: success || function (res) { console.log(res); },
		error: err || function(err) { console.log(err); }
	});
}