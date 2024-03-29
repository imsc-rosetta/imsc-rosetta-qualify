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
  <div class="fullscreen">
    <div
      class="drop"
      @drop="dropHandler($event)"
      @dragover="dragOverHandler($event)"
    >
      <div class="droptext center">
        <p>Drop .imscr File Here</p>
        <p>{{ xmlfilename }}</p>
      </div>
    </div>
    <!-- Tab links -->
    <div class="tab">
      <button
        :class="'tablinks ' + Qualifyclass"
        @click="open($event, 'Qualify')"
      >
        Qualify File
      </button>
      <button
        :class="'tablinks ' + Renderclass"
        @click="open($event, 'Render')"
      >
        Legacy Render File
      </button>
      <button
        :class="'tablinks ' + RenderPatchedclass"
        @click="open($event, 'RenderPatched')"
      >
        Patched Render File
      </button>
      <button :class="'tablinks ' + Aboutclass" @click="open($event, 'About')">
        About
      </button>
    </div>

    <!-- Tab content -->
    <div class="tabcontent" :style="tab === 'Qualify' ? null : 'display:none;'">
      <display-controller @mounted="mountedQualify"></display-controller>
    </div>

    <div class="tabcontent" :style="tab === 'Render' ? null : 'display:none;'">
      <render-controller @mounted="mountedRender"></render-controller>
    </div>

    <div class="tabcontent" :style="tab === 'RenderPatched' ? null : 'display:none;'">
      <render-controller @mounted="mountedRenderPatched"></render-controller>
    </div>

    <div class="tabcontent" v-if="tab === 'About'">
      <h3>About</h3>
      <p>
        A simple web app to qualify
        <a href="https://github.com/imsc-rosetta" target="_blank"
          >IMSC-Rosetta</a
        >
        by Simon Hailes at
        <a href="https://yellaumbrella.tv" target="_blank">YellaUmbrella</a>
      </p>
      <p>
        This app is a pure javascript application written in VueJS using SFC
        .vue components.
      </p>
      <p>
        The XML parser used is
        <a
          href="https://github.com/Leonidas-from-XIV/node-xml2js"
          target="_blank"
          >xml2js</a
        >
        - the most popular javascript XML library by far.<br />
        The XML output is created using
        <a href="https://github.com/oozcitak/xmlbuilder-js" target="_blank"
          >xmlbuilder</a
        >
        - the most popular javascript XML output library.<br />
        IMSC-rosetta enables the use of simpler XML parsers without complex and
        comprehensive parsing by ensuring certain aspects of XML are
        constrained.
      </p>
      <p>
        Render is by
        <a href="https://github.com/sandflow/imscJS" target="_blank">imscJS</a>,
        Pierre's very competent and comprehensive IMSC renderer.
      </p>
    </div>
  </div>
</template>

