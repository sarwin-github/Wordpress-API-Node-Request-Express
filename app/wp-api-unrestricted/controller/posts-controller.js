const request = require("request");
const async = require("async");
// Set the headers
const headers = { 'Content-Type':'application/x-www-form-urlencoded' };

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//This will make a get request and display the list of posts || http://localhost:port/posts/list
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getPostsList = (req, res) => {
	// Request data
	let posts = {
	    url: 'http://luisrojascr.com/entrenami/wp-json/wp/v2/posts',
	    method: 'GET',
	    headers: headers
	}
	getPosts(req, res, posts);
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//This will make a get request and display the detail of a post with parameter id || http://localhost:port/posts/:id
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getPostDetails = (req, res) => {
	// Request data
	let posts = {
	    url: 'http://luisrojascr.com/entrenami/wp-json/wp/v2/posts/' + req.params.id,
	    method: 'GET',
	    headers: headers
	}
	getPosts(req, res, posts);
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//This is a reusable code for executing request for post
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let getPosts = (req, res, posts) => {
	// Start the request
	request(posts, (error, response, post) => {
		let postData = JSON.parse(post);
	    if(error || postData.status === 'error'){
	        return res.status(500).send({ 
	            success: false, 
	            message: "Something went wrong.", 
	            error: postData 
	        });
	    }
	    res.status(200).json({
	        success: true,
	        message: "Successfully fetched a list of posts from wordpress api.", 
	        post: postData
	    });
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/* This is will make asynchronous get request then display the post details 
   including comments and list of users (users shall be filter in front end) */
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getPostsUsersComments = (req, res) => {
	let headers;

    // Configure the request
    let requests = [{
        url: 'http://luisrojascr.com/entrenami/wp-json/wp/v2/posts/' + req.params.id,
        method: 'GET',
        headers: headers,
    }, {
        url: 'http://luisrojascr.com/entrenami/wp-json/wp/v2/comments',
        method: 'GET',
        headers: headers,
        qs: { "post": req.params.id }
    }, {
        url: 'http://luisrojascr.com/entrenami/wp-json/wp/v2/users' ,
        method: 'GET',
        headers: headers
    }];
  
    async.map(requests, (obj, callback) => {
      // iterator function
      request(obj, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          // transform data here or pass it on
          var body = JSON.parse(body);
          callback(null, body);
        } else { callback(error || response.statusCode); }
      });
    }, (err, results) => {
        // all requests have been made
        if (err){
            return res.status(500).send({ 
                success: false, 
                message: "Something went wrong.", 
                error: err 
            });
        }

        res.status(200).json({
            message: 'Successfully fetched posts details including user and comments.', 
            post: results[0],
            comments: results[1],
            user: results[2]
        });
    });
};