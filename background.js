// Copyright (c) 2019 4ilo (https://github.com/4ilo). All rights reserved.

'use strict';

let base_url = "https://oldschool.runescape.wiki";

// The user is typing
chrome.omnibox.onInputChanged.addListener(function(text, suggest) 
{
    // Use osrs wiki api to get a few suggestions
    search(text, function(data) {
        var results = [];

        for(let i = 0; i < data[1].length; i++)
        {
            results.push({
                content: data[1][i], description: data[1][i]
            })
        }

        suggest(results);
    });
});

function search(query, callback)
{
    var url = base_url + "/api.php?action=opensearch&format=json&formatversion=2&namespace=0%7C302%7C308&limit=10&suggest=true&search=" + query;
    var req = new XMLHttpRequest();
    
    
    req.onreadystatechange = function() 
    {
        if (req.readyState == 4) {
            callback(JSON.parse(req.responseText));
        }
    }

    req.open("GET", url, true);
    req.send();
}

function navigate(url) 
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
    {
        chrome.tabs.update(tabs[0].id, {url: url});
    });
}

// The user pressed enter
chrome.omnibox.onInputEntered.addListener(function(text) 
{
    if(text.length === 0)
    {
      navigate(base_url);
    }
    else
    {
      navigate(base_url + "/w/Special:Search?search=" + text);
    }

});
