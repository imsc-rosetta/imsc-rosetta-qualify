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


window.xml2js = require('xml2js');
window.xmlbuilder = require('xmlbuilder');
window.imsc = require('imsc');

let rootparts = window.location.href.split('/');
rootparts.pop();
rootparts.push('');
let root = rootparts.join('/');


var s1 = document.createElement('script');
s1.setAttribute('src', root+"lib/vue.min.js");

document.head.appendChild(s1);

s1 = document.createElement('script');
s1.setAttribute('src', root+"lib/httpVueLoader.js");
document.head.appendChild(s1);


window.onload = ()=>{

    console.log(window.xml2js);
    console.log(window.xmlbuilder);

    var appdiv = document.createElement('div');
    appdiv.setAttribute('id',"app");
    appdiv.id = 'app';
    appdiv.style.height = "100vh";
    document.body.appendChild(appdiv);
    let comp = document.createElement('imsc-rosetta-qualify');
    appdiv.appendChild(comp);
    
    window.components = [
        { name:'display', path: root+'vue/display.vue' },
        { name:'render', path: root+'vue/render.vue' },
        { name:'imsc-rosetta-qualify', path: root+'vue/imsc-rosetta-qualify.vue' },
    ];

    let numcomponents = 0;
    
    let addComponent = ()=>{
        let component = httpVueLoader(window.components[numcomponents].path);
        component().then( data =>{
            window.components[numcomponents].data = data;
            numcomponents++;
            if (numcomponents < window.components.length){
                addComponent();
            } else {
                new Vue({
                    el: '#app',
                    components: {
                        'imsc-rosetta-qualify': window.components[numcomponents-1].data
                    }
                });
            }
        });
    }
    
    window.getComponent = (name)=>{
        for (let i = 0; i < numcomponents; i++){
            if (window.components[i].name === name){
                return window.components[i].data;
            }
        }
        return undefined;
    }
    addComponent();
};


