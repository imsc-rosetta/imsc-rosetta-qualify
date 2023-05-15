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
    <p>ISDs generated: {{ tmax }}</p>
    <div>
      <span>{{ selectedTime }} </span><span>Rendered using: {{imscVersion}}</span><input type="range" min="0" v-bind:max="tmax" v-model="timeindex" />
    </div>
    <div class="xml"><pre v-html="xmlDisplay"></pre></div>
  </div>
</template>

<script>
module.exports = {
  data: () => {
    return {
      tmax: 100,
      timeindex: 0,
      xmlDisplay: "none",
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
              break;
            }
          }
        } else {
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

    processXml(file, xml) {
      //console.log("would render");
      this.getDivs(xml);
      this.doc = this.imsc.fromXML(xml);
      this.t = this.doc.getMediaTimeEvents();
      this.tmax = this.t.length - 1;
      this.timeindex = 0;
      this.timeindex = 1;
      //this.vdiv.innerHTML = '';
      //window.imsc.renderHTML(isd, this.vdiv);
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
