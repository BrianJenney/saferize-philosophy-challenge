
This project for saferize takes in a wikipedia url, goes to that page && clicks on the first non-parenthesized, non-italicized link, keeping track of how many links have been `clicked` && the path taken. The function will `break` if an endless loop occurs or if more than 100 links have been visited.

Excluding links in parameters proved to be the most difficult aspect of this challenge.

The function to explore wikipedia uses recursion to call itself && return a response object to the front end where we will handle that object && display relevant information to the user.

Technology used:

**Node JS
**Angular JS
**Cheerio (For loading HTML in request)
**Heroku for Deployment
