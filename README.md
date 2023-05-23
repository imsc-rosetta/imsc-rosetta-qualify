# IMSC-Rosetta qualification

A test application to qualify IMSC-Rosetta files by Simon Hailes at YellaUmbrella.

# Use

Open https://imsc-rosetta.github.io/imsc-rosetta-qualify/ in a web browser (e.g. Chrome).

Drop a file into the blue box to check the XML structure, round trip of the file through XML parsing to XML building, and select the Render tab to see the render of the file along with a display of each div.

If you have a name.desc.md file to go with the .imscr file, then the render tab will show the descritpions of the divs as you navigate through them.

If you wish to generate images and a .md which lists the divs and images, then drop either an imscr file or an imscr file and a descr.md file, and then click on 'Generate Images' in Lrgacy Render File or Patched Render File.  This will generate a zip containing the imscr, a .md file, and a set of images in a subdirectory of images/(imscr filename)/ - this is used to create the sample descriptions for the IMAC Rosetta specification repository.

# Mod Record

## 2023-05-23

Added save images feature.
bought up to date with the current specification.
Various minor bugfixes according to feedback.

## 2023-05-12

Updated to reflect changes for default colour in _r_region.

# Tests


imsc-rosetta-qualify performs the following tests:

 - report basic XML parsing errors from two parses.
 - check for extraneous whitespace inside P or parent of nested span.
 - check namespace prefixes and namespace presence.
 - check the IMSC-Rosetta element location rules.
 - check the IMSC-Rosetta attribute rules.
 - check style name legality
 - check fixed style content
 - check changeable style content
 - check style usage and present/absence
 - check region usage and present/absence
 - check region definitions according to IMSC-Rosetta region placement rules.
 - check region definitions according to IMSC-Rosetta line quantisation rules.
 - check for text direct in P or in parent of nested span.
 - check nested spans are only used for Ruby
 - check xml:id uniqueness
 - check begin and end are in the form HH:MM:SS.TTT
 - check begin is increasing in div order where present

 - warn if begin or end are missing
 - warn on unused styles
 - warn on unused regions

 - report foreign metadata

# Render/display

Select the `Legacy Render File` or `Patched Render File` tab once you have dropped a file to see how the subtitles should be presented.

`Patched Render File` may render ruby reserve and other Japanese features maginally better.

# Development

Checkout the repo, and use 

```
npm install
npm build
```

to build the base app.

Serve dist/ from a (simple) webserver, else you will encounter CORS errors.

If you modify only .vue files, then you don't need to rebuild every time.  The build process basically webpacks dependencies and the initial main.js, which then loads the vue SFC (Single-File Component) modules.

# Dependencies

All are includes in the package.json.

XML parsing is xml2js.  XML building is xmlbuilder.  IMSC rendering is a custom imscJS patched to fix a few boxing issues (see outstanding PRs in the imscJS repo).

The custom imscJS is included as a tar.gz, and installed directly from there.

A few libraries are directly included in the repo.

# License

Copyright Simon Hailes, Yella BVBA

Provided under the [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) license

[Yella Umbrella](https://yellaumbrella.tv) provides software and expertise to the subtitling/audio description and dubbing industry.  In support of this industry and with the collaboration of XXXXXXXXXXX, IMSC-Rosetta represents a step towards a normalisation of TTML usage, and recognition of the requirements for quality translation subtitles.  IMSC-Rosetta actually represents more than 30 years of experience, distilled into an open and usable subtitle format, and we hope that it helps the industry in general raise the quality of subtitle presentation across the board.