<script>
module.exports = {
  components: {
    "display-controller": window.getComponent("display"),
    "render-controller": window.getComponent("render"),
  },

  data: () => {
    return {
      msg: "world!",
      color: "blue",
      logs: "",
      tab: "Qualify",
      Renderclass: "",
      RenderPatchedclass: "",
      Qualifyclass: "active", // default to this tab
      Aboutclass: "",
      xmlfilename: "none",
    };
  },
  methods: {
    open(evt, name) {
      console.log("select tab " + name);
      this.tab = name;
      this.Qualifyclass = "";
      this.RenderPatchedclass = "";
      this.Renderclass = "";
      this.Aboutclass = "";
      this[name + "class"] = "active";
    },

    mountedQualify(name, ptr) {
      //console.log('mountedQualify ', name, ptr);
      if (ptr.init) {
        ptr.init(this.appScope);
        // if it returns a name, then add this 'class' to our this.
      }
      if (name) {
        this[name] = ptr;
        //console.log('added child \'class\' '+name);
      }
    },

    mountedRender(name, ptr) {
      //console.log('mountedRender ', name, ptr);
      if (ptr.init) {
        ptr.init({imsc: window.imsc, version: window.imscVersion, name:'render'});
        // if it returns a name, then add this 'class' to our this.
      }
      if (name) {
        // creates this.render
        this[name] = ptr;
        //console.log('added child \'class\' '+name);
      }
    },

    mountedRenderPatched(name, ptr) {
      //console.log('mountedRender ', name, ptr);
      if (ptr.init) {
        ptr.init({imsc: window.imscmod, version: window.imscmodVersion, name:'renderPatched'});
        // if it returns a name, then add this 'class' to our this.
      }
      if (name) {
        // creates this.renderPatched
        this[name+'Patched'] = ptr;
        //console.log('added child \'class\' '+name);
      }
    },

    dropHandler(ev) {
      ev.preventDefault();
      //console.log('drop');
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === "file") {
            let file = ev.dataTransfer.items[i].getAsFile();
            //console.log('... file[' + i + '].name = ' + file.name);
            let ext = file.name.toLowerCase().split('.').pop();

            switch(ext){
              case 'ttml':
              case 'imsc':
              case 'imscr':
              case 'xml':{
                let reader = new FileReader();
                reader.onload = async (event) => {
                  let parsed;
                  //console.log(event);
                  //console.log('len:'+event.target.result.length);
                  if (this.qualify && this.qualify.processXml) {
                    this.xmlfilename = `${file.name} - ${event.target.result.length} characters`;
                    parsed = await this.qualify.processXml(file, event.target.result);
                  }
                  // uses https://unpkg.com/imsc@1.1.0-beta.2/build/umd/imsc.all.min.js
                  if (this.render && this.render.processXml) {
                    this.xmlfilename = `${file.name} - ${event.target.result.length} characters`;
                    this.render.processXml(file, event.target.result, parsed);
                  }
                  // uses https://github.com/YellaUmbrella-tv/imscJS/tree/tempmaster
                  // fixes boxing and rubies.
                  if (this.renderPatched && this.renderPatched.processXml) {
                    this.xmlfilename = `${file.name} - ${event.target.result.length} characters`;
                    this.renderPatched.processXml(file, event.target.result, parsed);
                  }
                  
                };
                //console.log(file);
                reader.readAsText(file);
              } break;

              case 'md':{
                try {
                  let splt = file.name.toLowerCase().split('.');
                  splt.pop();
                  let desc = splt.pop();
                  if (desc === 'descr'){
                    let reader = new FileReader();
                    reader.onload = (event) => {
                      console.log('read description file',event.target.result);

                      if (this.render && this.render.adddescrfile) {
                        this.render.adddescrfile(file, event.target.result)
                      }
                      if (this.renderPatched && this.renderPatched.adddescrfile) {
                        this.renderPatched.adddescrfile(file, event.target.result)
                      }
                    }
                    reader.readAsText(file);
                  }
                } catch(e){

                }
              } break;
            }
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          //console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
          reader = new FileReader();
          reader.onload = (event) => {
            //console.log(event);
            //console.log('len:'+event.target.result.length);
            if (this.qualify && this.qualify.processXml) {
              this.xmlfilename = `${file.name} - ${event.target.result.length} characters`;
              this.qualify.processXml(file, event.target.result);
            }
            // uses https://unpkg.com/imsc@1.1.0-beta.2/build/umd/imsc.all.min.js
            // fixes boxing and rubies.
            if (this.render && this.render.processXml) {
              this.xmlfilename = `${file.name} - ${event.target.result.length} characters`;
              this.render.processXml(file, event.target.result);
            }
            // uses https://github.com/YellaUmbrella-tv/imscJS/tree/tempmaster
            if (this.renderPatched && this.renderPatched.processXml) {
              this.xmlfilename = `${file.name} - ${event.target.result.length} characters`;
              this.renderPatched.processXml(file, event.target.result);
            }
          };
          //console.log(file);
          reader.readAsText(file);
        }
      }
    },

    dragOverHandler(ev) {
      //console.log('File(s) in drop zone');
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
    },
  },
  mounted() {
    //console.log('mounted');
  },
};
//@ sourceURL=/vue/imsc-rosetta-qualify.vue
</script>

<style scoped>
.drop {
  border: 5px solid blue;
  height: 5%;
  text-align: center;
  position: relative;
  vertical-align: center;
}

.droptext p {
  margin: 0;
}

.fullscreen {
  height: 95%;
}

.example {
  color: v-bind("color");
}

/* Style the tab */
.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

/* Style the buttons that are used to open the tab content */
.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
  position: relative;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
  height: 90%;
  overflow: scroll;
}
input[type="range"] {
  width: 99%;
}
</style>
