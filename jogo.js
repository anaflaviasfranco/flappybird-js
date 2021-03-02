
let frames = 0;
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//desenha background
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle =' #70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height);

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

function criaChao() {
  // desenha o chão
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;


      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  
  
  };
  return chao;

}

function fazColisao(flappyBird, chao){
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}
function criaFlappyBird() {
  //desenha o bichinho
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula(){
      flappyBird.velocidade = - flappyBird.pulo; 
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if(fazColisao(flappyBird, globais.chao)) {
        console.log('fez colisao');
        som_HIT.play();

        setTimeout( () => {
          mudaParaTela(Telas.INICIO);
        }, 500);
        return;
      }
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      {spriteX: 0, spriteY: 0, }, // asa pra cima
      {spriteX: 0, spriteY: 26, }, // asa pra cima
      {spriteX: 0, spriteY: 52, }, // asa pra baixo
    ],
    frameAtual: 0,
    atualizaFrameAtual(){
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento +flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao
      }
    },
    desenha() {
      flappyBird.atualizaFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      contexto.drawImage(
        sprites,
        spriteX, spriteY, // sprite x e sprite y
        flappyBird.largura, flappyBird.altura, //tamanho do recorte na sprite (tamanho apenas da area desejada, altura e largura)
        flappyBird.x, flappyBird.y, //posiçao dentro do canvas
        flappyBird.largura, flappyBird.altura, //tamanho no canvas
      );
    },
  };

  return flappyBird;
}


//pagina inicial
const menssagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            menssagemGetReady.spriteX, menssagemGetReady.spriteY,
            menssagemGetReady.largura, menssagemGetReady.altura,
            menssagemGetReady.x, menssagemGetReady.y,
            menssagemGetReady.largura, menssagemGetReady.altura, 
        );
    },
};

//telas
const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela){
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
      telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
      inicializa(){
        globais.flappyBird = criaFlappyBird();
        globais.chao = criaChao();
      },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();
            
            globais.chao.desenha();
            menssagemGetReady.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);

        },
        atualiza() {
          globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
      globais.flappyBird.pula();
    },
    atualiza() {
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
    }
};

function loop() {
  //aqui as ordens importam para nao "sumir" nenhum desenho

  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);
loop();