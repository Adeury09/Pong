
var HelloWorldLayer = cc.Layer.extend({
    jugador1:null,    
    jugador2:null,    
    pelota:null,    
    puntuacion1:null,
    puntuacion2:null,
    fondo:null,
    score1:0,
    score2:0,
    MOVX:0,
    MOVY:0,
    velocidadBola:1,
    
    inicializar:function(){
        var size = cc.winSize;
        var color = cc.color(100,100,100);
        var white = cc.color(255,255,255);
        this.MOVX = this.random(1,3);
        this.MOVY = this.random(1,3);
        this.velocidadBola = this.random(0.0001,0.0001);
        
        this.fondo = new cc.Sprite(res.fondo_png);
        this.fondo.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.fondo,1);
        
        this.jugador1 =  new cc.Sprite(res.player1_png);
        this.jugador1.setScale(0.1,0.3);
        //this.jugador1.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador1.setPosition(size.width * 0.1,size.height / 2);
        this.addChild(this.jugador1, 1);
        
//        var jugador1_action = cc.moveTo(3,jugador1.getPositionX(), -50);
//        jugador1.runAction(jugador1_action);

        this.jugador2 =  new cc.Sprite(res.player2_png);
        this.jugador2.setScale(0.2,0.5);
        //this.jugador2.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador2.setPosition(size.width -(size.width * 0.1),size.height / 2);
        this.addChild(this.jugador2, 1);        

        var lineaDivisoria =  new cc.DrawNode();
        lineaDivisoria.drawSegment(cc.p(size.width/2,0),cc.p(size.width/2,size.height),3,color);
        this.addChild(lineaDivisoria,0);
        
        this.pelota =  new cc.Sprite(res.pelota_png);
        this.pelota.setScale(0.15,0.15);
        //this.pelota.drawCircle(cc.p(0,0),5,0,100,false,10,color);
        this.pelota.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.pelota, 1);

        this.puntuacion1 = new cc.LabelTTF("0","Arial",24);
        this.puntuacion1.setPosition(size.width * 0.4, size.height - (size.height * 0.10));
        this.addChild(this.puntuacion1,0);
        
        this.puntuacion2 = new cc.LabelTTF("0","Arial",24);
        this.puntuacion2.setPosition(size.width - (size.width * 0.4), size.height - (size.height * 0.10));
        this.addChild(this.puntuacion2,0);
        
    },
    
    moveControls: function(keyCode, event){
        
        var target = event.getCurrentTarget();
        var size = cc.winSize;
            
        // Subir jugador 1
        if(keyCode == cc.KEY.w){
            if(target.jugador1.getPositionY() + 40 < size.height - 80)
                target.jugador1.setPosition(target.jugador1.getPositionX(), target.jugador1.getPositionY() + 40);
        }
    //Baja el jugador 1
     if(keyCode == cc.KEY.s){
            if(target.jugador1.getPositionY() - 40 > size.height/2 - size.height/2 + 40)
                target.jugador1.setPosition(target.jugador1.getPositionX(), target.jugador1.getPositionY() - 40);
        }
    //Sube el jugador 2
      if(keyCode == cc.KEY.up){
            if(target.jugador2.getPositionY() + 40 < size.height - 80)
                target.jugador2.setPosition(target.jugador2.getPositionX(), target.jugador2.getPositionY() + 40);
        }
        
    //bajar el jugador 2
    if(keyCode == cc.KEY.down){
            if(target.jugador2.getPositionY() - 40 > size.height/2 - size.height/2 +40)
                target.jugador2.setPosition(target.jugador2.getPositionX(), target.jugador2.getPositionY() - 40);
        }
    },  
    
    random: function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
        
    resetearBola:function(){
        var size = cc.winSize;
        this.velocidadBola = this.random(0.0001,0.001);
        this.pelota.setPosition(size.width / 2, this.random(0, size.height - 80));
        this.MOVX = this.random(1,3);
        this.MOVY = this.random(1,3);
        this.puntuacion1.setString(this.score1);
        this.puntuacion2.setString(this.score2);
    },
        
    //Metodo para mover la pelota
     moverBola: function(){
         var posicion = this.pelota.getPosition();
         
         if(posicion.y <= 20 || posicion.y >= cc.winSize.height - 40){
             this.MOVY *= -1;
             
         }
         else if(posicion.x <= 0){
             this.score2++;
             this.resetearBola();
             
         }
         else if(posicion.x >= cc.winSize.width){
             this.score1++;
             this.resetearBola();
         }
         else if(cc.rectIntersectsRect(this.pelota.getBoundingBox(), this.jugador1.getBoundingBox())){
            cc.log("collision");
            this.MOVX *= -1.3;
            //this.velocidadBola= velocidadBola*-5;
        }
        
        else if(cc.rectIntersectsRect(this.pelota.getBoundingBox(), this.jugador2.getBoundingBox())){
            cc.log("collision");
            this.MOVX *= -1.3; 
            //this.velocidadBola= velocidadBola*-5;
        }
         
        var nuevaX = this.pelota.getPosition().x + this.MOVX;
        var nuevaY = this.pelota.getPosition().y + this.MOVY; 
         
        this.pelota.setPosition(nuevaX, nuevaY);
     },   
        
    collisions: function(){
        
        
    },
    
    ctor:function () {
        this._super();
        this.inicializar();
        
        // Schedule Moveball
        this.schedule(this.moverBola, this.velocidadBola);
        
        //Inicializando eventos
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed:  this.moveControls
		}, this);
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

