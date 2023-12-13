## Group 1

- Leonardo Antezana

# NewsUPick
A simple App that downloads news and saves favourite ones for later browsing.

The news are downloaded using customized filters so that people can keep up to date with the stuff that interests them, without getting overwhelmed.

The App is a PWA and uses JavaScript, CSS, and HTML to offer a cross-platform Mobile application experience as well as a responsive Web one.

Being a PWA, the App is device independent and its responsive nature allows it to adapt to a variety of screensizes and Smartphone models. It is also lightweight and does not require special hardware to work.

At the same time, it maintains the look and feel that most mobile applications offer these days.

## Features

- As a user I want to be able to download my news
- As a user I want to be able to browse my news
- As a user I want to be able to select a news as favourite and save it
    - As a user I want to be able to list my saved favourite news
    - As a user I want to be able to delete a saved news
- As a user I want to have access to an About page to know how the App works
- As a user I want to reset and empty the app's database of saved news
- As a user I want to be able to customize the search terms for my news [CANCELED]
- As a user I want to be able to view all the details of a saved News [ADDED]

## API
The API to be used to fetch the news is provided by NEWSAPI(.org). Below a template of what will be used.

- https://newsapi.org/v2/top-headlines?country=ca&category=technology&apiKey=API_KEY

## Mockoon (Mock REST API Local Server)
During development the tool Mockoon(.com) is being used as it provides a quick and simple way to get a mock REST API server running locally. It returns the required structure and avoids having to worry about request limits with the official News source. 
