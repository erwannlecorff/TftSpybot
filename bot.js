var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require('./package.json');
const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var channelLol;
//client.login(token); ancien token
client.login(process.env.TOKEN);
var logger = require('winston');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';




client.on('ready', function (evt) {
    logger.info('Connected');
    client.user.setActivity('la courbe d\'apo', { type: 'WATCHING' });   
    channelLol= client.channels.cache.get('824327893287043122');
});


//checkTimeout();
 setInterval(()=>checkTimeout(),1200000);
// mes variables 
var routeApi= "https://euw1.api.riotgames.com";
// info summoner apo
var info = "https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/Chriskandar?api_key=RGAPI-20ba9075-a5d6-4e7e-8ce1-27c3d2025270";
//posible de virer id apo
var apoID = "xhHNTNGYkdIOMQAE0ocH4G7gQQe2m0fYGTg9EWC7NghpZAw";

//route rank apo 
var rank = "https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/xhHNTNGYkdIOMQAE0ocH4G7gQQe2m0fYGTg9EWC7NghpZAw?api_key=RGAPI-20ba9075-a5d6-4e7e-8ce1-27c3d2025270";

var apoOldTier = "PLATINUM";
var apoOldRank = "IV";
var apoOldLp = 60;

var tabTier= new Array();
tabTier["IRON"] =1;
tabTier["BRONZE"] =2;
tabTier["SILVER"]=3;
tabTier["GOLD"]=4;
tabTier["PLATINUM"]=5;
tabTier["DIAMOND"]=6;
tabTier["MASTER"]=7;
tabTier["GRANDMASTER"]=8;
tabTier["CHALLENGER"]=9;

var tabRank= new Array();
tabRank["IV"]=1;
tabRank["III"]=2;
tabRank["II"]=3;
tabRank["I"]=4;




client.on('message', message => {

    // Notre client doit savoir s’il doit executer une commande
    //console.log(message.content);

    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        switch(command) {
            // !intro
            case 'test':
                message.channel.send('opérationnel');
            break;

            case 'rank':

                //envoyer une requete à l'api 
                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var response = JSON.parse(this.responseText);
                        rankAtm(response[0].tier,response[0].rank,response[0].leaguePoints,message.channel);

                    }
                }
                request.open("GET", 'https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/xhHNTNGYkdIOMQAE0ocH4G7gQQe2m0fYGTg9EWC7NghpZAw?api_key=RGAPI-20ba9075-a5d6-4e7e-8ce1-27c3d2025270');
                request.send();

                /*
            break;  
            case 'last':
                //envoyer une requete à l'api 
                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var response = JSON.parse(this.responseText);
                        checkTier(response[0].tier,response[0].rank,response[0].leaguePoints);
                    }
                }
                request.open("GET", 'https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/xhHNTNGYkdIOMQAE0ocH4G7gQQe2m0fYGTg9EWC7NghpZAw?api_key=RGAPI-20ba9075-a5d6-4e7e-8ce1-27c3d2025270');
                request.send();


            break; */  
                
         }
     }
});
function rankAtm(tier,rank,lp,chan){
    chan.send('Apo est '+tier+' '+rank +' '+lp+' lp.');
    update(tier,rank,lp);
}
function checkTier(tier,rank,lp,chan){
    if(tabTier[tier]>tabTier[apoOldTier]){
        //tier up 
        chan.send('Apo a rank up il est maintenant '+tier +' '+rank +' '+lp+' lp. Il a gagné '+calculGainRankUp(lp)+' lp.');
    }                        
    else if (tabTier[tier]==tabTier[apoOldTier]){
        checkRank(tier,rank,lp);
    }
    else{
        //tier down 
        chan.send('Apo a demote il est maintenant '+tier +' '+rank +' '+lp+' lp. Il a perdu '+calculGain(lp)+' lp.');

    }
    update(tier,rank,lp);
}
function checkRank(tier,rank,lp,chan){
    if(tabRank[rank]>tabRank[apoOldRank]){
        chan.send('Apo a rank up il est maintenant '+tier +' '+rank +' '+lp+' lp. Il a gagné '+calculGainRankUp(lp)+' lp.');
    }
    else if (tabRank[rank]==tabRank[apoOldRank]){
        checkLp(lp);
    }
    else{
        chan.send('Apo a demote il est maintenant '+tier +' '+rank +' '+lp+' lp. Il a perdu '+calculGain(lp)+' lp.');
    }
    
}    
function checkLp(lp,chan) {
    if(lp > apoOldLp){
        chan.send('Apo a gagné '+calculGain(lp)+' lp.');
    }
    else if(lp<apoOldLp){
        chan.send('Apo a perdu '+calculGain(lp)+' lp.');
    }
}
function calculGain(lp){
    if(apoOldLp==0)
        return Math.abs(100-lp);
    return Math.abs(lp - apoOldLp);
}
function calculGainRankUp(lp){
    return  (lp +100-apoOldLp);
}

function update(tier,rank,lp){
    if (tier != apoOldTier)
        apoOldTier =tier;
    if (rank != apoOldRank)
        apoOldRank = rank;
    if(lp != apoOldLp)
        apoOldLp = lp;
}

function checkTimeout(){
    logger.info('Timeout');
    var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var response = JSON.parse(this.responseText);
                        checkTier(response[0].tier,response[0].rank,response[0].leaguePoints,channelLol);
                    }
                }
    request.open("GET", 'https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/xhHNTNGYkdIOMQAE0ocH4G7gQQe2m0fYGTg9EWC7NghpZAw?api_key=RGAPI-20ba9075-a5d6-4e7e-8ce1-27c3d2025270');
    request.send();
   
   

}
