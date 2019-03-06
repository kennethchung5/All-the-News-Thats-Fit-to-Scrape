

// $(".articlebutton2").on("click", () => {
//     alert("a button2 is clicked!")
// })



$(document).on("click", ".saveButton", event => {        

    $.ajax({
        method: "PUT",
        url: `articles/${$(event.currentTarget).attr("data-articleID")}`
    }).then(() => {
        location.reload();
    })
})

$(document).on("click", ".deleteButton", event => {
    
    $.ajax({
        method: "DELETE",
        url: `articles/${$(event.currentTarget).attr("data-articleID")}`
    }).then(() => {
        location.reload();
    })
})