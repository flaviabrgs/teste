//C18 variaveis pre deifinidas para mudar a tela e array
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;

var imgFimDeJogo,imgReiniciar

var somSalto, somMorte, somCheckPoint;


function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  imgReiniciar = loadImage("restart.png")
  imgFimDeJogo = loadImage("gameOver.png")
  
  
  somSalto = loadSound("jump.mp3")
  somMorte = loadSound("die.mp3")
  somCheckPoint = loadSound("checkPoint.mp3")
  
  
}

function setup() {
  //c18 mudar largura para as variáveis pre definidas
  createCanvas(windowWidth, windowHeight);
  
  //mudar altura do TREX
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" ,trex_colidiu);
  trex.scale = 0.5;
  
  

  //mudar altura solo
  solo = createSprite(width-50, height-30, 400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
 //Dividir larguta do item por 2 e dividir a largura da tela por 2
  fimDeJogo = createSprite(width/2, height/2);
  fimDeJogo.addImage(imgFimDeJogo);
  
 //Dividir larguta do item por 2 e dividir a largura da tela por 2
  reiniciar = createSprite(width/2, height/2 -50);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.5;
    
 //MUDAR ALTURA E LARGURA DO SOLO INVISIVEL 
  soloinvisivel = createSprite(width/2,height-10,width,10);
  soloinvisivel.visible = false;
   
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  trex.setCollider("circle",0,0,40);
  //trex.debug = true
  
  pontuacao = 0;
  
  //C16- declarar variavel chamar aqui e depois na draw() e analisar
  //var mensagem = "Isso é uma mensagem"
  
}

function draw() {
  
  background(180);
  text("Pontuação: "+ pontuacao, 500,50);
   
  //c-16 
  //console.log(mensagem);
    
  //console.log("isto é ",estadoJogo)
  
  //console.log(frameRate())
  if(estadoJogo === JOGAR){
    fimDeJogo.visible = false
    reiniciar.visible = false
    
    //C16 -Mudar a profundidade para o reiniciar ficar na frente 
    grupodeobstaculos.depth = reiniciar.depth;
    reiniciar.depth = reiniciar.depth + 1;
    
    //c16 - atualizar o framCount para frameRate()
    solo.velocityX = -(2 + 3* pontuacao/200);
    pontuacao = pontuacao + Math.round(frameRate()/60);
    
    
    
    if(pontuacao > 0 && pontuacao % 300 == 0){
       somCheckPoint.play();
    }
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    
  /*acrescentar condição para identificar o touch do celular*/
    if(touches.lenght >0 || keyDown("space")&& trex.y >= 600) {
       trex.velocityY = -12;
       somSalto.play();
       touches = [];
  }
  
  console.log(trex.y)
    trex.velocityY = trex.velocityY + 0.8
   
    gerarNuvens();
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;   
      somMorte.play();
    }
  }
     else if (estadoJogo === ENCERRAR) {
      
            
      fimDeJogo.visible = true;
      reiniciar.visible = true;
     
      solo.velocityX = 0;
      trex.velocityY = 0
       
    trex.changeAnimation("collided", trex_colidiu);
     
     grupodeobstaculos.setLifetimeEach(-1);
     grupodenuvens.setLifetimeEach(-1);
     
     grupodeobstaculos.setVelocityXEach(0);
     grupodenuvens.setVelocityXEach(0);   
       
       
         //C16- MOVER CONDICIONAL PARA ESTADOjOGO ENCERRAR
//c16 -mousepressedover para o clique no reiniciar/chamar função
        if(mousePressedOver(reiniciar)){
         //teste- console.log("reiniciar jogo")

           reset();
       }
    }
    
   trex.collide(soloinvisivel);

  
  
  drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   
   //MUDAR ALTURA  E LARGURA DOS OBSTACULOS
   var obstaculo = createSprite(width, height-30, 10, 40);
   //aumentar velocidade do obst alterando
  obstaculo.velocityX = -(4 + pontuacao/200);
      
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
           
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
   
    
    grupodeobstaculos.add(obstaculo);
 }
}

function gerarNuvens() {
   
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    
    //MUDAR ALEATORIEDADE DAS NUVENS ATÉ 300
    nuvem.y = Math.round(random(10,300));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
    nuvem.lifetime = 134; 

    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
  
   grupodenuvens.add(nuvem);
    
      }
}

//C16 - função para restartar o jogo
function reset(){
  //APENAS UM SINAL DE = PARA MUDAR O VALOR DA VARIÁVEL
  estadoJogo = JOGAR;
  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  //destruir as nuvens e obstaculos quando clicado no reset
  grupodenuvens.destroyEach();
  grupodeobstaculos.destroyEach();
  
  //mudar a animação para trex correndo
  trex.changeAnimation("running", trex_correndo);
  
  //c16- colocar pontuação
  pontuacao = 0;
}
