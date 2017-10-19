// let debug;
// module.exports = {
//     init: function () {
//         element = document.createElement('div');
//         element.id = 'debug';
//         element.style.position = 'fixed';
//         element.style.zIndex = 9999;
//         element.style.top = 0;
//         element.style.left = 0;
//         element.style.right = 0;
//         element.style.fontSize = '.7em';

//         debug = document.createElement('pre');
//         element.appendChild(debug);

//         document.body.appendChild(element);
//         return this;
//     },
//     output: function (debug) {
//         let delta = debug.delta;
//         let view = debug.view;
//         let world = debug.world;
//         let entity = debug.entity;

//         clear();

//         write(Math.floor((1000 / delta)) + 'fps');

//         // canvas info
//         if (view) {
//             write('viewport');
//             write(JSON.stringify(view, function replacer(key, value) {
//                 // Filtering out properties
//                 if (typeof value === 'function' || typeof value === undefined) {
//                     return value.toString();
//                 }
//                 return value;
//             }, 2));
//         }

//         // world info
//         if (world) {
//             write('world');
//             write(JSON.stringify(world, function replacer(key, value) {
//                 // Filtering out properties
//                 if (typeof value === 'function' || typeof value === undefined) {
//                     return value.toString();
//                 } else if (Array.isArray(value)) {
//                     return 'array';
//                 }
//                 return value;
//             }, 2));
//         }

//         // entity info
//         if (entity) {
//             write('entity');
//             write(JSON.stringify(entity, function replacer(key, value) {
//                 // Filtering out properties
//                 if (typeof value === 'function' || typeof value === undefined) {
//                     return value.toString();
//                 }
//                 return value;
//             }, 2));
//         }
//     }
// }

// function write(text) {
//     let node = document.createTextNode(text + '\n');
//     debug.appendChild(node);
// }

// function clear () {
//     while (debug.hasChildNodes()) {
//         debug.removeChild(debug.lastChild);
//     }
// }