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
    <div class="render" :id="renderId"></div>
    <p>ISDs generated: {{ tmax }} <button @click="saveAsPNG();">GenerateImages</button></p>
    <div>
      <span>{{ selectedTime }} </span><span>Rendered using: {{imscVersion}}</span><input type="range" min="0" v-bind:max="tmax" v-model="timeindex" />
    </div>
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
      imscVersion: 'https://unpkg.com/imsc@1.1.0-beta.2/build/umd/imsc.all.min.js',
    };
  },
  watch: {
    timeindex(newt, oldt) {
      this.vdiv = document.getElementById(this.renderId);
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
        this.imsc.renderHTML(isd, this.vdiv, null, 480, 854);
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
      this.imscVersion = options.version;
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
      }

      this.descriptions = this.descriptions || {};
      if (this.descriptions){
        let descrpath = this.orgfname+'.md';
        let descrpathhtml =  this.orgfname+'.html';
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

        md+= `## Complete file (click expand to see all) (download)[./imscr/${this.orgfname}]\n\n`;
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
            html += `    <img src="./${image}" width="600"/>\n`;
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

    // add an .descr.md file which describes the imscr
    adddescrfile(file, descriptions){
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
      let descs = descriptions.split('\n# ');
      console.log(descs);
      
      this.descriptions = {};
      for (let i = 0; i < descs.length; i++){
        if (descs[i].startsWith('Outline')){
          this.descriptions['outline'] = descs[i].slice('Outline'.length);
        }
        if (descs[i].startsWith('div ')){
          let spl = descs[i].split(/\n|\r\n/);
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
.render {
  border: 1px solid black;
  height: 480px;
  width: 854px;
  background-color: darkgray;
}
.xml {
  max-height: 25vh;
  overflow: scroll;
  border: 2px solid black;
}
h2 {
  margin-bottom: 0;
}
</style>
