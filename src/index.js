window.xml2js = require('xml2js');
window.xmlbuilder = require('xmlbuilder');

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


