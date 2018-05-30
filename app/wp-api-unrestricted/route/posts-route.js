const express = require('express');
const router = express();

const postsController = require('../controller/posts-controller');

router.route('/').get(postsController.getPostsList);
router.route('/post').get(postsController.getPostsList);
router.route('/post/list').get(postsController.getPostsList);
router.route('/post/:id').get(postsController.getPostDetails);
router.route('/post/details/:id').get(postsController.getPostsUsersComments);

module.exports = router;