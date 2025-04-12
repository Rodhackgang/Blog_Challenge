const express = require('express');
const router = express.Router();
const articleController = require('../Controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/publish', authMiddleware, articleController.publishArticle); 
router.post('/report', authMiddleware, articleController.reportArticle);  
router.put('/update', authMiddleware, articleController.updateArticle);
router.delete('/delete', authMiddleware, articleController.deleteArticle);  
router.put('/update-stats', authMiddleware, articleController.updateArticleStats);
router.get('/user-articles', authMiddleware, articleController.getUserArticles);
router.get('/tags-info', authMiddleware, articleController.getTagsInfo);


module.exports = router;
