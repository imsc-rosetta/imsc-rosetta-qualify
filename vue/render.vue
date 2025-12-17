/*
 * Copyright 2022 Simon Hailes, Yella BVBA (https://yellaumbrella.tv)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


<template>
  <div>
    <div class="render-outer" :id="renderOuterId">
      <div class="background" :id="backgroundId">
        <div style="position:absolute; top:50%; height:1px; left:0; width:100%; background-color: red;"></div>
        <div style="position:absolute; top:50%; height:1px; left:0; width:100%; background-color: red;"></div>
      </div>
      <div class="render" :id="renderId">
      </div>
    </div>
    <p>ISDs generated: {{ tmax }} <button @click="saveAsPNG();">Generate a zip of images using SVG - some features not supported</button></p>
    <p>ISDs generated: {{ tmax }} <button @click="saveAsPNG2();">Generate a zip of images - using screen capture - more accurate (Chrome/Edge only)</button></p>
    <p>
      <label for="bg">Choose a background:</label>
      <select name="bg" :id="bgId" @change="drawBackground(this)">
        <option value="grey">Grey</option>
        <option value="black">Black</option>
        <option value="white">White</option>
        <option value="gradient">Gradient</option>
        <option value="grid">Gradient Grid</option>
        <option value="bars" selected>SMPTE bars</option>
      </select>
    </p>
    <div>
      <span>{{ selectedTime }} </span><span>Rendered using: {{imscVersion}}</span><input type="range" min="0" v-bind:max="tmax" v-model="timeindex" />
    </div>
    <video class="video" id="video" autoplay playsinline style="/*left:1000%; top:1000%;*/"></video>
    <div class="xml"><p v-html="descrDisplay"></p><pre v-html="xmlDisplay"></pre></div>
  </div>

</template>

