const fs = require('fs');
const { Parser } = require('json2csv');
const json2csv = new Parser();
const Datastore = require('nedb');
const winnersStore =
    new Datastore({
        filename: './winners',
        autoload: true,
        timestampData: true,
    });
winnersStore.ensureIndex({ fieldName: 'email' });
const paxStore =
    new Datastore({
        filename: './participants',
        autoload: true,
        timestampData: true,
    });
paxStore.ensureIndex({ fieldName: 'email' });

const losersStore =
    new Datastore({
        filename: './losers',
        autoload: true,
        timestampData: true,
    });
losersStore.ensureIndex({ fieldName: 'email' });

const tooSlowStore =
    new Datastore({
        filename: './tooSlow',
        autoload: true,
        timestampData: true,
    });
tooSlowStore.ensureIndex({ fieldName: 'email' });

winnersStore.find({},{},(err, docsWinners) => {
    const winners = docsWinners.sort((a,b)=>{
        return a.createdAt < b.createdAt;
    }).map(val => {
        return {email: val.email, submitTime: val.createdAt};
    });
    paxStore.find({},{}, (err, docsPax) =>{
        const participants = docsPax.map(pax => {
            return {email: pax.email, submitTime: pax.createdAt, success: pax.success};
        }).filter((pax,i,arr) =>{
            if (winners.some(winner => winner.email == pax.email)){
                return false;
            }
            return !arr.some(otherPax => pax.email == otherPax.email && pax.success != otherPax.success) || pax.success;
        });
        const winnersCsv = json2csv.parse(winners);
        const paxCsv = json2csv.parse(participants);
        fs.writeFile('winners.csv',winnersCsv, console.log);
        fs.writeFile('pax.csv',paxCsv, console.log);
    })

});

losersStore.find({},{}, (err, docsLosers) => {

    const losers = docsLosers.sort((a,b)=>{
        return a.createdAt < b.createdAt;
    }).map(val => {
        return {email: val.email, submitTime: val.createdAt};
    });

    const losersCsv = json2csv.parse(losers);

    fs.writeFile('losers.csv',losersCsv, console.log);

});

tooSlowStore.find({},{}, (err, docsTooSlow) => {

    const tooSlow = docsTooSlow.sort((a,b)=>{
        return a.createdAt < b.createdAt;
    }).map(val => {
        return {email: val.email, submitTime: val.createdAt};
    });

    const tooSlowCsv = json2csv.parse(tooSlow);

    fs.writeFile('tooSlow.csv',tooSlowCsv, console.log);

});