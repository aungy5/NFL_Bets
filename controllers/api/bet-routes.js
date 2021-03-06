const router = require('express').Router();
const { Bet } = require('../../models');
const helpers = require('../../utils/helpers');

const withAuth = (req, res, next) => {
    if (!req.session.loggedIn) {
      res.redirect('/login');
    } else {
      next();
    }
}

router.post('/', withAuth, (req, res) => {
    // need to add a check here to see if the user has already placed a bet on this game 
    // something like the below for the IF statement
    // Bet.findbyPK WHERE user_id = req.sesion.user_id AND game_id = req.body.game_id (put this response into an object called betCheck)
    // then IF (betCheck = "") run the create function below 
    Bet.findAll({
        where: {
            user_id: req.session.user_id,
            game_id: req.body.game_id
        },
        attributes: ['id','bet_pick','user_id','game_id']
    })
    .then (betData => {
        const betCheck = betData.map(bet => bet.get({ plain: true }));
        console.log(betCheck);

        if (betCheck.length == 0) {
            console.log("PLACING YOUR BET")
            
            Bet.create({
                bet_pick: req.body.bet_pick,
                game_id: req.body.game_id,
                user_id: req.session.user_id,
            })
            .then(betData => res.json(betData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
        } else {
            console.log("YOUR ALREADY PLACED A BET ON THIS GAME")
            //window.alert("YOUR ALREADY PLACED A BET ON THIS GAME")
        }
    });
});


module.exports = router;