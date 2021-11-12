const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ExpressBrute = require('express-brute');
const morgan = require('morgan');
const cors = require('cors');
const store = new ExpressBrute.MemoryStore();
// const fiveMinutes = 1000*60*5;
const fiveMinutes = 1000*60*2;
const fs = require('fs')
const path = require('path')
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
const bruteforce = new ExpressBrute(store, {
    freeRetries: 0,
    minWait: Number(process.env.PASSWORD_SUBMIT_WAIT_TIME) || fiveMinutes,
    maxWait: Number(process.env.PASSWORD_SUBMIT_WAIT_TIME) || fiveMinutes
});

const Datastore = require('nedb');
const winnersStore =
    new Datastore({
        filename: './winners',
        autoload: true,
        timestampData: true,
    });
const losersStore =
    new Datastore({
        filename: './losers',
        autoload: true,
        timestampData: true,
    });
const tooSlowStore =
    new Datastore({
        filename: './tooSlow',
        autoload: true,
        timestampData: true,
    });
winnersStore.ensureIndex({ fieldName: 'email' });
losersStore.ensureIndex({ fieldName: 'email' });
tooSlowStore.ensureIndex({ fieldName: 'email' });
const paxStore =
    new Datastore({
        filename: './participants',
        autoload: true,
        timestampData: true,
    });
paxStore.ensureIndex({ fieldName: 'email' });
const letters = require('./letters');

app.set('trust proxy', true);
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :body', { stream: accessLogStream }));
if (process.env.CORS == 'enabled'){
    app.use(cors());
}
app.use([bodyParser.urlencoded({ extended: false }), bodyParser.json()]);

app.get('/letters/:id', (req, res) => {
    if (letters.has(req.params.id)){
        res.status(200).json({
            letter: letters.get(req.params.id),
            lastLetter: letters.get(req.params.id) == (process.env.LAST_LETTER || 'C')
        })
    } else {
        res.status(404).send();
    }
})
app.get('/eventStatus',(req,res) => {
    const now = Date.now();
    const startTime = Number(process.env.EVENT_START_TIME || 0);
    const endTime = Number(process.env.EVENT_END_TIME || 5540824800000);
    let status;
    if (now < startTime){
        status = 'unopen';
    } else if (now > endTime){
        status = 'closed';
    } else {
        status = 'open';
    }
    res.status(200).json({status: status});

});
app.get('/nextSubmitTime', (req,res) => {
    const key = ExpressBrute._getKey([req.ip, bruteforce.name, bruteforce.options.key]);
    store.get(key, (err, value) =>{
        const now = Date.now();
        let resJson = {enabled: true};
        if (value){
            const lastValidRequestTime = value && value.lastRequest.getTime() || now;
            const nextValidRequestTime = lastValidRequestTime + Number(process.env.PASSWORD_SUBMIT_WAIT_TIME || fiveMinutes);
            const remaining = nextValidRequestTime - now;
            const enabled = remaining <= 0;
            resJson = enabled && {enabled} || {enabled, remaining};
        }
        res.status(200).json(resJson)

    });
})
app.post('/submits',
    bruteforce.prevent,
    validateInput(),
    checkPassword(),
    checkCompetitorsLimit());

app.listen(process.env.SERVER_PORT || 5000, () => {
    console.log(`Server listens at ${process.env.SERVER_PORT || 5000}`);
    console.log(`SERVER_PORT=${process.env.SERVER_PORT || 5000}`);
    console.log(`MAX_COMPETITORS_COUNT=${process.env.MAX_COMPETITORS_COUNT || 20}`);
    console.log(`COMPETITION_PASSWORD=${process.env.COMPETITION_PASSWORD || 'password'}`);
    console.log(`PASSWORD_SUBMIT_WAIT_TIME=${process.env.PASSWORD_SUBMIT_WAIT_TIME || fiveMinutes}`);
    console.log(`EVENT_START_TIME=${process.env.EVENT_START_TIME || 0}`);
    console.log(`EVENT_END_TIME=${process.env.EVENT_END_TIME || 5540824800000}`);
    console.log(`LAST_LETTER=${process.env.LAST_LETTER || 'C'}`);
});

function validateInput() {
    return (req, res, next) => {
        if (req.body.password && req.body.email && req.body.agreement1 && req.body.agreement2){
            next();
        } else {
            res.status(400).json({error: "Invalid input."})
        }
    };
}

function checkPassword() {
    return (req, res, next) => {
        if (req.body.password == (process.env.COMPETITION_PASSWORD || 'password')) {
            next();
        } else {
            paxStore.update({email: req.body.email, success: false},{email: req.body.email, success: false},{upsert: true},(err) => {
                if (err) {
                    console.log(`Failed to upsert participant: ${err.message}`);
                }
            });
            losersStore.update({email: req.body.email, success: false},{email: req.body.email},{upsert: true}, (err) => {
                if (err) {
                    console.log(`Failed to upsert loser: ${err.message}`);
                } 
            });
            res.status(200).json({success: false});
        }
    };
}

function checkCompetitorsLimit() {
    return (req, res, next) => {
        winnersStore.count({}, (err, count) => {
            if (err) {
                res.status(500).json({error: 'dbError'});
            } else {
                paxStore.update({email: req.body.email},{email: req.body.email, success: true},{upsert: true},(err) => {
                    if (err) {
                        console.log(`Failed to upsert participant: ${err.message}`);
                    }
                });
                if (count >= (process.env.MAX_COMPETITORS_COUNT || 20)) {
                    res.status(200).json({success: true, count: process.env.MAX_COMPETITORS_COUNT});

                    tooSlowStore.update({email: req.body.email, success: false},{email: req.body.email},{upsert: true}, (err) => {
                        if (err) {
                            console.log(`Failed to upsert too slow: ${err.message}`);
                        } 
                    });

                } else {
                    winnersStore.update({email: req.body.email},{email: req.body.email, position: count + 1},{upsert: true}, (err) => {
                        if (err) {
                            console.log(`Failed to upsert winner: ${err.message}`);
                            res.status(500).json({error: 'dbError'});
                        } else {
                            res.status(200).json({success: true});
                        }
                    });
                }
            }
        });
    };
}