<script>
module.exports = {
  data: () => {
    return {
      tmax: 100,
      timeindex: 0,
      xmlDisplay: "none",
      descrDisplay: '',
      selectedTime: "xx:xx:xx:xxx",
      renderId:'render',
      renderOuterId:'renderouter',
      backgroundId:'background',
      bgId:'bg',
      imscVersion: 'https://unpkg.com/imsc@1.1.0-beta.2/build/umd/imsc.all.min.js',
    };
  },
  watch: {
    timeindex(newt, oldt) {
      this.vdiv = document.getElementById(this.renderId);
      this.outerdiv =  document.getElementById(this.renderOuterId);
      if (this.vdiv) {
        let isd = this.imsc.generateISD(this.doc, this.t[newt]);
        if (isd.contents.length) {
          for (let i = 0; i < this.intimes.length; i++) {
            if (this.intimes[i] >= this.t[newt]) {
              this.xmlDisplay = this.toHtmlEntities(this.divs[i]);
              if (this.descriptions && this.descriptions[this.intimes[i]]){
                this.descrDisplay = this.descriptions[this.intimes[i]];
              } else {
                if (this.descriptions && this.parseddivs && this.descriptions[this.parseddivs[i].$['xml:id']]){
                  this.descrDisplay = this.descriptions[this.parseddivs[i].$['xml:id']];
                } else {
                  this.descrDisplay = 'no description';
                }
              }
              break;
            }
          }
        } else {
          this.descrDisplay = "";
          this.xmlDisplay = "none";
        }
        this.selectedTime = this.toTime(this.t[newt]);
        this.vdiv.innerHTML = "";
        //(isd, element, imgResolver, eheight, ewidth, displayForcedOnlyMode, errorHandler, previousISDState, enableRollUp)
        // force size as our div is not on screen for first render
        this.imsc.renderHTML(isd, this.vdiv, null, this.vdiv.height, this.vdiv.width);
      } else {
        setTimeout(() => {
          this.timeindex = oldt;
          this.timeindex = newt;
        }, 200);
      }
    },
  },
  methods: {
    init(options){
      this.imsc = options.imsc;
      this.renderId = options.name+'-div';
      this.renderOuterId = options.name+'-outer';
      this.backgroundId = options.name+'-bg';
      this.bgId = options.name+'-bgchoice';
      this.imscVersion = options.version;
    },

    drawBackground(){
      this.bdiv = document.getElementById(this.backgroundId);
      let select = document.getElementById(this.bgId);
      let type = select.value;

      let html = '';
      switch (type){
        case 'grey':
          this.bdiv.style.background = "";
          this.bdiv.style.backgroundColor = "darkgrey";
          html = '';
          break;

        case 'black':
          this.bdiv.style.background = "";
          this.bdiv.style.backgroundColor = "black";
          html = '';
          break;

        case 'white':
          this.bdiv.style.background = "";
          this.bdiv.style.backgroundColor = "white";
          html = '';
          break;

        case 'gradient':
          this.bdiv.style.background = "linear-gradient(135deg, #b5bdc8 0%,#828c95 36%,#28343b 100%)";
          this.bdiv.style.backgroundColor = "black";
          html = '';
          break;

        case 'grid':{
          for (let x = 10; x < 100; x+= 10){
            html += `<div style="position:absolute; top:0%; height:100%; left:${x}%; width:1px; background-color: red;"></div>`
          }
          for (let y = 10; y < 100; y+= 10){
            html += `<div style="position:absolute; top:${y}%; height:1px; left:0%; width:100%; background-color: red;"></div>`
          }
          this.bdiv.style.background = "linear-gradient(135deg, #b5bdc8 0%,#828c95 36%,#28343b 100%)";
          this.bdiv.style.backgroundColor = "black";
        } break;

        case 'bars':{
          this.bdiv.style.background = '';
          this.bdiv.style.backgroundColor = "black";
          html = 
`<div class="smpte">
  <!-- Top bars -->
  <div class="top white"></div>
  <div class="top yellow"></div>
  <div class="top cyan"></div>
  <div class="top green"></div>
  <div class="top magenta"></div>
  <div class="top red"></div>
  <div class="top blue"></div>

  <!-- Middle bars -->
  <div class="mid blue"></div>
  <div class="mid black"></div>
  <div class="mid magenta"></div>
  <div class="mid black"></div>
  <div class="mid cyan"></div>
  <div class="mid black"></div>
  <div class="mid white"></div>

  <!-- Bottom bars -->
  <div class="bot darkblue"></div>
  <div class="bot white"></div>
  <div class="bot purple"></div>
  <div class="bot black"></div>
  <div class="bot pluge-black"></div>
  <div class="bot pluge-gray"></div>
  <div class="bot pluge-white"></div>
</div>`          
        } break;
      }

      this.bdiv.innerHTML = html;
    },

    toHtmlEntities(txt) {
      return txt.replace(/./gm, (s) => {
        return s.match(/[a-z0-9\s]+/i) ? s : "&#" + s.charCodeAt(0) + ";";
      });
    },

    toTime(t) {
      let hh = ("0" + ((t / 60 / 60) >> 0)).slice(-2);
      let mm = ("0" + (((t / 60) >> 0) % 60)).slice(-2);
      let ss = ("0" + ((t >> 0) % 60)).slice(-2);
      let ttt = ("00" + (((t * 1000) >> 0) % 1000)).slice(-3);
      return `${hh}:${mm}:${ss}.${ttt}`;
    },

    // defer processing until the DOM is populated
/*    processXml(file, xml) {
      this.$nextTick(function () {
        this.processXmlReal(file, xml);
      });
    },*/

    processXml(file, xml, parsed) {
      //this.drawBackground('grid');
      this.drawBackground('bars');

      //console.log("would render");
      this.filename = file.name;
      this.orgfname = file.name;
      this.filename = this.filename.split('.');
      this.filename.pop();
      this.filename = this.filename.join('.');

      this.xml = xml;

      this.getDivs(xml);
      this.getParsedDivs(parsed);
      this.doc = this.imsc.fromXML(xml);
      this.t = this.doc.getMediaTimeEvents();
      this.tmax = this.t.length - 1;
      this.timeindex = 0;
      this.timeindex = 1;
      //this.vdiv.innerHTML = '';
      //window.imsc.renderHTML(isd, this.vdiv);
    },

    getParsedDivs(parsed){
      this.parseddivs = [];
      if (parsed.tt && parsed.tt.body && parsed.tt.body.length){
        for (let i = 0; i < parsed.tt.body[0].div.length; i++){
          this.parseddivs.push(parsed.tt.body[0].div[i]);
        }
      }
    },

    getDivs(xml) {
      let divs = xml.match(/<div[\s\S]*?div>/g);

      divs = divs || [];

      this.intimes = [];
      for (let i = 0; i < divs.length; i++) {
        let b = divs[i].split('begin="')[1];
        let times = b.split(":");
        let hours = parseInt(times[0]);
        let mins = parseInt(times[1]);
        let secs = parseFloat(times[2]);
        let t = hours * 60 * 60 + mins * 60 + secs;
        this.intimes.push(t);
      }
      this.divs = divs;

      //console.log(divs);
    },

    escapeHtml(unsafe) {
      return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    },

    HtmlCR(unsafe) {
      if (unsafe.startsWith('#')){
        unsafe.slice(1);
      }
      return unsafe.replaceAll('\n', '<br />');
    },


    async saveAsPNG() {
      let defdims = {'h': 1080, 'w': 1920};

      let imageNames = {};

      this.vdiv.hidden = true;
      let zip = new JSZip();
      let render_one = (offset)=>{
        return new Promise((resolve)=>{
          let dims = defdims;
          let exp_width = dims.w;
          let exp_height = dims.h;
          let vdiv = this.vdiv;

          this.vdiv.innerHTML = "";
          /* create svg container */

          let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute('width', exp_width + "px");
          svg.setAttribute('height', exp_height + "px");
          svg.setAttribute("xmlns", svg.namespaceURI);

          let fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
          fo.setAttribute('width', '100%');
          fo.setAttribute('height', '100%');

          svg.appendChild(fo);

          /* create container div */

          let rdiv = document.createElement("div");
          rdiv.style.height = "100%";
          rdiv.style.width = "100%";
          rdiv.style.position = "relative";
          rdiv.style.background = "linear-gradient(135deg, #b5bdc8 0%,#828c95 36%,#28343b 100%)";

          if (!rdiv.style.background) {
              rdiv.style.background = "-moz-linear-gradient(left, #b5bdc8 0%, #828c95 36%, #28343b 100%)";
          }

          if (!rdiv.style.background) {
              rdiv.style.background = "-webkit-linear-gradient(left, #b5bdc8 0%, #828c95 36%, #28343b 100%)";
          }

          if (!rdiv.style.background) {
              rdiv.style.background = "#b5bdc8";
          }

          fo.appendChild(rdiv);

          vdiv.appendChild(svg);


          var isd = imsc.generateISD(this.doc, offset);

          imsc.renderHTML(
                  isd,
                  rdiv,
                  function (uri) {
                      return uri;
                  },
                  exp_height,
                  exp_width,
                  false, //$("#forced-display")[0].checked, /*displayForcedOnlyMode*/
                  null /*errorHandler*/
                  );
          
          var svgser = (new XMLSerializer).serializeToString(svg);

          var canvas = document.createElement("canvas");

          var ctx = canvas.getContext('2d');
          ctx.canvas.height = exp_height;
          ctx.canvas.width = exp_width;

          var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgser);

          var img = new Image();
          img.onload = ()=>{
              ctx.drawImage(img, 0, 0);
              let data = canvas.toDataURL("image/png");
              let fname = offset + ".png";
              imageNames[offset] = fname;
              let fpath = 'images/'+this.orgfname+'/'+fname;
              zip.file(fpath, data.substr(data.indexOf(',') + 1), {base64: true});
              resolve(null);
          };
          img.src = url;
        });

      };


      // render all the time we are interested in (all the begins, NOT the ends)
      for (let i = 0; i < this.intimes.length; i++){
        await render_one(this.intimes[i]);
      }

      if (this.descnamebase && this.descnamebase.toLowerCase() !== this.filename.toLowerCase()){
        window.alert(`Description file name (${this.descnamebase.toLowerCase()}.md) and Rosetta file name (${this.filename.toLowerCase()}.imscr) mismatch - descriptions will be cleared`);
        this.descriptions = {};  
        this.descfile = '';
        this.descnamebase = '';
      }

      this.descriptions = this.descriptions || {};
      if (this.descriptions){
        let descrpath = this.orgfname+'.md';
        let descrpathhtml =  'html/'+this.orgfname+'.html';
        let imagesfolder = 'images/'+this.orgfname+'/';

        let html = `<!doctype html>\n<html>\n  <head>\n    <title>${this.orgfname}</title>\n  </head>\n  <body>\n`;
        let md = `# Sample file ${this.orgfname}\n\n`;

        if (this.descriptions['outline']){
            md+= this.descriptions['outline'];
            md+= '\n\n';
            html += `    <h2>Generated by <a href="https://github.com/imsc-rosetta/imsc-rosetta-qualify" target="_blank">imsc-rosetta-qualify</a> by <b>simon@yellaumbrella.tv</b></h2>\n`;
            html += `    <p>${this.HtmlCR(this.descriptions['outline'])}</p>\n`;
        }

        html += `    <p><a href="./imscr/${this.orgfname}">Download ${this.orgfname}</a></p>\n`;

        md+= `## Complete file (click expand to see all) [download](./imscr/${this.orgfname})\n\n`;
        let xml = this.xml;
        md += `<details><summary>Expand: ${this.orgfname}</summary>\n\n`;
        md += '```\n' + xml + '\n```\n\n</details>\n\n';
        md += '## Divs with images:\n\n';

        html += `    <h3>Divs with images:</h3>\n`;

        for (let i = 0; i < this.divs.length; i++){
          let div = this.parseddivs[i];
          if (!div.$ || !div.$.begin){
            console.log('no begin in div '+i);
            continue;
          }
          
          let t = div.$.begin;
          let id = div.$['xml:id'];
          let hms = t.split(':');
          let s = (+hms[0]) * 3600 + (+hms[1])*60 + (+hms[2]);
          let image;
          if (imageNames[s]){
            image = imagesfolder + imageNames[s];
          } else {
            console.error('missing image ',s)
          }
          let xml = this.divs[i];
          
          html += `    <h4>subtitle ${id} at begin=${t}</h4>\n`;
          md += `\n\n### subtitle ${id} at begin=${t}\n\n`;
          if (this.descriptions[id]){
            md += this.descriptions[id] + '\n\n';
            html += `    <p>${this.HtmlCR(this.descriptions[id])}</p>\n`;
          }
          if (this.descriptions[t]){
            md += this.descriptions[t] + '\n\n';
            html += `    <p>${this.HtmlCR(this.descriptions[t])}</p>\n`;
          }
          
          html += `    <p>div XML<br /><pre>${this.escapeHtml(xml)}</pre></p>\n`;
          md += '#### div XML\n\n```\n' + xml + '\n```\n';
          if (image){
            md += `#### Resulting Image\n`;
            md += `\n<img src="./${image}" width="600"/>\n`;
            html += `    <img src="../${image}" width="600"/>\n`;
          }
        }
        md += '\n\n';

        html += '  </body>\n</html>\n';

        // add the .ismcr.md file in the root.
        zip.file(descrpath, md);
        // add the .ismcr.html file in the root.
        zip.file(descrpathhtml, html);
      }

      // finally add the sample itself in the /imscr folder.
      zip.file('imscr/'+this.orgfname, this.xml);
      if (this.descfile){
        // with the descriptive file if present.
        zip.file('imscr/'+this.descnamebase+'.descr.md', this.descfile);
      }

      this.vdiv.innerHTML = "";
      this.timeindex = 0;

      let content = await zip.generateAsync({type: "blob"});
      var fname = this.filename;
      saveAs(content, fname + ".zip");

      setTimeout(() => {
        this.timeindex = 1;
        this.vdiv.hidden = false;
      }, 2000);
    },


    async saveAsPNG2() {
      let defdims = {'h': 1080/2, 'w': 1920/2};

      let imageNames = {};

      let dims = defdims;
      let exp_width = dims.w;
      let exp_height = dims.h;
      //let vdiv = document.getElementById('renderPatched-div');

      //let vdiv = document.getElementById(this.renderId);

      this.vdiv.classList.remove('render');
      this.vdiv.classList.add('render2');


      /*
      let stream = null;
      let track = null;
      let ctx = null;
      let frames = 0;
      let maxframes = 10;
      let w, h;

      const elem = document.querySelector("#myDiv");
      const vid = document.querySelector("#video");
      const canvas = document.getElementById("canvas");
      const rect = elem.getBoundingClientRect(); // element dimensions
      */

      //this.vdiv.hidden = true;
      let zip = new JSZip();
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext('2d');
      const vid = document.querySelector("#video");

      canvas.height = exp_height;
      canvas.width = exp_width;
      let w = exp_width;
      let h = exp_height;
      vid.style.width = ''+exp_width+'px';
      vid.style.height = ''+exp_height+'px';
      vid.width = w;
      vid.height = h;


      let constraints = {
        audio: false,
        video: {
          width: { ideal: w, max: w },
          height: { ideal: h, max: h },
          resizeMode: 'none',
        },
        logicalSurface: true, // don't get the mouse pointer, for example
        preferCurrentTab: true
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      const track = stream.getVideoTracks()[0];

      this.outerdiv.style.width = ''+exp_width+'px';
      this.outerdiv.style.height = ''+exp_height+'px';
      this.outerdiv.width = w;
      this.outerdiv.height = h;

/*      this.vdiv.style.width = ''+exp_width+'px';
      this.vdiv.style.height = ''+exp_height+'px';
      this.vdiv.width = w;
      this.vdiv.height = h;*/

      const restrictionTarget = await RestrictionTarget.fromElement(this.outerdiv);

      console.log(restrictionTarget);
      await track.restrictTo(restrictionTarget);

      function asyncwait(ms){
        return new Promise((resolve) => {
          setTimeout(()=>{
            resolve();
          }, ms);
        });
      }

      vid.srcObject = stream;
      await new Promise((resolve) => {
        vid.onloadedmetadata = ()=>{
          resolve();
        };
      });
      await vid.play();

      // let let the video play for 2s before we start to use it.
      await asyncwait(2000);

      let render_one = (offset)=>{
        return new Promise(async (resolve)=>{
          //this.vdiv = document.getElementById(this.renderId);
          if (this.vdiv) {
            let isd = this.imsc.generateISD(this.doc, offset);
            this.vdiv.innerHTML = "";
            //(isd, element, imgResolver, eheight, ewidth, displayForcedOnlyMode, errorHandler, previousISDState, enableRollUp)
            // force size as our div is not on screen for first render
            this.imsc.renderHTML(isd, this.vdiv, null, h, w);
          }
          

          /*
          var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgser);

          var img = new Image();
          img.onload = ()=>{
              ctx.drawImage(img, 0, 0);
              let data = canvas.toDataURL("image/png");
              let fname = offset + ".png";
              imageNames[offset] = fname;
              let fpath = 'images/'+this.orgfname+'/'+fname;
              zip.file(fpath, data.substr(data.indexOf(',') + 1), {base64: true});
              resolve(null);
          };
          img.src = url;
          */
          let waitFrame = function(){
            let p = new Promise(resolve=>{
              // wait for at least one paint.
              window.requestAnimationFrame(()=>{
                // then another 100ms
                setTimeout(resolve, 100);
              }); 
            });
            return p;
          }

          await waitFrame();

          // Draw the video frame scaled to element size
          ctx.drawImage(vid, 0, 0, w, h);
          let data = canvas.toDataURL("image/png");
          let fname = offset + ".png";
          imageNames[offset] = fname;
          let fpath = 'images/'+this.orgfname+'/'+fname;
          zip.file(fpath, data.substr(data.indexOf(',') + 1), {base64: true});
          resolve(null);
        });
      };


      // render all the time we are interested in (all the begins, NOT the ends)
      for (let i = 0; i < this.intimes.length; i++){
        await render_one(this.intimes[i]);
      }

      if (this.descnamebase && this.descnamebase.toLowerCase() !== this.filename.toLowerCase()){
        window.alert(`Description file name (${this.descnamebase.toLowerCase()}.md) and Rosetta file name (${this.filename.toLowerCase()}.imscr) mismatch - descriptions will be cleared`);
        this.descriptions = {};  
        this.descfile = '';
        this.descnamebase = '';
      }

      this.descriptions = this.descriptions || {};
      if (this.descriptions){
        let descrpath = this.orgfname+'.md';
        let descrpathhtml =  'html/'+this.orgfname+'.html';
        let imagesfolder = 'images/'+this.orgfname+'/';

        let html = `<!doctype html>\n<html>\n  <head>\n    <title>${this.orgfname}</title>\n  </head>\n  <body>\n`;
        let md = `# Sample file ${this.orgfname}\n\n`;

        if (this.descriptions['outline']){
            md+= this.descriptions['outline'];
            md+= '\n\n';
            html += `    <h2>Generated by <a href="https://github.com/imsc-rosetta/imsc-rosetta-qualify" target="_blank">imsc-rosetta-qualify</a> by <b>simon@yellaumbrella.tv</b></h2>\n`;
            html += `    <p>${this.HtmlCR(this.descriptions['outline'])}</p>\n`;
        }

        html += `    <p><a href="./imscr/${this.orgfname}">Download ${this.orgfname}</a></p>\n`;

        md+= `## Complete file (click expand to see all) [download](./imscr/${this.orgfname})\n\n`;
        let xml = this.xml;
        md += `<details><summary>Expand: ${this.orgfname}</summary>\n\n`;
        md += '```\n' + xml + '\n```\n\n</details>\n\n';
        md += '## Divs with images:\n\n';

        html += `    <h3>Divs with images:</h3>\n`;

        for (let i = 0; i < this.divs.length; i++){
          let div = this.parseddivs[i];
          if (!div.$ || !div.$.begin){
            console.log('no begin in div '+i);
            continue;
          }
          
          let t = div.$.begin;
          let id = div.$['xml:id'];
          let hms = t.split(':');
          let s = (+hms[0]) * 3600 + (+hms[1])*60 + (+hms[2]);
          let image;
          if (imageNames[s]){
            image = imagesfolder + imageNames[s];
          } else {
            console.error('missing image ',s)
          }
          let xml = this.divs[i];
          
          html += `    <h4>subtitle ${id} at begin=${t}</h4>\n`;
          md += `\n\n### subtitle ${id} at begin=${t}\n\n`;
          if (this.descriptions[id]){
            md += this.descriptions[id] + '\n\n';
            html += `    <p>${this.HtmlCR(this.descriptions[id])}</p>\n`;
          }
          if (this.descriptions[t]){
            md += this.descriptions[t] + '\n\n';
            html += `    <p>${this.HtmlCR(this.descriptions[t])}</p>\n`;
          }
          
          html += `    <p>div XML<br /><pre>  ${this.escapeHtml(xml)}</pre></p>\n`;
          md += '#### div XML\n\n```\n  ' + xml + '\n```\n';
          if (image){
            md += `#### Resulting Image\n`;
            md += `\n<img src="./${image}" width="600"/>\n`;
            html += `    <img src="../${image}" width="600"/>\n`;
          }
        }
        md += '\n\n';

        html += '  </body>\n</html>\n';

        // add the .ismcr.md file in the root.
        zip.file(descrpath, md);
        // add the .ismcr.html file in the root.
        zip.file(descrpathhtml, html);
      }

      // finally add the sample itself in the /imscr folder.
      zip.file('imscr/'+this.orgfname, this.xml);
      if (this.descfile){
        // with the descriptive file if present.
        zip.file('imscr/'+this.descnamebase+'.descr.md', this.descfile);
      }

      this.vdiv.innerHTML = "";
      this.vdiv.classList.remove('render2');
      this.vdiv.classList.add('render');

      this.timeindex = 0;

      let content = await zip.generateAsync({type: "blob"});
      var fname = this.filename;
      saveAs(content, fname + ".zip");

      setTimeout(() => {
        this.timeindex = 1;
        this.vdiv.hidden = false;
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }, 2000);
    },



    // add an .descr.md file which describes the imscr
    adddescrfile(file, descriptions){
      this.descfile = descriptions;
      this.descnamebase = file.name;
      this.descnamebase = this.descnamebase.split('.');
      this.descnamebase.pop();
      try{
        this.descnamebase.pop();
      } catch(e){

      }
      this.descnamebase = this.descnamebase.join('.');

      if (descriptions.startsWith('#')){
        descriptions = '\n'+descriptions;
      }
      descriptions = descriptions.replaceAll('\r\n', '\n');
      let descs = descriptions.split('\n# ');
      console.log(descs);
      
      this.descriptions = {};
      for (let i = 0; i < descs.length; i++){
        if (descs[i].toLowerCase().startsWith('outline')){
          this.descriptions['outline'] = descs[i].slice('Outline'.length);
        }
        if (descs[i].toLowerCase().startsWith('div ')){
          let spl = descs[i].split('\n');
          let t = spl[0].slice('div '.length);
          spl.shift();
          this.descriptions[t] = spl.join('\n');
        }
      }
      console.log(this.descriptions);
    },
  },

  mounted() {
    this.$emit("mounted", "render", this);
    //console.log("mounted render");
  },
  destroyed() {
    clearInterval(this.interval);
  },
};
//@ sourceURL=/vue/render.vue
</script>

