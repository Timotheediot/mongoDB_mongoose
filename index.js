
//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.  
const express = require('express');
const mongoose = require('mongoose'); 
const bodyParser = require("body-parser"); 

const { piscines } = require('./PiscineSchema')
// Nous définissons ici les paramètres du serveur.
const app = express(); 
const port = 3000; 

// const hostname = 'localhost'; 

// Ces options sont recommandées par mLab pour une connexion à la base
const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
 
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
	
app.listen(port, (err) => {
    if(err) {
        throw new Error('Something bad happened…')
    }
    console.log(`Server is listening on port ${port}`);
});

app.get('/hello', (req, res) => {
    res.json("Hello World")
})

//URL de notre base
const urlmongo = "mongodb+srv://dbUserTim:dbUserPassword@mongobddtest-vfel8.azure.mongodb.net/test?retryWrites=true&w=majority"; 
 
// Nous connectons l'API à notre base de données
mongoose.connect(urlmongo, options);
 
const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion à la bdd')); 
db.once('open', () => {
    console.log("----Connexion à la base OK----"); 
}); 


// Je vous rappelle notre route (/piscines).  
app.route('/piscines')
// J'implémente les méthodes GET, PUT, UPDATE et DELETE
// GET
.get((req, res) => { 
 // Utilisation de notre schéma Piscine pour interrogation de la base
    piscines.find((err, piscine) => {
        if (err) {
            res.send(err, "Erreur lors de la recupérations de la liste des piscines"); 
        }
        res.json(piscine); 
    } )
}) 
.post((req, res) => {
    const piscine  = new piscines({
        nom : req.body.nom,
        adresse : req.body.adresse,
        tel : req.body.tel,
        description : req.body.description
    })
      piscine.save((err) => {
        if(err){
          res.send(err);
        }
        res.send({message : 'La piscine est maintenant stockée en base de données'});
      })
}) 


app.route('/piscines/:piscine_id')
.get((req, res) => { 
            //Mongoose prévoit une fonction pour la recherche d'un document par son identifiant
            piscines.findById(req.params.piscine_id, (err, piscine) => {
            if (err)
                res.send(err);
            res.json(piscine);
        });
})

//modifier les parametres d' une piscine
.put((req,res) => { 
    // On commence par rechercher la piscine souhaitée
                piscines.findById(req.params.piscine_id, (err, piscine) => {
                if (err){
                    res.send(err);
                }
                    // Mise à jour des données de la piscine
                        piscine.nom = req.body.nom;
                        piscine.adresse = req.body.adresse;
                        piscine.tel = req.body.tel;
                        piscine.description = req.body.description; 
                              piscine.save((err) => {
                                if(err){
                                  res.send(err);
                                }
                                // Si tout est ok
                                res.json({message : 'Bravo, mise à jour des données OK'});
                              });                
                });
})
.delete((req, res) => { 
 
    piscines.remove({_id: req.params.piscine_id}, (err, piscine) => {
        if (err){
            res.send(err); 
        }
        res.json({message:"Bravo, piscine supprimée"}); 
    }); 
    
});