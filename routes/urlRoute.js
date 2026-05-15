const express=require('express');
const authentication=require('../middleware/authenticationMiddleware');
const validateURL=require('../middleware/urlMiddleware');
const adminauthentication=require('../middleware/adminMiddleware');
const router=express.Router();
const {urlCreate,urlGet,urlUpdate,urlDelete,urlGetAll,urlGetStat}=require('../controllers/urlController');

router.route('/').post(authentication,validateURL,urlCreate);
router.route('/').get(authentication,adminauthentication,urlGetAll);
router.route('/:id').get(urlGet);
router.route('/:id').put(authentication,validateURL,adminauthentication,urlUpdate)
router.route('/:id').delete(authentication,adminauthentication,urlDelete);

router.route('/:id/stats').get(urlGetStat);

module.exports=router;