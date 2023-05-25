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
    <h2>Logs</h2>
    <div id="results" class="result"></div>
    <h2>Original XML</h2>
    <div id="xml" class="xml"></div>
    <h2>Full Parse JSON</h2>
    <div id="jsonfull" class="json"></div>
    <h2>Simple Parse JSON</h2>
    <div id="json" class="json"></div>
    <h2>XML round trip from Simple Parse JSON</h2>
    <div id="round" class="xml"></div>
  </div>
</template>

<script>

module.exports = {
  data: () => {
    return {
      errors: {
        textInP: { text: "Text or spaces in p", count: 0 },
        textPlusInS: {
          text: "span contains both text and other elements",
          count: 0,
        },
        invalidAttribute: {
          text: "Invalid Attribute",
          count: 0,
          instances: [],
        },
        invalidAttributeValue: {
          text: "Invalid Attribute Value",
          count: 0,
          instances: [],
        },
        missingAttribute: {
          text: "Invalid Attribute",
          count: 0,
          instances: [],
        },
      },

      // these styles are constants...
      defaultConstantStyles: {
        r_default: {
          "xml:id": "r_default",
          "tts:wrapOption": "noWrap",
          "tts:overflow": "visible",
          "itts:fillLineGap": "false",
          "tts:backgroundColor": "transparent",
          "tts:showBackground": "whenActive",
          "tts:fontStyle": "normal",
          "tts:fontWeight": "normal",
          //"tts:color": "white",
          "tts:fontFamily": "proportionalSansSerif",
          "tts:textAlign": "center",
          style: "_r_default",
          _always: true,
        },
        r_vertical: {
          "xml:id": "r_vertical",
          "tts:writingMode": "tbrl",
          "style": "_r_vertical",
        },
        d_default: {
          "xml:id": "d_default",
          style: "_d_default",
          _always: true,
        },
        d_forced: {
          "xml:id": "d_forced",
          "itts:forcedDisplay": "true",
        },
        d_fillgap: {
          "xml:id": "d_fillgap",
          "itts:fillLineGap": "true",
        },
        d_outline: {
          "xml:id": "d_outline",
          "tts:textOutline": "#000000 0.05em",
        },
        d_drop: {
          "xml:id": "d_drop",
          "tts:textOutline": "#000000 0.05em",
        },

        p_rtl: {
          "xml:id": "p_rtl",
          "tts:direction": "rtl",
        },
        // line alignment
        p_al_start: {
          "xml:id": "p_al_start",
          "tts:textAlign": "start",
        },
        p_al_center: {
          "xml:id": "p_al_center",
          "tts:textAlign": "center",
        },
        p_al_end: {
          "xml:id": "p_al_end",
          "tts:textAlign": "end",
        },
        /*p_al_center: {
            "xml:id": "p_al_center",
            "tts:textAlign": "center",
          },*/
        p_al_start_center: {
          "xml:id": "p_al_start_center",
          "ebutts:multiRowAlign": "center",
          "tts:textAlign": "start",
        },
        p_al_start_end: {
          "xml:id": "p_al_start_end",
          "ebutts:multiRowAlign": "end",
          "tts:textAlign": "start",
        },
        p_al_end_start: {
          "xml:id": "p_al_end_start",
          "ebutts:multiRowAlign": "start",
          "tts:textAlign": "end",
        },
        p_al_end_center: {
          "xml:id": "p_al_end_center",
          "ebutts:multiRowAlign": "center",
          "tts:textAlign": "end",
        },
        p_al_center_start: {
          "xml:id": "p_al_center_start",
          "ebutts:multiRowAlign": "start",
          "tts:textAlign": "center",
        },
        p_al_center_end: {
          "xml:id": "p_al_center_end",
          "ebutts:multiRowAlign": "end",
          "tts:textAlign": "center",
        },

        ps_bg_boxedblack: {
          "xml:id": "ps_bg_boxedblack",
          "tts:backgroundColor": "#000000",
        },
        ps_bg_boxedred: {
          "xml:id": "ps_bg_boxedred",
          "tts:backgroundColor": "#FF0000",
        },
        ps_bg_boxedyellow: {
          "xml:id": "ps_bg_boxedyellow",
          "tts:backgroundColor": "#FF0000",
        },
        ps_bg_boxedgreen: {
          "xml:id": "ps_bg_boxedgreen",
          "tts:backgroundColor": "#00FF00",
        },
        ps_bg_boxedcyan: {
          "xml:id": "ps_bg_boxedcyan",
          "tts:backgroundColor": "#00FFFF",
        },
        ps_bg_boxedblue: {
          "xml:id": "ps_bg_boxedblue",
          "tts:backgroundColor": "#0000FF",
        },
        ps_bg_boxedmagenta: {
          "xml:id": "ps_bg_boxedmagenta",
          "tts:backgroundColor": "#FF00FF",
        },
        ps_bg_boxedwhite: {
          "xml:id": "ps_bg_boxedwhite",
          "tts:backgroundColor": "#FFFFFF",
        },

        ps_bg_ghostboxedblack: {
          "xml:id": "ps_bg_ghostboxedblack",
          "tts:backgroundColor": "#00000080",
        },
        ps_bg_ghostboxedred: {
          "xml:id": "ps_bg_ghostboxedred",
          "tts:backgroundColor": "#FF000080",
        },
        ps_bg_ghostboxedyellow: {
          "xml:id": "ps_bg_ghostboxedyellow",
          "tts:backgroundColor": "#FFFF0080",
        },
        ps_bg_ghostboxedgreen: {
          "xml:id": "ps_bg_ghostboxedgreen",
          "tts:backgroundColor": "#00FF0080",
        },
        ps_bg_ghostboxedcyan: {
          "xml:id": "ps_bg_ghostboxedcyan",
          "tts:backgroundColor": "#00FFFF80",
        },
        ps_bg_ghostboxedblue: {
          "xml:id": "ps_bg_ghostboxedblue",
          "tts:backgroundColor": "#0000FF80",
        },
        ps_bg_ghostboxedmagenta: {
          "xml:id": "ps_bg_ghostboxedmagenta",
          "tts:backgroundColor": "#FF00FF80",
        },
        ps_bg_ghostboxedwhite: {
          "xml:id": "ps_bg_ghostboxedwhite",
          "tts:backgroundColor": "#FFFFFF80",
        },

        s_italic: {
          "xml:id": "s_italic",
          "tts:fontStyle": "italic",
        },
        s_bold: {
          "xml:id": "s_bold",
          "tts:fontWeight": "bold",
        },
        s_underline: {
          "xml:id": "s_underline",
          "tts:textDecoration": "underline",
        },

        s_fg_black: {
          "xml:id": "s_fg_black",
          "tts:color": "#000000",
        },
        s_fg_red: {
          "xml:id": "s_fg_red",
          "tts:color": "#FF0000",
        },
        s_fg_yellow: {
          "xml:id": "s_fg_yellow",
          "tts:color": "#FFFF00",
        },
        s_fg_green: {
          "xml:id": "s_fg_green",
          "tts:color": "#00FF00",
        },
        s_fg_cyan: {
          "xml:id": "s_fg_cyan",
          "tts:color": "#00FFFF",
        },
        s_fg_blue: {
          "xml:id": "s_fg_blue",
          "tts:color": "#0000FF",
        },
        s_fg_magenta: {
          "xml:id": "s_fg_magenta",
          "tts:color": "#FF00FF",
        },
        s_fg_white: {
          "xml:id": "s_fg_white",
          "tts:color": "#FFFFFF",
        },

        s_outlineblack: {
          "xml:id": "s_outlineblack",
          "tts:textOutline": "#000000 0.05em",
        },
        s_outlinered: {
          "xml:id": "s_outlinered",
          "tts:textOutline": "#FF0000 0.05em",
        },
        s_outlineyellow: {
          "xml:id": "s_outlineyellow",
          "tts:textOutline": "#FFFF00 0.05em",
        },
        s_outlinegreen: {
          "xml:id": "s_outlinegreen",
          "tts:textOutline": "#00FF00 0.05em",
        },
        s_outlinecyan: {
          "xml:id": "s_outlinecyan",
          "tts:textOutline": "#00FFFF 0.05em",
        },
        s_outlineblue: {
          "xml:id": "s_outlineblue",
          "tts:textOutline": "#0000FF 0.05em",
        },
        s_outlinemagenta: {
          "xml:id": "s_outlinemagenta",
          "tts:textOutline": "#FF00FF 0.05em",
        },
        s_outlinewhite: {
          "xml:id": "s_outlinewhite",
          "tts:textOutline": "#FFFFFF 0.05em",
        },

        s_dropblack: {
          "xml:id": "s_dropblack",
          "tts:textOutline": "#000000 0.05em",
        },
        s_dropred: {
          "xml:id": "s_dropred",
          "tts:textOutline": "#FF0000 0.05em",
        },
        s_dropyellow: {
          "xml:id": "s_dropyellow",
          "tts:textOutline": "#FFFF00 0.05em",
        },
        s_dropgreen: {
          "xml:id": "s_dropgreen",
          "tts:textOutline": "#00FF00 0.05em",
        },
        s_dropcyan: {
          "xml:id": "s_dropcyan",
          "tts:textOutline": "#00FFFF 0.05em",
        },
        s_dropblue: {
          "xml:id": "s_dropblue",
          "tts:textOutline": "#0000FF 0.05em",
        },
        s_dropmagenta: {
          "xml:id": "s_dropmagenta",
          "tts:textOutline": "#FF00FF 0.05em",
        },
        s_dropwhite: {
          "xml:id": "s_dropwhite",
          "tts:textOutline": "#FFFFFF 0.05em",
        },

        s_noneblack: {
          "xml:id": "s_noneblack",
        },
        s_nonered: {
          "xml:id": "s_nonered",
        },
        s_noneyellow: {
          "xml:id": "s_noneyellow",
        },
        s_nonegreen: {
          "xml:id": "s_nonegreen",
        },
        s_nonecyan: {
          "xml:id": "s_nonecyan",
        },
        s_noneblue: {
          "xml:id": "s_noneblue",
        },
        s_nonemagenta: {
          "xml:id": "s_nonemagenta",
        },
        s_nonewhite: {
          "xml:id": "s_nonewhite",
        },

        s_inline_block: {
          "xml:id": "s_inline_block",
          "tts:display": "inlineBlock",
        },

        p_rb_res_outside: {
          "xml:id": "p_rb_res_outside",
          "tts:rubyReserve": "outside",
        },

        p_shear: {
          "xml:id": "p_shear",
          "tts:shear": "16.67%",
        },

        s_rb_b: {
          "xml:id": "s_rb_b",
          "tts:ruby": "base",
        },
        s_rb_t: {
          "xml:id": "s_rb_t",
          "tts:ruby": "text",
        },

        s_rb_algn_center: {
          "xml:id": "s_rb_algn_center",
          "tts:ruby": "container",
          "tts:rubyAlign": "center",
        },
        s_rb_algn_around: {
          "xml:id": "s_rb_algn_around",
          "tts:ruby": "container",
          "tts:rubyAlign": "spaceAround",
        },

        s_rb_posn_outside: {
          "xml:id": "s_rb_posn_outside",
          "tts:ruby": "container",
          "tts:rubyPosition": "outside",
        },

        s_combine: {
          "xml:id": "s_combine",
          "tts:textCombine": "all",
        },

        s_emf_fco: {
          "xml:id": "s_emf_fco",
          "tts:textEmphasis": "filled circle outside",
        },
        s_emf_fdo: {
          "xml:id": "s_emf_fdo",
          "tts:textEmphasis": "filled dot outside",
        },
        s_emf_fso: {
          "xml:id": "s_emf_fso",
          "tts:textEmphasis": "filled sesame outside",
        },
        s_emf_oco: {
          "xml:id": "s_emf_oco",
          "tts:textEmphasis": "open circle outside",
        },
        s_emf_odo: {
          "xml:id": "s_emf_odo",
          "tts:textEmphasis": "open dot outside",
        },
        s_emf_oso: {
          "xml:id": "s_emf_oso",
          "tts:textEmphasis": "open sesame outside",
        },
      },

      // these styles can be changed...
      // items which are true are required to be present.
      // items which are false are optional.
      defaultChangeableStyles: {
        p_font1: {
          "xml:id": "p_font1",
          "tts:fontFamily": {
            required: true,
            default: "proportionalSansSerif",
          },
          "tts:lineHeight": { required: true, default: "125%", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('%')) return false;
            return true;
          } },
          "tts:fontSize": { required: true, default: "100%", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('%')) return false;
            return true;
          } },
        },
        p_font2: {
          "xml:id": "p_font2",
          "tts:fontFamily": {
            required: true,
            default: "proportionalSansSerif",
          },
          "tts:lineHeight": { required: true, default: "125%", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('%')) return false;
            return true;
          } },
          "tts:fontSize": { required: true, default: "100%", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('%')) return false;
            return true;
          } },
        },

        _d_default: {
          "xml:id": "_d_default",
          style: { required: false, default: "d_outineblack", test:(val)=>{
            if (!val.startsWith("d_")) return false; return true;
          } },
          _always: true,
        },
        _r_quantisationregion: {
          "xml:id": "_r_quantisationregion",
          "tts:origin": { required: true, default: "10% 10%", test: (vals)=>{
            let splt = vals.split(' ');
            if (splt.length !== 2) return false;
            for (let i = 0; i < splt.length; i++){
              let val = splt[i];
              let int = parseFloat(val);
              if (!val.endsWith('%')) return false;
            }
            return true;
          } },
          "tts:extent": { required: true, default: "80% 80%", test: (vals)=>{
            let splt = vals.split(' ');
            if (splt.length !== 2) return false;
            for (let i = 0; i < splt.length; i++){
              let val = splt[i];
              let int = parseFloat(val);
              if (!val.endsWith('%')) return false;
            }
            return true;
          } },
          "tts:fontSize": { required: true, default: "5.333rh", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('rh')) return false;
            return true;
          } },
          "tts:lineHeight": { required: true, default: "125%", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('%')) return false;
            return true;
          } },
          _always: true,
        },
        _r_default: {
          "xml:id": "_r_default",
          "tts:fontSize": { required: true, default: "5.333rh", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('rh')) return false;
            return true;
          } },
          "tts:lineHeight": { required: true, default: "125%", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('%')) return false;
            return true;
          } },
          "ebutts:linePadding": { required: false, default: "0.25c", test: (val)=>{
            let int = parseFloat(val);
            if (!val.endsWith('c')) return false;
            return true;
          } },
          "itts:fillLineGap": { required: false, default: "false", test: (val)=>{
            if (val !== 'true' && val !== 'false') return false;
            return true;
          } },
          style: { required: true, default: "s_fg_white", test:(val)=>{
            let splt = val.split(' ');
            let colour = 0;
            for (let i = splt.length-1; i >= 0; i--){
              let s = splt[i];
              if (s.startsWith("s_fg_")) {splt.pop(); colour++};
              if (s.startsWith("p_al_")) splt.pop();
            }
            if (splt.length) return false;
            if (colour !== 1) return false;
            return true; 
          } },
          _always: true,
        },
        _r_vertical: {
          "xml:id": "_r_vertical",
          "style": { required: true, default: "p_al_center", test:(val)=>{
            if (!val) return true;
            if (!val.startsWith('p_al_')) return false;
            if (val.includes(' ')) return false;
            return true;
          }},
        }
      },

      default_r_quantisationregion: {
        "xml:id": "_r_quantisationregion",
        "tts:origin": "10% 10%",
        "tts:extent": "80% 80%",
        "tts:fontSize": "5.333rh",
        "tts:lineHeight": "125%",
      },

      attributes: {
        tt: {
          optional: [],
          required: [
            "xmlns",
            "xmlns:ttm",
            "xmlns:tts",
            "xmlns:ttp",
            "xmlns:xml",
            "xmlns:ebutts",
            "xmlns:itts",
            "xmlns:rosetta",
            "ttp:timeBase",
            "ttp:cellResolution",
            "xml:space",
            "ttp:frameRate",
            "ttp:frameRateMultiplier",
            "xml:lang",
          ],
          values: {
            xmlns: "http://www.w3.org/ns/ttml",
            "xmlns:ttm": "http://www.w3.org/ns/ttml#metadata",
            "xmlns:tts": "http://www.w3.org/ns/ttml#styling",
            "xmlns:ttp": "http://www.w3.org/ns/ttml#parameter",
            "xmlns:xml": "http://www.w3.org/XML/1998/namespace",
            "xmlns:ebutts": "urn:ebu:tt:style",
            "xmlns:itts": "http://www.w3.org/ns/ttml/profile/imsc1#styling",
            "xmlns:rosetta": "https://github.com/imsc-rosetta/specification",
            "ttp:timeBase": "media",
            "ttp:cellResolution": "30 15",
            "xml:space": "preserve",
          },
        },
        head: {
          optional: [],
          required: [],
        },
        metadata: {
          optional: [],
          required: [],
        },
        layout: {
          optional: [],
          required: [],
        },
        region: {
          optional: [],
          required: [
            "xml:id",
            "tts:extent",
            "tts:origin",
            "tts:displayAlign",
            "style",
          ],
        },
        styling: {
          optional: [],
          required: [],
        },
        style: {
          optional: [
            "style",
            "ebutts:linePadding",
            "tts:lineHeight",
            "tts:fontSize",
            "tts:displayAlign",
            "tts:extent",
            "tts:origin",
            "tts:backgroundColor",
            "tts:showBackground",
            "tts:fontStyle",
            "tts:fontWeight",
            "tts:color",
            "tts:fontFamily",
            "tts:textAlign",
            "itts:fillLineGap",
            "tts:textDecoration",
            "tts:textOutline",
            "itts:forcedDisplay",
            "ebutts:multiRowAlign",
            "tts:ruby",
            "tts:rubyReserve",
            "tts:rubyAlign",
            "tts:rubyPosition",
            "tts:textCombine",
            "tts:shear",
            "tts:textEmphasis",
            "tts:writingMode",
            "tts:direction",
            "tts:wrapOption",
            "tts:overflow",
          ],
          required: ["xml:id"],
        },
        body: {
          optional: [],
          required: [],
        },
        div: {
          warn: ["begin", "end"],
          optional: ["begin", "end", "style"],
          required: ["xml:id", "region"],
        },
        p: {
          optional: [],
          required: ["style"],
        },
        span: {
          optional: ["style"],
          required: [],
        },
      },

      children: {
        tt: {
          required: ["$", "head", "body"],
        },
        "tt-head": {
          required: ["metadata", "styling", "layout"],
        },
        "tt-head-metadata": {
          required: ["rosetta:format", "rosetta:version"],
          optional: ["any"],
        },
        "tt-head-styling": {
          required: ["style"],
        },
        "tt-head-layout": {
          required: ["region"],
        },
        "tt-body": {
          required: ["div"],
        },
        "tt-body-div": {
          optional: ["$", "metadata", "p"],
        },
        "tt-body-div-metadata": {
          optional: ["$"],
        },
        "tt-body-div-p": {
          optional: ["$", "span"],
        },
        "tt-body-div-p-span": {
          optional: ["$", "span", "br", "_"],
        },
        "tt-body-div-p-span-span": {
          optional: ["$", "_"],
        },
      },
    };
  },
  methods: {
    canChangeStyleAttribute:{
      "tts:textOutline": {test:(val)=>{
        // "#000000 0.05em"
        if (!val.startsWith('#')) return false;
        if (!val.endsWith('em')) return false;
        let splt = val.split(' ');
        if (splt.length !== 2) return false;
        let colour = splt[0].slice(1);
        let number = splt[1].slice(0, -2);
        if (number != +number) return false;
        if (colour.length !== 6) return false;
        if (!this.isHexUpper(colour)) return false;
        return true;
      }},
      "tts:color": {test:(val)=>{
        if (!val.startsWith('#')) return false;
        let splt = val.split(' ');
        if (splt.length !== 1) return false;
        val = val.slice(1);
        if (val.length !== 6) return false;
        if (!this.isHexUpper(val)) return false;
        return true;
      }},
      "tts:backgroundColor": {test:(val)=>{
        if (!val.startsWith('#')) return false;
        let splt = val.split(' ');
        if (splt.length !== 1) return false;
        val = val.slice(1);
        if ((val.length !== 6) && (val.length !== 8)) return false;
        if (!this.isHexUpper(val)) return false;
        return true;
      }},
    },



    xmlbuilder() {
      var builder,
        defaults,
        escapeCDATA,
        requiresCDATA,
        wrapCDATA,
        hasProp = {}.hasOwnProperty;

      builder = window.xmlbuilder;

      requiresCDATA = function (entry) {
        return (
          typeof entry === "string" &&
          (entry.indexOf("&") >= 0 ||
            entry.indexOf(">") >= 0 ||
            entry.indexOf("<") >= 0)
        );
      };

      wrapCDATA = function (entry) {
        return "<![CDATA[" + escapeCDATA(entry) + "]]>";
      };

      escapeCDATA = function (entry) {
        return entry.replace("]]>", "]]]]><![CDATA[>");
      };

      let options = {
        headless: false,
        attrkey: "$",
        charkey: "_",
      };

      let buildObject = function (rootObj) {
        var attrkey, charkey, render, rootElement, rootName;
        attrkey = options.attrkey;
        charkey = options.charkey;
        if (Object.keys(rootObj).length === 1) {
          rootName = Object.keys(rootObj)[0];
          rootObj = rootObj[rootName];
        } else {
          rootName = options.rootName;
        }
        render = (function (_this) {
          return function (element, obj) {
            var attr, child, entry, index, key, value;
            if (typeof obj !== "object") {
              if (options.cdata && requiresCDATA(obj)) {
                element.raw(wrapCDATA(obj));
              } else {
                element.txt(obj);
              }
            } else if (Array.isArray(obj)) {
              for (index in obj) {
                if (!hasProp.call(obj, index)) continue;
                child = obj[index];
                for (key in child) {
                  entry = child[key];
                  element = render(element.ele(key), entry).up();
                }
              }
            } else {
              for (key in obj) {
                if (!hasProp.call(obj, key)) continue;
                child = obj[key];
                if (key === attrkey) {
                  if (typeof child === "object") {
                    for (attr in child) {
                      value = child[attr];
                      element = element.att(attr, value);
                    }
                  }
                } else if (key === charkey) {
                  if (options.cdata && requiresCDATA(child)) {
                    element = element.raw(wrapCDATA(child));
                  } else {
                    element = element.txt(child);
                  }
                } else if (Array.isArray(child)) {
                  for (index in child) {
                    if (!hasProp.call(child, index)) continue;
                    entry = child[index];
                    if (typeof entry === "string") {
                      if (options.cdata && requiresCDATA(entry)) {
                        element = element.ele(key).raw(wrapCDATA(entry)).up();
                      } else {
                        element = element.ele(key, entry).up();
                      }
                    } else {
                      element = render(element.ele(key), entry).up();
                    }
                  }
                } else if (typeof child === "object") {
                  element = render(element.ele(key), child).up();
                } else {
                  if (
                    typeof child === "string" &&
                    options.cdata &&
                    requiresCDATA(child)
                  ) {
                    element = element.ele(key).raw(wrapCDATA(child)).up();
                  } else {
                    if (child == null) {
                      child = "";
                    }
                    element = element.ele(key, child.toString()).up();
                  }
                }
              }
            }
            return element;
          };
        })(this);

        //rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, this.options);

        rootElement = builder.create(rootName);
        let inP = 0;
        let addlevel = 0;

        let defaultNewline = "\n";
        let defaultPretty = true;

        // these are used to build XML without pretty inside divs.
        // i.e. so we don't break space-preserve
        let newElement = function (node, options, level) {
          if (addlevel) {
            level = addlevel;
            addlevel = 0;
          }
          // do not insert space before the opening tag of a p node's child
          // or the closing tag of a p node
          if (node && node.name === "p") {
            inP++;
          }
          // revert to original function
          //let proto = Object.getPrototypeOf(this);
          if (inP) {
            //level = 0;
            options.newline = "";
            options.pretty = false;
          }

          let v = this._element(node, options, level);

          if (node && node.name === "p") {
            inP--;
            if (!inP) {
              options.newline = defaultNewline;
              options.pretty = defaultPretty;
              let space = this.indent(node, options, level);
              v = space + v + options.newline;
            }
          }
          return v;
        };

        let xmlbuilderoptions = {
          pretty: defaultPretty,
          indent: " ",
          newline: defaultNewline,
          writer: { element: newElement /*endline: newEndline*/ },
          //async: false,
        };

        let writer = xmlbuilder.stringWriter(xmlbuilderoptions);

        let doc = render(rootElement, rootObj);
        return doc.end(writer);
      };

      return buildObject;
    },

    toHtmlEntities(txt) {
      return txt.replace(/./gm, (s) => {
        return s.match(/[a-z0-9\s]+/i) ? s : "&#" + s.charCodeAt(0) + ";";
      });
    },

    isHexUpper(str) {
      return Boolean(str.match(/^0x[0-9A-F]+$/i))
    },

    clear() {
      let xmlel = document.getElementById("xml");
      xmlel.innerHTML = ``;
      let jsonel = document.getElementById("json");
      jsonel.innerHTML = ``;
      let jsonelfull = document.getElementById("jsonfull");
      jsonelfull.innerHTML = ``;
      let resultsel = document.getElementById("results");
      resultsel.innerHTML = ``;
      let roundel = document.getElementById("round");
      roundel.innerHTML = ``;
    },

    timestart() {
      this.startTime = new Date().valueOf();
    },

    timestamp(text) {
      let html = "";
      html += `<p class="timing">${text} :time:${
        new Date().valueOf() - this.startTime
      }ms`;
      return html;
    },

    async processXml(file, xml) {
      this.clear();

      this.output = "";
      this.timestart();

      let simpleresult;

      let xmlel = document.getElementById("xml");
      xmlel.innerHTML = `<pre>${this.toHtmlEntities(xml)}</pre>`;
      let parseOptionsFull = {
        async: false,
        attrkey: "$",
        charkey: "_",
        explicitCharkey: true,
        includeWhiteChars: true,
        explicitChildren: true,
        charsAsChildren: true,
        preserveChildrenOrder: true,
      };
      let parseOptionsSimple = {
        async: false,
        attrkey: "$",
        charkey: "_",
        explicitCharkey: true,
      };

      this.timestart();
      this.output += this.timestamp("Start FullParse");

      try {
        let result = await this.xml2js.parseStringPromise(xml, parseOptionsFull);
        this.output += this.timestamp("End FullParse");

        //console.log("DoneFull:");
        //console.dir(result);
        // use full parse to check for extra space in p
        this.output += this.timestamp("Start Spaces Check");
        this.testImscRosettaSpaces(file, xml, result);
        this.output += this.timestamp("End Spaces Check");
        let json = JSON.stringify(result, null, " ");
        let jsonel = document.getElementById("jsonfull");
        jsonel.innerHTML = `<pre>${this.toHtmlEntities(json)}</pre>`;
      } catch(err){
        // Failed
        let resultsel = document.getElementById("results");
        resultsel.innerHTML =
          resultsel.innerHTML +
          `<p class="error">Error in Full Parsing: ${err.toString()}</p>`;
        console.error(err);
      }

      this.timestart();
      this.output += this.timestamp("Start SimpleParse");

      try {
        let result = await this.xml2js.parseStringPromise(xml, parseOptionsSimple);
        simpleresult = result;
        this.output += this.timestamp("End SimpleParse");
        //console.log("DoneSimple:");
        //console.dir(result);

        let jsonel = document.getElementById("json");
        this.timestart();
        this.output += this.timestamp("Start Test");
        this.testImscRosetta(file, xml, result);
        this.output += this.timestamp("End Test");

        let json = JSON.stringify(result, null, " ");
        jsonel.innerHTML = `<pre>${this.toHtmlEntities(json)}</pre>`;

        // round trip back to XML
        this.timestart();
        this.output += this.timestamp("Start Export");
        this.processJson(file, result);
        this.output += this.timestamp("End Export");
        let resultsel = document.getElementById("results");
        resultsel.innerHTML = resultsel.innerHTML + this.output;
      } catch(err){
        // Failed
        let resultsel = document.getElementById("results");
        resultsel.innerHTML =
          resultsel.innerHTML +
          `<p class="error">Error in Simple Parsing: ${err.toString()}</p>`;
        console.error(err);
      }

      return simpleresult;
    },

    processJson(file, json) {
      let builder = this.xmlbuilder();
      let newxml = builder(json);
      let roundel = document.getElementById("round");
      roundel.innerHTML = `<pre>${this.toHtmlEntities(newxml)}</pre>`;
    },

    testnodeSpaces(node, divname) {
      let html = "";
      let children = node.$$ || [];
      let isp = node["#name"] === "p";
      let isspan = node["#name"] === "span";

      let hastext = 0;
      let hasother = 0;

      if (node.$ && node.$['xml:id']){
        divname = divname || '';
        if (divname) divname += ','
        divname = divname + node["#name"]+':'+node.$['xml:id'];
      }

      for (let i = 0; i < children.length; i++) {
        let child = children[i];

        if (isp && child["#name"] === "__text__") {
          html += `<p class="error">Text or spaces not allowed in ${divname}:p is [<pre>${child["_"]}</pre>]</p>`;
          this.errors.textInP.count++;
        }

        if (isspan) {
          if (child["#name"] === "__text__") hastext++;
          else hasother++;
        }

        html += this.testnodeSpaces(child, divname);
      }

      if (isspan && hastext && hasother) {
        html += `<p class="error">span contains both text and other elements in ${divname}</p>`;
        this.errors.textPlusInS.count++;
      }
      return html;
    },

    testImscRosettaSpaces(file, xml, json) {
      let resultsel = document.getElementById("results");

      let html = "";

      do {
        html += '<p class="info">Analysing base structure</p>';
        if (!json.tt) {
          html += '<p class="error">No tt element</p>';
          break;
        }
        html += this.testnodeSpaces(json.tt);
      } while (0);

      resultsel.innerHTML = resultsel.innerHTML + html;
    },

    checkstyle(styles, style, eltype, stack) {
      style = style || "";
      let s = style.split(" ");
      let valid = true;
      let invalid = '';
      let unknown = '';
      let pass = true;

      if (undefined === stack){
        stack = [];
      }

      if (stack.length > 10){
        return {invalid:'style depth > 10', unknown:'', pass:false };
      }

      // check for required styles on elements
      switch(eltype){
        case 'region':{
          if (!s.includes('r_default')){
            if (invalid) invalid += ',';
            invalid += 'missing r_default';
          }
        } break;
        case 'div':{
          if (!s.includes('d_default')){
            if (invalid) invalid += ',';
            invalid += 'missing d_default';
          }
        } break;
        case 'p':{
          if (!s.includes('p_font1') && !s.includes('p_font2')){
            if (invalid) invalid += ',';
            invalid += 'missing p_fontN';
          }
          if (s.includes('p_font1') && s.includes('p_font2')){
            if (invalid) invalid += ',';
            invalid += 'both p_font1 and p_font2 specified';
          }
        } break;
        case 'span':{
        } break;
        case 'span_ruby':{
        } break;
        default:
          break;
      }

      for (let i = 0; i < s.length; i++) {
        if (stack.includes(s[i])){
          if (invalid) invalid += ',';
          invalid += 'circular ref to '+s[i];
          continue;
        }

        if (!styles[s[i]]) {
          valid = false;
          if (unknown) unknown += ',';
          unknown += s[i];
        } else {
          switch(eltype){
            case 'region':{
              if (!s[i].startsWith('r_')){
                if (invalid) invalid += ',';
                invalid += s[i];
                continue;
              }
            } break;
            case 'div':{
              if (!s[i].startsWith('d_')){
                if (invalid) invalid += ',';
                invalid += s[i];
                continue;
              }
            } break;
            case 'p':{
              if (!s[i].startsWith('p_') && !s[i].startsWith('ps_')){
                if (invalid) invalid += ',';
                invalid += s[i];
                continue;
              }
            } break;
            case 'span':{
              if (!s[i].startsWith('s_') && !s[i].startsWith('ps_')){
                if (invalid) invalid += ',';
                invalid += s[i];
                continue;
              }
            } break;
            case 'span_ruby':{
              if (!s[i].startsWith('s_') && !s[i].startsWith('ps_')){
                if (invalid) invalid += ',';
                invalid += s[i];
                continue;
              }
            } break;
            default:
              break;
          }
          styles[s[i]]._use = (styles[s[i]]._use || 0) + 1;
          if (styles[s[i]].style) {
            stack.push(s[i]);
            let childinvalid = this.checkstyle(styles, styles[s[i]].style, null, stack);
            stack.pop();
            pass &= childinvalid.pass;
            if (childinvalid.invalid){
              if (invalid) invalid += ',';
              invalid += childinvalid.invalid;
            }
            if (childinvalid.unknown){
              if (unknown) unknown += ',';
              unknown += childinvalid.unknown;
            }
          }
        }
      }
      if (invalid || unknown) pass = false;
      return {invalid, unknown, pass};
    },

    checkAttributes(type, attrs) {
      let attribs = attrs ? Object.keys(attrs) : [];
      let err = "";
      let req = this.attributes[type].required.slice(0);
      let opt = this.attributes[type].optional.slice(0);
      for (let i = 0; i < attribs.length; i++) {
        // ignore our attributes we add..  e.g. '_use'
        if (attribs[i].startsWith('_')) continue;
        let x = req.indexOf(attribs[i]);
        if (x < 0) {
          x = opt.indexOf(attribs[i]);
          if (x < 0) {
            err += `<p class="error">Invalid Attribute ${attribs[i]} found on ${type}</p>`;
            this.errors.invalidAttribute.count++;
            this.errors.invalidAttribute.instances.push(
              `${attribs[i]} on ${type}`
            );
          } else {
            opt.splice(x, 1);
          }
        } else {
          req.splice(x, 1);
        }
        if (
          this.attributes[type].values &&
          this.attributes[type].values[attribs[i]] &&
          this.attributes[type].values[attribs[i]] !== attrs[attribs[i]]
        ) {
          err += `<p class="error">Invalid attribute value for ${attribs[i]} on ${type}<br />`;
          err += `Value is [${attrs[attribs[i]]}] but should be [${
            this.attributes[type].values[attribs[i]]
          }]</p>`;
          this.errors.invalidAttributeValue.count++;
          this.errors.invalidAttributeValue.instances.push(
            `${attribs[i]} on ${type} should be ${
              this.attributes[type].values[attribs[i]]
            } but is ${attrs[attribs[i]]}`
          );
        }
      }
      if (req.length) {
        err += `<p class="error">Missing Attribute(s) ${req.toString()} on ${type}</p>`;
        this.errors.missingAttribute.count++;
        this.errors.missingAttribute.instances.push(
          `${req.toString()} on ${type}`
        );
      }
      return err;
    },

    testStructure(nodes, path) {
      let html = "";
      if (!Array.isArray(nodes)) {
        nodes = [nodes];
      }

      for (let i = 0; i < nodes.length; i++) {
        // parser bug in xml2js
        if (typeof nodes[i] === 'string'){
          nodes[i] = {'_':nodes[i]};
        }
        let node = nodes[i];
        let childnames = Object.keys(node);

        let optional = (this.children[path].optional || []).slice();
        let required = (this.children[path].required || []).slice();
        for (let i = 0; i < childnames.length; i++) {
          let childname = childnames[i];
          let req = required.indexOf(childname);
          if (req === -1 && !optional.includes(childname)) {
            if (!optional.includes["any"]) {
              html += `<p class="error">Child ${childname} not allowed for ${path}</p>`;
            } else {
              html += `<p class="info">Info: Child ${childname} on ${path}</p>`;
            }
          }
          if (req >= 0) required.splice(req, 1);

          let newpath = path + "-" + childname;
          if (this.children[newpath])
            html += this.testStructure(node[childname], newpath);
        }

        if (required.length)
          html += `<p class="error">Required Child(ren) ${required.toString()} missing for ${path}</p>`;
      }
      return html;
    },

    checkTime(b){
      if (b.length !== 12) return undefined;
      let times = b.split(":");
      if (times.length !== 3) return undefined;
      if (times[0].length !== 2) return undefined;
      let hours = +times[0];
      if (isNaN(hours)) return undefined;
      if (times[1].length !== 2) return undefined;
      let mins = +times[1];
      if (isNaN(mins)) return undefined;
      if (times[2].length !== 6) return undefined;
      let spl = times[2].split('.');
      if (spl[0].length !== 2) return undefined;
      let secs = +times[2];
      if (isNaN(secs)) return undefined;
      let t = hours * 60 * 60 + mins * 60 + secs;
      return t;
    }, 

    testImscRosetta(file, xml, json) {
      let resultsel = document.getElementById("results");

      let html = "";
      let pass = true;

      let xmlids = [];
      let xmlidobj = {};
      let styles = {};
      let regions = {};
      let divs = [];

      do {
        html += '<p class="info">Analysing IMSC-Rosetta rules structure</p>';
        if (!json.tt) {
          html += '<p class="error">No tt element</p>';
          break;
        }

        html += this.testStructure(json.tt, "tt");

        html += this.checkAttributes("tt", json.tt.$);

        {
          if (!json.tt.head || json.tt.head.length !== 1) {
            html += '<p class="error">No tt.head element</p>';
            break;
          }
          let h = json.tt.head[0];
          if (h.$) {
            html += '<p class="error">Attributes found on tt.head element</p>';
            break;
          }
          {
            if (!h.metadata || h.metadata.length !== 1) {
              html += '<p class="error">No tt.head.metadata element</p>';
              break;
            }
            let m = h.metadata[0];
            if (!m["rosetta:format"] || m["rosetta:format"].length !== 1) {
              html +=
                '<p class="error">No tt.head.metadata.rosetta:format element</p>';
              break;
            }
            if (m["rosetta:format"][0].$) {
              html +=
                '<p class="error">Attributes on tt.head.metadata.rosetta:format element</p>';
              break;
            }
            if (!m["rosetta:version"] || m["rosetta:version"].length !== 1) {
              html +=
                '<p class="error">No tt.head.metadata.rosetta:version element</p>';
              break;
            }
            if (m["rosetta:version"][0].$) {
              html +=
                '<p class="error">Attributes on tt.head.metadata.rosetta:version element</p>';
              break;
            }
          }
          {
            if (!h.styling || !h.styling.length) {
              html += '<p class="error">No tt.head.styling element</p>';
            }
            let styg = h.styling[0];
            if (styg._) {
              html += '<p class="error">style element has content</p>';
            }
            if (styg.$) {
              html +=
                '<p class="error">Attributes found on tt.head.styling element</p>';
            }
            if (!styg.style || !styg.style.length) {
              html += '<p class="error">No tt.head.styling.style elements</p>';
            } else {
              for (let i = 0; i < styg.style.length; i++) {
                let s = styg.style[i];
                if (s._) {
                  html += '<p class="error">style element has content</p>';
                }
                if (!s.$) {
                  html += '<p class="error">No attributes on style element</p>';
                  this.errors.missingAttribute.count++;
                  this.errors.missingAttribute.instances.push(
                    `No attributes on style`
                  );
                } else {
                  let a = s.$;
                  html += this.checkAttributes("style", a);

                  if (!a["xml:id"]) {
                    html += '<p class="error">No xml:id on style element</p>';
                  } else {
                    if (styles[a["xml:id"]]) {
                      html += '<p class="error">Duplicate style element</p>';
                    }
                    styles[a["xml:id"]] = a;
                    if (xmlidobj[a["xml:id"]])
                      html += `<p class="error">Duplicate xml:id ${a["xml:id"]} on style element</p>`;
                    xmlidobj[a["xml:id"]] = s;
                    xmlids.push(a["xml:id"]);
                  }
                }
              }
              html += `<p class="info">styles found<br />:${Object.keys(
                styles
              ).toString()}</p>`;
            }

            // check referential styles
            let stylenames = Object.keys(styles);
            for (let i = 0; i < stylenames.length; i++) {
              if (styles[stylenames[i]].style) {
                let invalid = this.checkstyle(styles, styles[stylenames[i]].style);
                pass &= invalid.pass;
                if (invalid.unknown){
                  html += `<p class="error">unknown style (${
                    invalid.unknown
                  })on style ${stylenames[i]}</p>`;
                }
                if (invalid.invalid){
                  html += `<p class="error">invalid style (${
                    invalid.invalid
                  })on style ${stylenames[i]}</p>`;
                }
              }
            }

          }

          {
            if (!h.layout || !h.layout.length) {
              html += '<p class="error">No tt.head.layout element</p>';
              break;
            }
            let l = h.layout[0];
            if (l._) {
              html +=
                '<p class="error">text found on tt.head.layout element</p>';
            }
            if (l.$) {
              html +=
                '<p class="error">Attributes found on tt.head.layout element</p>';
            }
            if (!l.region || !l.region.length) {
              html += '<p class="error">No tt.head.layout.regions elements</p>';
            } else {
              for (let i = 0; i < l.region.length; i++) {
                let r = l.region[i];
                if (!r.$) {
                  html +=
                    '<p class="error">No attributes on region element</p>';
                } else {
                  let a = r.$;
                  html += this.checkAttributes("region", a);
                  if (!a["xml:id"]) {
                    html += '<p class="error">No xml:id on region element</p>';
                  } else {
                    if (regions[a["xml:id"]]) {
                      html += '<p class="error">Duplicate region element</p>';
                    }
                    regions[a["xml:id"]] = a;
                    if (xmlidobj[a["xml:id"]])
                      html += `<p class="error">Duplicate xml:id ${a["xml:id"]} on region element</p>`;
                    xmlidobj[a["xml:id"]] = r;

                    xmlids.push(a["xml:id"]);
                    if (a.style) {
                      let invalid = this.checkstyle(styles, a.style, 'region');
                      pass &= invalid.pass;
                      if (invalid.unknown){
                        html += `<p class="error">unknown style (${
                          invalid.unknown
                        })on region ${a["xml:id"]}</p>`;
                      }
                      if (invalid.invalid){
                        html += `<p class="error">invalid style (${
                          invalid.invalid
                        })on region ${a["xml:id"]}</p>`;
                      }
                    }
                  }
                }
              }
              html += `<p class="info">regions found<br />:${Object.keys(
                regions
              ).toString()}</p>`;
            }
          }
        }

        {
          let lastBegin = 0;
          if (!json.tt.body || json.tt.body.length !== 1) {
            html += '<p class="error">No tt.body element</p>';
            break;
          }
          let b = json.tt.body[0];
          if (b._) {
            html +=
              '<p class="error">non whitespace text on tt.body element</p>';
          }
          if (b.$) {
            html += '<p class="error">Attributes on tt.body element</p>';
          }
          if (!b.div || !b.div.length) {
            html += '<p class="warn">no tt.body.div elements - Empty file?</p>';
          } else {
            for (let i = 0; i < b.div.length; i++) {
              let d = b.div[i];
              let a = d.$;
              if (!a) {
                html += '<p class="error">No attributes on div element</p>';
                a = {};
              }
              html += this.checkAttributes("div", a);
              if (d._) {
                html +=
                  '<p class="error">non whitespace text in div element</p>';
              }

              id = a["xml:id"] || "unknown";

              if (id === "unknown") {
                html += '<p class="error">No xml:id on div element</p>';
              } else {
                divs.push(id);
                if (xmlidobj[a["xml:id"]])
                  html += `<p class="error">Duplicate xml:id ${a["xml:id"]} on div element</p>`;
                xmlidobj[a["xml:id"]] = d;
                xmlids.push(id);
              }

              let begin;
              let end;
              if (!a.begin)
                html += `<p class="warn">missing begin on div ${id}</p>`;
              else {
                begin = this.checkTime(a.begin);
                if (isNaN(begin))
                  html += `<p class="warn">begin ${a.begin} not NN:NN:NN.NNN on div ${id}</p>`;
                else {
                  if (begin < lastBegin)
                    html += `<p class="warn">begin ${a.begin} less than previous on div ${id}</p>`;
                  lastBegin = begin;
                }
              }
              if (!a.end)
                html += `<p class="warn">missing end on div ${id}</p>`;
              else {
                end = this.checkTime(a.end);
                if (isNaN(end))
                  html += `<p class="warn">end ${a.end} not NN:NN:NN.NNN on div ${id}</p>`;
                else 
                  if (end < begin)
                    html += `<p class="warn">end ${a.end} less than begin ${a.begin} on div ${id}</p>`;
              }
              if (!a.region)
                html += `<p class="error">missing region on div ${id}</p>`;
              else {
                if (!regions[a.region])
                  html += `<p class="error">unknown region (${a.region}) on div ${id}</p>`;
                else {
                  regions[a.region]._use = (regions[a.region]._use || 0) + 1;
                }
              }
              if (!a.style)
                html += `<p class="warn">missing style on div ${id}</p>`;
              else {
                let invalid = this.checkstyle(styles, a.style, 'div');
                pass &= invalid.pass;
                if (invalid.unknown){
                  html += `<p class="error">unknown style (${
                    invalid.unknown
                  })on div ${id}</p>`;
                }
                if (invalid.invalid){
                  html += `<p class="error">invalid style (${
                    invalid.invalid
                  })on div ${id}</p>`;
                }
              }

              if (!d.p || !d.p.length) {
                html += `<p class="warn">no tt.body.div.p on div ${id} - Empty subtitle?</p>`;
                break;
              }
              for (let j = 0; j < d.p.length; j++) {
                let p = d.p[j];
                if (!p.$) {
                  html += `<p class="error">missing attributes on p in div ${id}</p>`;
                } else {
                  let pa = p.$;
                  html += this.checkAttributes("p", pa);
                  if (!pa.style)
                    html += `<p class="error">missing style on p in div ${id}</p>`;
                  else {
                    let invalid = this.checkstyle(styles, pa.style, 'p');
                    pass &= invalid.pass;
                    if (invalid.unknown){
                      html += `<p class="error">unknown style (${
                        invalid.unknown
                      }) on p in div ${id}</p>`;
                    }
                    if (invalid.invalid){
                      html += `<p class="error">invalid style (${
                        invalid.invalid
                      }) on p in div ${id}</p>`;
                    }
                  }
                }
                if (undefined !== p._)
                  html += `<p class="error">p contains text in div ${id}</p>`;

                if (p.br)
                  html += `<p class="error">p contains br - br ahouls be wrapped in a span - in div ${id}</p>`;

                if (!p.span || !p.span.length) {
                  html += `<p class="warn">p contains no spans in div ${id}</p>`;
                } else {
                  for (let s1 = 0; s1 < p.span.length; s1++) {
                    let sp1 = p.span[s1];
                    let as1 = sp1.$;

                    if (as1) {
                      html += this.checkAttributes("span", as1);
                      if (!as1.style)
                        html += `<p class="error">empty style in span on div ${id}</p>`;
                      else {
                        let invalid = this.checkstyle(styles, as1.style, 'span');
                        if (invalid.unknown){
                          html += `<p class="error">unknown style (${
                            invalid.unknown
                          }) on span in div ${id}</p>`;
                        }
                        if (invalid.invalid){
                          html += `<p class="error">invalid style (${
                            invalid.invalid
                          }) on span in div ${id}</p>`;
                        }
                      }
                    }

                    if (sp1.br) {
                      if (sp1._)
                        `<p class="error">span wrapping br contains text on div ${id}</p>`;
                      if (as1)
                        `<p class="error">span wrapping br has attributes on div ${id}</p>`;
                      if (sp1.span)
                        `<p class="error">span wrapping br contains spans? on div ${id}</p>`;
                    }

                    if (sp1.span) {
                      let hasruby = false;
                      if (!as1)
                        html += `<p class="error">no attributes on outer nested span on div ${id}</p>`;
                      as1 = as1 || {};
                      let sty = as1.style || "";
                      let stys = sty.split(" ");
                      for (let i = 0; i < stys.length; i++) {
                        // all styles starting with this make a span into a ruby container.
                        if (
                          stys[i].startsWith("s_rb_po") ||
                          stys[i].startsWith("s_rb_al")
                        ) {
                          hasruby = true;
                        }
                      }

                      if (!hasruby) {
                        html += `<p class="error">non-ruby nested span in div ${id}</p>`;
                      }
                      if (undefined !== sp1._) {
                        html += `<p class="error">text in outer of nested spans in div ${id}</p>`;
                      }
                      for (let s2 = 0; s2 < sp1.span.length; s2++) {
                        let sp2 = sp1.span[s2];
                        let as2 = sp2.$;
                        if (!as2)
                          html += `<p class="error">no attributes on inner nested span on div ${id}</p>`;
                        as2 = as2 || {};
                        html += this.checkAttributes("span", as2);
                        if (!as2.style)
                          html += `<p class="error">empty style in ruby span on div ${id}</p>`;
                        let sty = as2.style || "";
                        let stys = sty.split(" ");
                        let hasruby = false;
                        for (let i = 0; i < stys.length; i++) {
                          // all styles starting with this make a span into a ruby container.
                          if (stys[i] == "s_rb_b" || stys[i] == "s_rb_t") {
                            hasruby = true;
                          }
                        }
                        if (!hasruby)
                          html += `<p class="error">nested ruby span should be s_rb_b or s_rb_t on div ${id}</p>`;
                        let invalid = this.checkstyle(styles, as2.style, 'span_ruby');
                        if (invalid.unknown){
                          html += `<p class="error">unknown style (${
                            invalid.unknown
                          }) on ruby span in div ${id}</p>`;
                        }
                        if (invalid.invalid){
                          html += `<p class="error">invalid style (${
                            invalid.invalid
                          }) on ruby span in div ${id}</p>`;
                        }
                        if (sp2.span) {
                          html += `<p class="error">double nested span in div ${id}</p>`;
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          // check xml:id are all unique - again
          let xmlidobj2 = {};
          for (let i = 0; i < xmlids.length; i++) {
            if (xmlidobj2[xmlids[i]]) {
              html += `<p class="error">duplicate xml:id ${xmlids[i]}</p>`;
            }
            xmlidobj2[xmlids[i]] = true;
          }

          html += `<p class="info">divs found<br />:${divs.toString()}</p>`;
        }

        html += '<p class="info">Analysing Styles</p>';
        var v = this.validateStyles(styles);
        html += v.html;
        pass &= v.pass;
        html += '<p class="info">Analysing Regions</p>';
        html += this.validateRegions(regions, styles);
      } while (0);
      resultsel.innerHTML = resultsel.innerHTML + html;

      return pass;
    },

    validateStyles(styles) {
      let pass = true;
      let html = "";
      let constantStyleNames = Object.keys(this.defaultConstantStyles);
      for (let i = 0; i < constantStyleNames.length; i++) {
        if (this.defaultConstantStyles[constantStyleNames[i]]._always){
          if (!styles[constantStyleNames[i]]){
            html += `<p class="error">Missing required constant style ${constantStyleNames[i]}</p>`;
            pass = false;
          }
        }
      }

      let changeableStyleNames = Object.keys(this.defaultChangeableStyles);
      for (let i = 0; i < changeableStyleNames.length; i++) {
        if (this.defaultChangeableStyles[changeableStyleNames[i]]._always){
          if (!styles[changeableStyleNames[i]]){
            html += `<p class="error">Missing required changeable style ${changeableStyleNames[i]}</p>`;
            pass = false;
          }
        }
      }

      if (styles['_r_quantisationregion'] && styles['_r_quantisationregion']._use){
        html += `<p class="error">style _r_quantisationregion must not be referenced</p>`;
        pass = false;
      }

      let stylenames = Object.keys(styles);
      for (let i = 0; i < stylenames.length; i++) {
        let n = stylenames[i];
        let s = Object.assign({}, styles[n]);

        if (!s._use) {
          if (n !== '_r_quantisationregion')
          html += `<p class="warn">unused style ${n}</p>`;
        }

        let checkextras = true;
        if (this.defaultConstantStyles[n]) {
          let keys1 = Object.keys(s);
          let keys2 = Object.keys(this.defaultConstantStyles[n]);
          for (let i = 0; i < keys2.length; i++) {
            if (!keys2[i].startsWith("_")) {
              if (undefined === s[keys2[i]]) {
                html += `<p class="error">missing attribute on style ${n} : ${
                  keys2[i]
                }="${this.defaultConstantStyles[n][keys2[i]]}"</p>`;
                pass = false;
              } else {
                if (!this.canChangeStyleAttribute[keys2[i]]){
                  if (this.defaultConstantStyles[n][keys2[i]] !== s[keys2[i]]) {
                    html +=
                      `<p class="error">incorrect attribute on style ${n} :  - should be ` +
                      `${keys2[i]}="${
                        this.defaultConstantStyles[n][keys2[i]]
                      }" but is ${keys2[i]}="${s[keys2[i]]}"</p>`;
                    pass = false;
                  }
                } else {
                  if (!this.canChangeStyleAttribute[keys2[i]].test(s[keys2[i]])){
                    `<p class="error">invalid attribute on style ${n}: value ${keys2[i]}="${s[keys2[i]]}"</p>`;
                    pass = false;
                  }
                }
              }
              delete s[keys2[i]];
            }
          }
        } else {
          if (this.defaultChangeableStyles[n]) {
            let keys1 = Object.keys(s);
            let keys2 = Object.keys(this.defaultChangeableStyles[n]);
            for (let i = 0; i < keys2.length; i++) {
              if (!keys2[i].startsWith("_")) {
                if (undefined === s[keys2[i]]) {
                  // attribute is not present
                  if (
                    this.defaultChangeableStyles[n][keys2[i]].required
                  ) {
                    html += `<p class="error">missing required attribute on changeable style ${n} : ${keys2[i]}</p>`;
                    pass = false;
                  } else {
                    html +=
                      `<p class="warn">missing optional attribute on changeable style ${n} : it could be more explicit,` +
                      ` e.g. ${keys2[i]}="${
                        this.defaultChangeableStyles[n][keys2[i]].default
                      }"</p>`;
                  }
                } else {
                  //attribute is present
                  if (this.defaultChangeableStyles[n][keys2[i]].test){
                    if (!this.defaultChangeableStyles[n][keys2[i]].test(s[keys2[i]])){
                      if (this.defaultChangeableStyles[n][keys2[i]].required){
                        html += `<p class="error">required attribute ${keys2[i]} on changeable style ${n}: value ${s[keys2[i]]} is not valid</p>`;
                        pass = false;
                      } else {
                        html += `<p class="error">optional attribute ${keys2[i]} on changeable style ${n}: value ${s[keys2[i]]} is not valid</p>`;
                        pass = false;
                      }
                    }
                  }
                }
                delete s[keys2[i]];
              } else {
                // attribute starts with _, therefore a control for us
              }
            }
          } else {
            html += `<p class="error">invalid style name ${n}</p>`;
            pass = false;
            checkextras = false;
          }
        }
        if (checkextras) {
          let keys2 = Object.keys(s);
          for (let i = 0; i < keys2.length; i++) {
            if (!keys2[i].startsWith("_")) {
              html += `<p class="error">extra attribute on style ${n} : ${
                keys2[i]
              }="${s[keys2[i]]}"</p>`;
              delete s[keys2[i]];
              pass = false;
            }
          }
        }
      }
      return {html, pass};
    },

    getRegionVars(r, ignoreDisplayAlign) {
      let xy = r["tts:origin"].split(" ");
      let wh = r["tts:extent"].split(" ");
      let errors = "";

      if (xy.length !== 2 || !xy[0].endsWith("%") || !xy[1].endsWith("%")) {
        errors += " invalid origin ";
      }
      if (wh.length !== 2 || !wh[0].endsWith("%") || !wh[1].endsWith("%")) {
        errors += " invalid extent ";
      }
      if (r["tts:fontSize"] && !r["tts:fontSize"].endsWith("rh")) {
        errors += " invalid fontSize ";
      }
      if (r["tts:lineHeight"] && !r["tts:lineHeight"].endsWith("%")) {
        errors += " invalid lineHeight ";
      }

      if (!ignoreDisplayAlign){
        if (
          r["tts:displayAlign"] !== "after" &&
          r["tts:displayAlign"] !== "before"
        ) {
          errors += " invalid displayAlign ";
        }
      }
      let values = {
        top: parseFloat(xy[1]),
        left: parseFloat(xy[0]),
        width: parseFloat(wh[0]),
        height: parseFloat(wh[1]),
        displayAlign: r["tts:displayAlign"],
        errors: errors,
        _use: r._use,
      };

      if (r["tts:fontSize"]) {
        values.fontSize = parseFloat(r["tts:fontSize"]) / 100;
      }
      if (r["tts:lineHeight"]) {
        values.lineHeight = parseFloat(r["tts:lineHeight"]) / 100;
      }

      return values;
    },

    validateRegions(regions, styles) {
      let html = "";
      let regionnames = Object.keys(regions);

      let baseregion = styles["_r_quantisationregion"];
      if (!baseregion) {
        html += `<p class="error">style _r_quantisationregion is not defined</p>`;
        baseregion = this.default_r_quantisationregion;
      }

      let base = this.getRegionVars(baseregion, true);
      if (base.errors) {
        html += `<p class="error">style _r_quantisationregion invalid: ${base.errors}</p>`;
      }

      // line height based on fontSize and lineheight which are ratios.
      // turn into percent
      let baseLineHeight = base.fontSize * base.lineHeight * 100;

      // calculate the number of lines on the screen.
      let linesCount = base.height / baseLineHeight;
      let linesCountInt = Math.round(linesCount);
      if (Math.abs(linesCount - linesCountInt) > 0.1) {
        html += `<p class="error">base _r_quantisationregion line count (${linesCount} to ${linesCountInt} differs by > 10%) calculation is not near integer</p>`;
      }

      // calculate the number of lines on the screen.
      let colsCount = (base.width / baseLineHeight) * (16/9);
      let colsCountInt = Math.round(colsCount);
      if (Math.abs(colsCount - colsCountInt) > 0.1) {
        //html += `<p class="error">base _r_quantisationregion cols count (${colsCount} to ${colsCountInt} differs by > 10%) calculation is not near integer</p>`;
      }

      for (let i = 0; i < regionnames.length; i++) {
        let n = regionnames[i];
        let r = this.getRegionVars(regions[n]);
        if (r.errors) {
          html += `<p class="error">region ${n} invalid: ${r.errors}</p>`;
        }

        // check for 3 edges the same as the base region
        let countsame = 0;
        let v = "none";
        if (Math.abs(r.left - base.left) < 1) countsame++;
        else v = "left";
        if (Math.abs(r.top - base.top) < 1) countsame++;
        else v = "top";
        if (Math.abs(r.left + r.width - (base.left + base.width)) < 1)
          countsame++;
        else v = "right";
        if (Math.abs(r.top + r.height - (base.top + base.height)) < 1)
          countsame++;
        else v = "bottom";

        if (countsame < 3) {
          html += `<p class="error">region ${n} does not share 3 or 4 edges with _r_quantisationregion</p>`;
        }

        // check quantisation of the positioning, based on BASE REGION, NOT on p fontsize!!!
        switch (v) {
          case "left":
            {
              if (r.displayAlign !== "after")
                html += `<p class="error">region ${n} left is modified yet displayAlign not after?</p>`;
            }
            break;
          case "top":
            {
              if (r.displayAlign !== "before")
                html += `<p class="error">region ${n} top is modified yet displayAlign not before?</p>`;
              let linesCount = r.height / baseLineHeight;
              let linesCountInt = Math.round(linesCount);
              if (Math.abs(linesCount - linesCountInt) > 0.1) {
                html += `<p class="error">region ${n} line count (${linesCount} to ${linesCountInt} differs by > 10%) calculation is not near integer</p>`;
              }
            }
            break;
          case "right":
            {
              if (r.displayAlign !== "before")
                html += `<p class="error">region ${n} right is modified yet displayAlign not before?</p>`;
            }
            break;
          case "bottom":
            {
              if (r.displayAlign !== "after")
                html += `<p class="error">region ${n} bottom is modified yet displayAlign not after?</p>`;
              let linesCount = r.height / baseLineHeight;
              let linesCountInt = Math.round(linesCount);
              if (Math.abs(linesCount - linesCountInt) > 0.1) {
                html += `<p class="error">region ${n} line count (${linesCount} to ${linesCountInt} differs by > 10%) calculation is not near integer</p>`;
              }
            }
            break;
        }

        if (!r._use) {
          html += `<p class="warn">unused region ${n}</p>`;
        }
      }

      if (regionnames.length > this.maxregions) {
        html += `<p class="warn">more than ${this.maxregions} regions defined ${regionnames.length} - is this excessive?</p>`;
      }
      return html;
    },
  },
  mounted() {
    this.$emit("mounted", "qualify", this);
    //console.log("mounted controller");
    this.xml2js = window.xml2js;
  },
  destroyed() {
    clearInterval(this.interval);
  },
};
//@ sourceURL=/vue/display.vue
</script>

<style scoped>
h2 {
  margin-bottom: 0;
}
.xml {
  max-height: 25vh;
  overflow: scroll;
  border: 2px solid black;
}
.json {
  max-height: 25vh;
  overflow: scroll;
  border: 2px solid black;
}
.result {
  max-height: 25vh;
  overflow: scroll;
  border: 2px solid black;
}

.info {
  padding: 0;
  margin: 0;
}
.warn {
  color: orange;
  padding: 0;
  margin: 0;
}
.error {
  color: red;
  padding: 0;
  margin: 0;
}

.timing {
  color: aqua;
  padding: 0;
  margin: 0;
}
</style>
