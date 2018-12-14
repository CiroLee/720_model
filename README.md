# How to use


[Demo](https://cirolee.github.io/720_model/index.html)


## install

```html
<script src="js/three.min.js"></script>
<script src="js/JSONLoader.js"></script>
<script src="js/OrbitControls.js"></script>
```
and at the back of the body label
```html
<script src="js/model.js"></script>
```
## use
```js
let model = new Model({   //instantiate a new object
        el:"#wrapper",
        camera:[-50,20,0],
        ambientlight:0xF2F4F8
    });

    model.addModel('model/sculpt.js',{  //add model and set its attribute
        position:[-4,-16,4],
        rotation:[-90*Math.PI/180,0,10*Math.PI/180]
    });
    model.addLight('spotlight',{    //add light and set
        color:0x78AFD7,
        position:[-100,100,50],
        intensity:1,
        distance:160,
        decay:2
    });
    
 ```

