

const Model = class Model {
    constructor(options){
        if(options.el == undefined || options.el == ""){
            console.error("please check the 'el' parameter");
        }
        else{
            this.options = options;
            this.objects = this._init();

            this._windowResize();
        }
        
    };

    _init(){
        let container = document.querySelector(this.options.el);
        let scene = new THREE.Scene();
        let clock = new THREE.Clock();
        let camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight,0.1,1000);
        if(this.options.camera !="" && this.options.camera != undefined){
            camera.position.set(this.options.camera[0],this.options.camera[1],this.options.camera[2]);
        }
        else{
            console.error("please check the 'camera' parameter");
        }
        camera.lookAt(scene.position);

        //render
        let renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth,window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.sortObjects = !1;
        container.appendChild(renderer.domElement);


        //add basic light
        if(Array.isArray(this.options.ambientlight) && this.options.ambientlight.length > 1){
            scene.add(new THREE.AmbientLight(this.options.ambientlight[0],this.options.ambientlight[1]));
        }
        else if(typeof this.options.ambientlight == "number"){
            scene.add(new THREE.AmbientLight(this.options.ambientlight));
        }
        else{
            scene.add(new THREE.AmbientLight(0xffffff));
        }
        


        //render and control
        let controls = control();
        render();
        

        //render functions
        function render(){
            window.requestAnimationFrame(render);
            let a = clock.getDelta();
            controls .update(a);
            renderer.render(scene,camera);
        }

        //control function
        function control(){
            let _control = new THREE.OrbitControls(camera);
            _control.rotateSpeed = 0.5;
            _control.enableDamping = true;

            return _control;

        }

        //test axis
       if(this.options.axis == true){
           scene.add(new THREE.AxisHelper(30));
       }

       return {
           container:container,
           scene:scene,
           camera:camera,
           renderer:renderer
       }

    };
    //resize the window
    _windowResize(){
        let _this = this;
        window.addEventListener('resize',function(){
            _this.objects.camera.aspect = window.innerWidth / window.innerHeight;
            _this.objects.camera.updateProjectionMatrix();
            _this. objects.renderer.setSize(window.innerWidth,window.innerHeight);
        },false);
    };

    //add a model
    addModel(url,{scale=1,position=[0,0,0],rotation=[0,0,0]} = {}){
        let loader = new THREE.JSONLoader();
        let _this = this;
        this._loading();
        
        loader.load(
            url,
            function(geometry,materials){
                let material = new THREE.MultiMaterial(materials);
                let mesh = new THREE.Mesh(geometry,material);

                //set the attributes
                mesh.scale.set(scale,scale,scale);
                mesh.position.set(position[0],position[1],position[2]);
                mesh.rotation.set(rotation[0],rotation[1],rotation[2]);

                _this.objects.scene.add(mesh);

                setTimeout(()=>{
                    document.body.removeChild(document.getElementById('loading'));
                },1000);
               
            },
            function(xhr){
                let text = parseInt((xhr.loaded / xhr.total * 100)) + '% loaded';
                document.getElementById('loading').innerHTML = text;
                console.log(text);
                
            }
        )
    };
    addLight(type = null,{color=0xffffff,position=[0,100,0],intensity = 1,distance = 0,angle = Math.PI/3,penumbra = 0,decay = 1}={}){
        switch(type){
            case null:
                console.error("please make sure the type of the light");
            break;
            case 'spotlight':
                let spotlight = new THREE.SpotLight(color);
                spotlight.position.set(position[0],position[1],position[2]);
                spotlight.intensity = intensity;
                spotlight.distance = distance;
                spotlight.angle = angle;
                spotlight.penumbra = penumbra;
                spotlight.decay = decay;
                this.objects.scene.add(spotlight);

                console.log(spotlight);
            break;
            case 'directionlight':
                let directionlight = new THREE.DirectionalLight(color);
                directionlight.position.set(position[0],position[1],position[2]);
                directionlight.intensity = intensity;
                this.objects.scene.add(directionlight);

                console.log(directionlight);
            break;
            case 'pointlight':
            let pointlight = new THREE.PointLight(color);
                pointlight.position.set(position[0],position[1],position[2]);
                pointlight.intensity = intensity;
                pointlight.distance = distance;
                pointlight.decay = decay;
                this.objects.scene.add(pointlight);

                console.log(pointlight);
            break;
        }

        // console.log(type);

    };
    //create loading tips
    _loading(){
        let loading = document.createElement('div');
        loading.id = 'loading';
        loading.style.width = '160px';
        loading.style.height = '60px';
        loading.style.position = 'absolute';
        loading.style.top = '50%';
        loading.style.left = '50%';
        loading.style.margin = '-30px 0 0 -80px';
        loading.style.textAlign = 'center';
        loading.style.lineHeight = '60px';
        loading.style.color = "#34b772";

        document.body.appendChild(loading);

    }
}
