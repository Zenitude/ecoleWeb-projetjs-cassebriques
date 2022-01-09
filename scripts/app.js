// Récupération du body
const body = document.body;

// Création du container principal
const container = document.createElement('div');
container.setAttribute('class', 'container');
body.appendChild(container);

// Création du Titre
const titre = document.createElement('h1');
titre.innerText = 'Le casse-briques';
container.appendChild(titre);

// Création du Canvas
const canvas = document.createElement('canvas');
canvas.setAttribute('width', '600');
canvas.setAttribute('height', '400');
container.appendChild(canvas);

// Création de la partie Score
const score = document.createElement('div');
score.setAttribute('class', 'score');
container.appendChild(score);

const titreScore = document.createElement('span');
titreScore.innerText = 'Score : ';
score.appendChild(titreScore);

const resultScore = document.createElement('span');
let result = 0;
resultScore.innerText = result;
score.appendChild(resultScore);

// Création des variables
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext('2d');

const balleRayon = 10;
const hauteurBarre = 10;
const largeurBarre = 67;
const nbCol = 8;
const nbRow = 8;
const largeurBrique = 67;
const hauteurBrique = 10;

let x = canvasWidth/2;
let y = canvasHeight -8;
let barreX = (canvasWidth - largeurBarre)/2;
let fin = false;
let vitesseX = 5;
let vitesseY = -2;


// Tableau contenant les briques
const tabBriques = [];

for(let i = 0 ; i < nbRow ; i++)
{
    tabBriques[i] = [];

    for(let j = 0 ; j < nbCol ; j++)
    {
        tabBriques[i][j] = 
        {
            x: 0,
            y: 0,
            statut: 1
        }

    }
}

// Construction du jeu
function casseBrique()
{
    if(fin === false)
    {
        ctx.clearRect(0,0, canvasWidth, canvasHeight);
        dessineBriques();
        dessineBalle();
        dessineBarre();
        collision();
        rebond();

        requestAnimationFrame(casseBrique);
    }
}

casseBrique();

// Dessiner la balle
function dessineBalle()
{
    ctx.beginPath();
    ctx.arc(x,y,balleRayon,0,Math.PI*2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
}

// Dessiner la barre qui bouge
function dessineBarre()
{
    ctx.beginPath();
    ctx.rect(barreX, canvasHeight - hauteurBarre - 2, largeurBarre, hauteurBarre);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
}

// Dessiner les briques
function dessineBriques()
{
    for(let i = 0 ; i < nbRow ; i++)
    {
        for(let j = 0 ; j < nbCol ; j++)
        {
            if(tabBriques[i][j].statut === 1)
            {
                let briqueX = (j * (largeurBrique + 5) + 12);
                let briqueY = (i * (hauteurBrique + 2) + 10);

                tabBriques[i][j].x = briqueX;
                tabBriques[i][j].y = briqueY;

                ctx.beginPath();
                ctx.rect(briqueX, briqueY, largeurBrique, hauteurBrique);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Rebond de la balle
function rebond()
{
    //Si la balle touche le côté droit OU le côté gauche
    if(x + vitesseX > canvasWidth - balleRayon || x + vitesseX < balleRayon)
    {
        vitesseX = -vitesseX;
    }

    // Si la balle touche le plafond
    if(y + vitesseY < balleRayon)
    {
        vitesseY = -vitesseY;
    }

    // Si on touche le sol
    if(y + vitesseY > canvasHeight - balleRayon)
    {
        // On rebondit si on touche la barre
        if(x > barreX && x < barreX + largeurBarre)
        {
            vitesseX = vitesseX + 0.1;
            vitesseY = vitesseY + 0.1;
            vitesseY = -vitesseY;
        }
        else
        {
            // On perd si on dépasse la barre
            fin = true;
            
            score.innerHTML = `
            ! Perdu ! <br>
            Clique sur le casse-briques pour recommencer.
            `;
        }
    }

    x += vitesseX;
    y += vitesseY;
}

// Collision Briques
function collision()
{
    for(let i = 0 ; i < nbRow ; i++)
    {
        for(let j = 0 ; j < nbCol ; j++)
        {
            let b = tabBriques[i][j];

            if(b.statut === 1)
            {
                if(x > b.x && x < b.x + largeurBrique && y > b.y && y < b.y + hauteurBrique)
                {
                    vitesseY = - vitesseY;

                    b.statut = 0;

                    result += 1;

                    resultScore.innerHTML = result;

                    if(result === nbCol * nbRow)
                    {
                        score.innerHTML = `
                        !!! Bravo !!! <br>
                        Clique sur le casse-briques pour recommencer`;
                        fin = true;
                    }
                }
            }
        }
    }
}

// Mouvement de la barre
document.addEventListener('mousemove', (e) =>
{
    let posXBarre = e.clientX - canvas.offsetLeft;

    if(posXBarre > 12 && posXBarre < canvasWidth - 12)
    {
        barreX = posXBarre - (largeurBarre/2);
    }
});

// Recommencer le jeu
canvas.addEventListener('click', () =>
{
    if(fin === true)
    {
        fin = false;
        document.location.reload();
    }
});