var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require('./package.json');
const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
var channelLol;
client.login(token);
//client.login(process.env.TOKEN);
var logger = require('winston');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var apiKey = 'RGAPI-00d62c13-d8dc-48d5-b273-e646a8ea595a';


client.on('ready', function (evt) {
    logger.info('Connected');
    client.user.setActivity('la courbe d\'apo', { type: 'WATCHING' });   
    channelLol= client.channels.cache.get('824327893287043122');
});


//checkTimeout();
 setInterval(()=>checkTimeout(),60000);
// mes variables 
var routeApi= "https://euw1.api.riotgames.com";
// info summoner apo
var info = "https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/Chriskandar?api_key=RGAPI-8aa18af1-6bf4-48f1-bc8d-f0e5650c0b29";
//posible de virer id apo
var apoID = "xhHNTNGYkdIOMQAE0ocH4G7gQQe2m0fYGTg9EWC7NghpZAw";

//route rank apo 
var rank = "https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/xhHNTNGYkdIOMQAE0ocH4G7gQQe2m0fYGTg9EWC7NghpZAw?api_key=";

var apoOldTier = "PLATINUM";
var apoOldRank = "III";
var apoOldLp = 3;

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

var Stonks="<:stonks:824979640287625308>";
var notStonks="<:notstonks:824979555532931082>";


client.on('message', message => {
	channelLol= client.channels.cache.get('824327893287043122');
    // Notre client doit savoir s’il doit executer une commande
    //console.log(message.content);
    if (message.content.startsWith(prefix)) {
        
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift();
        const complement = args.shift();
        switch(command) {
            // !intro
            case 'test':
                message.channel.send('opérationnel '+Stonks+notStonks);
            break;

            case 'rank':

                //envoyer une requete à l'api 
                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var response = JSON.parse(this.responseText);
                        message.channel.send('Apo est '+response[0].tier+' '+response[0].rank +' '+response[0].leaguePoints+' lp.');
                    }
                }
                request.open("GET", rank+apiKey);
                request.send();
    
            break;  
            case 'set':

                apiKey= complement;
                message.channel.send('api à jour : '+ apiKey);
            break; 
                
         }
     }
});
function checkTier(tier,rank,lp){
    if(tabTier[tier]>tabTier[apoOldTier]){
        //tier up 
        channelLol.send('Apo a rank up il est maintenant '+tier +' '+rank +' '+lp+' lp. Il a gagné '+calculGainRankUp(lp)+' lp.');
	channelLol.send(notStonks);
    }                        
    else if (tabTier[tier]==tabTier[apoOldTier]){
        checkRank(tier,rank,lp);
    }
    else{
        //tier down 
        channelLol.send('Apo a demote il est maintenant '+tier +' '+rank +' '+lp+' lp. Il a perdu '+calculGain(lp)+' lp.');
	channelLol.send(Stonks);
    }
    update(tier,rank,lp);
}
function checkRank(tier,rank,lp){
    if(tabRank[rank]>tabRank[apoOldRank]){
        channelLol.send('Apo a rank up il est maintenant '+tier +' '+rank +' '+lp+' lp. Il a gagné '+calculGainRankUp(lp)+' lp.');
	channelLol.send(notStonks);
    }
    else if (tabRank[rank]==tabRank[apoOldRank]){
        checkLp(tier,rank,lp);
    }
    else{
        channelLol.send('Apo a demote il est maintenant '+tier +' '+rank +' '+lp+' lp. Il a perdu '+calculGain(lp)+' lp.');
	channelLol.send(Stonks);	    
}
    
}    
function checkLp(tier,rank,lp) {
    if(lp > apoOldLp){
        channelLol.send('Apo a gagné '+calculGain(lp)+' lp. Il est maintenant '+tier +' '+rank +' '+lp+' lp.');
    }
    else if(lp<apoOldLp){
        channelLol.send('Apo a perdu '+calculGain(lp)+' lp. Il est maintenant '+tier +' '+rank +' '+lp+' lp.');
    }
}
function calculGain(lp){
    if(apoOldLp==0 && lp >50)
        return Math.abs(100-lp);
	else if (apoOldLp==0 && lp <50)
	return lp;
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
                        checkTier(response[0].tier,response[0].rank,response[0].leaguePoints);
                    }
                }
    request.open("GET", rank+apiKey);
    request.send();
   
   

}