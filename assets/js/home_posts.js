
{ //method to submit the form data for new post using AJAX
    let createPost=function()
    {
        let newPostForm= $('#new-post-form');
        newPostForm.submit(function(e)
        {
            e.preventDefault();
            $.ajax(
                {
                type: 'POST',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data)
                {
                  let newPost=newPostDom(data.data.post) ;
                  $('#posts-list-container>ul').prepend(newPost);
                  deletePost($(`.delete-post-button`, newPost));
                 createComment($(`.new-comment-form`, newPost),newPost);
                 new ToggleLike($('.toggle-like-button',newPost));
                  new Noty({
                    theme: 'relax',
                    text: "Post Created via AJAX",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                }, error: function(error)
                {
                    console.log(error.responseText);
                }
            })
        });
    }
    //method to create a post in DOM
    let  newPostDom=function(post)
    {
       
        return $(`<li id="post-${post._id}">
        <p>
           <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">
                X
                 </a>
            </small>
            ${post.content}
            <br>
            <small>
            ${post.user.name}
            </small>
            <br>
            <small>
              <a class="toggle-like-button" data-likes="0"  href="/likes/toggle/?id=${post._id}&type=Post">
                0 Likes
               </a>
            <small>
        </p>
        <div class="post-comments">
           
                <form action="/comments/create" class="new-comment-form" method="POST">
                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id}" >
                    <input type="submit" value="Add Comment">
                </form>
    
            
    
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                   
                </ul>
            </div>
        </div>
        
    </li>
        `)
    }

//method to delete a post from dom
let deletePost= function(deleteLink)
{
    $(deleteLink).click(function(e){
        e.preventDefault();
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                 $(`#post-${data.data.post_id}`).remove();
                 new Noty({
                    theme: 'relax',
                    text: "Post Deleted via AJAX",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            },error: function(error){
               console.log(error.responseText);
            }
        });
    })

}

 //metgod to submit the form data for new comment using AJAX
let createComment= function(formLink,newPost)
{
    //console.log(formLink);
    $(formLink).submit(function(e){
        e.preventDefault();
        $.ajax(
            {
            type: 'POST',
            url: '/comments/create',
            //serialize converts the form to JSON
            data: $(formLink).serialize(),
            success: function(data)
            {
              let newComment=newCommentDom(data.data.comment) ;
              $('.post-comments-list>ul',newPost).prepend(newComment);
              deleteComment($(`.delete-comment-button`, newComment));
              new ToggleLike($('.toggle-like-button',newComment));
              new Noty({
                theme: 'relax',
                text: "Comment Created via AJAX",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            }, error: function(error)
            {
                console.log(error.responseText);
            }
        })
    });
}

//method to create a comment in DOM
let  newCommentDom=function(comment)
{
       return $(`<li id="comment-${comment._id}">  
       <p>
           <small>
                       <a class="delete-comment-button" href="/comments/destroy/${comment._id}">
                            X
                        </a>
            </small>
           ${comment.content}
           <br>
           <small>
               ${comment.user.name}
           </small>
           <small>
              <a class="toggle-like-button" data-likes="0"  href="/likes/toggle/?id=${comment._id}&type=Comment">
                0 Likes
               </a>
            <small>
       </p>
   </li>     
        `)
}

//method to delete a comment from dom
let deleteComment= function(deleteLink)
{
    //console.log(deleteLink);
    $(deleteLink).click(function(e)
    {
        e.preventDefault();
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data)
            {
                 $(`#comment-${data.data.comment_id}`).remove();
                 new Noty({
                    theme: 'relax',
                    text: "Comment Deleted via AJAX",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            },error: function(error){
               console.log(error.responseText);
            }
        });
    })

}

var allposts=$(`.delete-post-button`)
for(i=0;i<allposts.length;i++)
{
    deletePost(allposts[i]);
}

var allcomments=$(`.new-comment-form`);
var allpostsbox=$('.post-comments');
for(j=0;j<allcomments.length;j++)
{
    createComment(allcomments[j],allpostsbox[j]);
} 

var allcommentstobedeleted=$('.delete-comment-button');
for(k=0;k<allcommentstobedeleted.length;k++)
{
    deleteComment(allcommentstobedeleted[k]);
}

    createPost();
}