<style scoped>
.render-outer{
  isolation: isolate;
  position: relative;
  border: 1px solid black;
  height: 540px;
  width: 960px;
}
.background{
  position: absolute;
  background-color: darkgrey;
  height: 100%;
  width: 100%;
}
.render {
  background-color: transparent;
  position: absolute;
  height: 100%;
  width: 100%;
}
.render2 {
  background-color: transparent;
  position: absolute;
  height: 100%;
  width: 100%;
}
.video {
  position: absolute;
  left:-1000px;
  top: -1000px;
}
.xml {
  max-height: 25vh;
  overflow: scroll;
  border: 2px solid black;
}
h2 {
  margin-bottom: 0;
}


/*bars styles*/
.smpte {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: black;
  overflow: hidden;
}

/* ---------- COMMON ---------- */
.top, .mid, .bot {
  position: absolute;
  top: 0;
  height: 100%;
}

/* ---------- TOP (67%) ---------- */
.top {
  height: 67%;
  width: calc(100% / 7);
}

.top:nth-child(1) { left: 0%;    background: #ffffff; }
.top:nth-child(2) { left: 14.28%; background: #ffff00; }
.top:nth-child(3) { left: 28.56%; background: #00ffff; }
.top:nth-child(4) { left: 42.84%; background: #00ff00; }
.top:nth-child(5) { left: 57.12%; background: #ff00ff; }
.top:nth-child(6) { left: 71.4%;  background: #ff0000; }
.top:nth-child(7) { left: 85.68%; background: #0000ff; }

/* ---------- MIDDLE (8%) ---------- */
.mid {
  top: 67%;
  height: 8%;
  width: calc(100% / 7);
}

.mid:nth-of-type(8)  { left: 0%;    background: #0000ff; }
.mid:nth-of-type(9)  { left: 14.28%; background: #000000; }
.mid:nth-of-type(10) { left: 28.56%; background: #ff00ff; }
.mid:nth-of-type(11) { left: 42.84%; background: #000000; }
.mid:nth-of-type(12) { left: 57.12%; background: #00ffff; }
.mid:nth-of-type(13) { left: 71.4%;  background: #000000; }
.mid:nth-of-type(14) { left: 85.68%; background: #ffffff; }

/* ---------- BOTTOM (25%) ---------- */
.bot {
  top: 75%;
  height: 25%;
}

/* left 4 bars */
.bot:nth-of-type(15) { left: 0%;  width: 20%; background: #00214c; }
.bot:nth-of-type(16) { left: 20%; width: 20%; background: #ffffff; }
.bot:nth-of-type(17) { left: 40%; width: 20%; background: #32006a; }
.bot:nth-of-type(18) { left: 60%; width: 10%; background: #000000; }

/* PLUGE */
.pluge-black { left: 70%; width: 10%; background: #0a0a0a; }
.pluge-gray  { left: 80%; width: 10%; background: #1a1a1a; }
.pluge-white { left: 90%; width: 10%; background: #2a2a2a; }


</style>
