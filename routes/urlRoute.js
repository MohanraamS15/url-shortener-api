const express=require('express');
const validateURL=require('../middleware/urlMiddleware');
const router=express.Router();
const {urlCreate,urlGet,urlUpdate,urlDelete,urlGetAll,urlGetStat}=require('../controllers/urlController');

router.route('/').post(validateURL,urlCreate).get(urlGetAll);
router.route('/:id').get(urlGet).put(validateURL,urlUpdate).delete(urlDelete);

router.route('/:id/stats').get(urlGetStat);

module.exports=router;