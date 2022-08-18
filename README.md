# IMSC-Rosetta qualification

A test application to qualify IMSC-Rosetta files by Simon Hailes at YellUmbrella.

# Use

Open https://imsc-rosetta.github.io/imsc-rosetta-qualify/ in a web browser (e.g. Chrome).

Drop a file into the blue box to check the XML structure, round trip of the file through XML parsing to XML building, and select the Render tab to see the render of the file along with a display of each div.

# Development

Checkout the repo, and use 

```
npm install
npm build
```

to build the base app.

Serve dist/ from a webserver, else you will encounter CORS errors.

If you modify only .vue files, then you don't need to rebuild every time.  The build process basically webpacks dependencies and the initial main.js, which then loads the vue SFC (Sinlge-File Component) modules.

# Dependencies

All are includes in the package.json.

XML parsing is xml2js.  XML building is xmlbuilder.  IMSC rendering is a custom imscJS patched to fix a few boxing issues (see outstanding PRs in the imscJS repo).

The custom imscJS is includes as a tar.gz, and installed directly from there.

# License

Copyright Simon Hailes, Yella BVBA

Provided under the (Apache-2.0)[https://www.apache.org/licenses/LICENSE-2.0] license

(Yella Umbrella)[https://yellaumbrella.tv] provides software and expertise to the subtitling/audio description and dubbing industry.  In support of this industry and with the collaboration of Warner Discovery, IMSC-Rosetta represents a step towards a normalisation of TTML usage, and recognition of the requirements for quality translation subtitles.  IMSC-Rosetta actually represents more than 30 years of experience, distilled into an open and usable subtitle format, and we hope that it helps the industry in general raise the quality of subtitle presentation across the board.
