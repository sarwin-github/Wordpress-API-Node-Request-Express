const express = require('express');
const router = express();

const postsController = require('../controller/posts-controller');

router.route('/posts/list').get(postsController.getPostsList);
router.route('/posts/:id').get(postsController.getPostDetails);
router.route('/posts/details/:id').get(postsController.getPostsUsersComments);

module.exports = router;