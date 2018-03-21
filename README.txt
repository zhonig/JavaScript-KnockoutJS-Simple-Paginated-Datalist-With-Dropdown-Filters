# FrontEndEval
໒( ͡ᵔ ▾ ͡ᵔ )७ Simple Evaluation Task for Front-End Engineers

## Task
Build a small, standalone web app using the language/framework of your choice that, given an API token, will display a list of data from the [PerformLine API](https://api.performline.com/).

NOTE:  This is a reporting API and was not design specifically to implement a UI on top of, so we understand if there are a few more round trips and performance trade-offs involved here.

## Details
You will be given an API Token with access to the Zephyr _Company_, who has several _Brands_ associated with it.

Each _Brand_ is set-up to contain _scores_ and _observations_ for Web pages that are further associated with a _Campaign_.

Your app should be able to:
* Toggle between brands available to the Zephyr _Company_.
* Display a paginated list of all web pages for that _Brand_ by _Id_ showing the values of _Score_, _Url_ and _LastScored_ date.
* The app should be able to filter the list by _Campaign_ or show all.

## Deliverable:
* A zip file containing the git repository for your project to show commit history.
* Instructions for running / hosting the application.  It should be able to work in a Linux environment.

ZH NOTES:
0) https://github.com/PerformLine/FrontEndEval/blob/master/README.md
1) API Key: 8a26bba7614feb3987ddfec7c6d31755ae5d7c47
2) The LastScored property is missing when calling the WebPage API GET /web/pages/:id/. Due to this, I commented out the column in my code to prevent an error.
3) To prevent CORS error on localhost and Google Chrome Browser, paste the following commands into the windows "command prompt":
	cd C:\Program Files (x86)\Google\Chrome\Application
	chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
	
Live Website: http://zackhonig.com/projects/Simple-Paginated-Datalist-With-Dropdown-Filters