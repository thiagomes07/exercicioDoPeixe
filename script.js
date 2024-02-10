var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var santosShark;
var santos;
var corinthians;
var logoInteli;

var backgroundImages = ["vilaBelmiro1", "vilaBelmiro2", "vilaBelmiro3"];
var currentBackgroundIndex = 0;

var otherTeamImages = ["palmeiras.png", "saoPaulo.png", "corinthians.png"];
var currentTeamIndex = 0;

var backgroundTimer;
var backgroundMusic;

var h1Element = document.getElementById("cont");
var eatTeamCount = 0;

function preload() {
  // Carrega as imagens de fundo
  for (var i = 0; i < backgroundImages.length; i++) {
    this.load.image(
      backgroundImages[i],
      "assets/backgrounds/" + backgroundImages[i] + ".jpg"
    );
  }

  // Carrega a logo do Inteli
  this.load.image("logoInteli", "assets/images/inteli.png");

  // Carrega o tubarão do santos
  this.load.image("santosShark", "assets/images/santosShark.png");

  // Carrega o escudo do santos
  this.load.image("santos", "assets/images/santos.png");

  // Carrega o escudo do corinthians
  this.load.image("corinthians", "assets/images/corinthians.png");

  // Carrega as imagens dos outros times
  for (var i = 0; i < otherTeamImages.length; i++) {
    this.load.image(otherTeamImages[i], "assets/images/" + otherTeamImages[i]);
  }

  // Carrega a música
  this.load.audio("backgroundMusic", "assets/music/hinoDoSantos.mp3");
}

function create() {
  // Define o background dinâmico inicial de acordo com o index backgorund atual
  this.currentBackground = this.add.image(
    400,
    300,
    backgroundImages[currentBackgroundIndex]
  );

  // Define o escudo do corinthians
  corinthians = this.add.image(750, 50, "corinthians");
  corinthians.setInteractive(); // Habilita a interação com o escudo do corinthians

  // Define o escudo do santos
  santos = this.add.image(510, 550, "santos").setScale(0.12);

  // Define o logo do Inteli
  logoInteli = this.add.image(360, 550, "logoInteli").setScale(0.6);

  // Define o tubarão do santos
  santosShark = this.add
    .image(400, 300, "santosShark")
    .setScale(0.8)
    .setOrigin(0.5, 0.5);
  santosShark.setFlip(true, false);

  // Inicia a música
  backgroundMusic = this.sound.add("backgroundMusic");
  backgroundMusic.play({ loop: true }); // Define loop como true para repetir a música

  // Configura o temporizador para trocar a imagem de fundo a cada 5000 milissegundos (5 segundos)
  backgroundTimer = this.time.addEvent({
    delay: 5000,
    loop: true,
    callback: changeBackground,
    callbackScope: this,
  });

  // Adiciona o evento de interação ao escudo do corinthians
  corinthians.on("pointerover", function () {
    // Esconde o escudo do corinthians
    corinthians.setVisible(false);

    // Alterna entre as imagens dos outros times
    currentTeamIndex = (currentTeamIndex + 1) % otherTeamImages.length;

    // Define uma nova posição aleatória para a imagem do time atual
    corinthians.setPosition(
      Phaser.Math.Between(0, 800),
      Phaser.Math.Between(0, 600)
    );

    // Atualiza a imagem do escudo para o time atual
    corinthians.setTexture(otherTeamImages[currentTeamIndex]);

    // Soma ao contador de vezes em que o cursor passa por cima dos outros escudos de time
    eatTeamCount++
    h1Element.innerHTML = eatTeamCount

    // Torna a imagem do time atual visível novamente
    corinthians.setVisible(true);
  });
}

function update() {
  // Verifica se o cursor está sobre o escudo do corinthians
  if (
    Phaser.Geom.Rectangle.Contains(
      corinthians.getBounds(),
      this.input.x,
      this.input.y
    )
  ) {
    corinthians.setVisible(false); // Oculta o escudo do corinthians
  } else {
    corinthians.setVisible(true); // Torna o escudo do corinthians visível
  }

  santosShark.x = this.input.x;
  santosShark.y = this.input.y;
}

function changeBackground() {
  // Remove a imagem de fundo atual
  this.currentBackground.destroy();

  // Avança para a próxima imagem de fundo
  currentBackgroundIndex =
    (currentBackgroundIndex + 1) % backgroundImages.length;

  // Define a nova imagem de fundo
  this.currentBackground = this.add.image(
    400,
    300,
    backgroundImages[currentBackgroundIndex]
  );

  // Define a ordem de exibição para garantir que santosShark e logoInteli apareçam acima da imagem de fundo
  this.children.bringToTop(corinthians);
  this.children.bringToTop(santos);
  this.children.bringToTop(logoInteli);
  this.children.bringToTop(santosShark);
}
