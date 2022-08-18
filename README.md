# IMSC-Rosetta qualification

A test application to qualify IMSC-Rosetta files by Simon Hailes at YellUmbrella.

# Use

Open https://imsc-rosetta.github.io/imsc-roestta-qualify/ in a web browser (e.g. Chrome).

Drop a file into the blue box to check the XML structure, round trip of the file through XML parsing to XML building, and select the Render tab to see the render of the file along with a display of each div.

# Development

Checkout the repo, and use 

`npm build` 

to build the base app.

Serve dist/ from a webserver, else you will encounter CORS errors.

