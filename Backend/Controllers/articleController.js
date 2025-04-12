const Article = require('../Models/Article');
const User = require('../Models/User');

const publishArticle = async (req, res) => {
    try {
        const { title, description, tags, image, authorId, authorName, authorDescription } = req.body;

        const user = await User.findById(authorId);
        if (!user || !user.canPublish) {
            return res.status(403).json({ message: "Vous n\etes pas autorisé à publier un article" });
        }

        const article = new Article({
            title,
            description,
            tags: tags.split(','),
            image,
            author: user._id,
            authorName,
            authorDescription
        });

        await article.save();
        res.status(201).json({ message: 'Article publié avec success', article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateArticleStats = async (req, res) => {
    try {
        const { articleId, incrementViews, incrementLikes } = req.body;

        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        // Mise à jour des vues si besoin
        if (incrementViews) {
            article.views += incrementViews;
        }

        // Mise à jour des likes si besoin
        if (incrementLikes) {
            article.likes += incrementLikes;
        }

        // Sauvegarde des changements
        await article.save();

        res.status(200).json({
            message: 'Statistiques de l\'article mises à jour avec succès',
            article
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reportArticle = async (req, res) => {
    try {
        const { articleId, userId } = req.body;

        const article = await Article.findById(articleId);
        const user = await User.findById(userId);

        if (!article || !user) {
            return res.status(404).json({ message: "Utuilisateur ou article non trouver" });
        }

        if (!article.reportedBy.includes(userId)) {
            article.reportedBy.push(userId);
            article.reported = true;
            await article.save();
            user.reportedArticles.push(article._id);
            await user.save();
        }

        res.status(200).json({ message: 'L\'article à été publier avec success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateArticle = async (req, res) => {
    try {
        const { articleId, title, description, tags, image, authorId } = req.body;
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        if (article.author.toString() !== authorId) {
            return res.status(403).json({ message: 'Vous pouvez seulement modifier cet article' });
        }

        article.title = title || article.title;
        article.description = description || article.description;
        article.tags = tags ? tags.split(',') : article.tags;
        article.image = image || article.image;

        await article.save();
        res.status(200).json({ message: 'Article mise a jour avec success', article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const { articleId, authorId } = req.body;
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        if (article.author.toString() !== authorId) {
            return res.status(403).json({ message: 'Vous pouvez supprimer uniquement vos articles' });
        }
        await Article.deleteOne({ _id: articleId });

        res.status(200).json({ message: 'Article supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getUserArticles = async (req, res) => {
    try {
        const userId = req.userId; 
        const userArticles = await Article.find({ author: userId });
        const otherArticles = await Article.find({ author: { $ne: userId } });
        res.status(200).json({
            message: 'Articles récupérés avec succès',
            userArticles,
            otherArticles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getTagsInfo = async (req, res) => {
    try {
        const articles = await Article.find();

        const tagMap = {};

        articles.forEach(article => {
            article.tags.forEach(tag => {
                const trimmedTag = tag.trim().toLowerCase();
                if (!tagMap[trimmedTag]) {
                    tagMap[trimmedTag] = {
                        count: 0,
                        articles: []
                    };
                }
                tagMap[trimmedTag].count += 1;
                tagMap[trimmedTag].articles.push({
                    id: article._id,
                    title: article.title,
                    description: article.description,
                    authorName: article.authorName,
                    createdAt: article.createdAt
                });
            });
        });

        res.status(200).json({
            message: 'Tags récupérés avec succès',
            tags: tagMap
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { publishArticle, reportArticle, updateArticle, deleteArticle, updateArticleStats,getUserArticles,getTagsInfo};
