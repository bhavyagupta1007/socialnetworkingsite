{
    let toggleLike=function()
    {
        let addRemoveButton= $('#toggle-friend');
        addRemoveButton.click(function(e)
        {
            e.preventDefault();
            $.ajax(
                {
                type: 'get',
                url: addRemoveButton.prop('href'),
                success: function(data)
                {
                    if (data.data.removed== false)
                    {
                        addRemoveButton.html('Remove Friend')
                    }
                    else
                    {
                        addRemoveButton.html('Add Friend')
                    }
                },
               error: function(error)
               {
                  console.log(error.responseText);
               }
           });
        })
    }
    toggleLike();
}
