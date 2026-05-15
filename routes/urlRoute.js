const express=require('express');
const authentication=require('../middleware/authenticationMiddleware');
const validateURL=require('../middleware/urlMiddleware');
const router=express.Router();
const {urlCreate,urlGet,urlUpdate,urlDelete,urlGetAll,urlGetStat}=require('../controllers/urlController');

router.route('/').post(authentication,validateURL,urlCreate).get(urlGetAll);
router.route('/:id').get(urlGet).put(authentication,validateURL,urlUpdate).delete(authentication,urlDelete);

router.route('/:id/stats').get(urlGetStat);

module.exports=router;