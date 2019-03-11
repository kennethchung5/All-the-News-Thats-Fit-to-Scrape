

// $(".articlebutton2").on("click", () => {
//     alert("a button2 is clicked!")
// })



$(document).on("click", ".saveButton", event => {        
    $.ajax({
        method: "PUT",
        url: `articles/${$(event.currentTarget).attr("data-articleID")}`
    }).then(response => {
        location.reload();
    })
})



$(document).on("click", ".deleteButton", event => {    
    $.ajax({
        method: "DELETE",
        url: `articles/${$(event.currentTarget).attr("data-articleID")}`
    }).then(response => {
        location.reload();
    })
})



$(document).on("click", ".commentsButton", event => {
    $.ajax({
        method: "GET",
        url: `articles/${$(event.currentTarget).attr("data-articleID")}`
    }).then(response => {
        // console.log(response);

        // console.log(response.$("#commentsModal"));        
        // $(".commentsModal").modal("show");

        $(response).modal("show");
    })
})

$(document).on("click", ".saveCommentButton", event => {

    // console.log("A saveComment button is clicked! Its articleID is ");
    // console.log($(event.currentTarget).attr("data-articleID"));




    $.ajax({
        method: "POST",
        url: `articles/${$(event.currentTarget).attr("data-articleID")}`,
        //querying the text from the modal form input; this needs to be adjusted 
        data: {bodyText: $("#commentInput").val()}
    }).then(response => {
// modal should close upon successful form submission... 

        $("#commentsModal").toggle();

        // setTimeout($("#commentsModal").remove(), 500);

        // console.log(response);
    })
})