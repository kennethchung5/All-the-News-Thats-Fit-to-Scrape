

// $(".articlebutton2").on("click", () => {
//     alert("a button2 is clicked!")
// })



$(document).on("click", ".saveButton", event => {        

    $.ajax({
        method: "PUT",
        url: `articles/update/${$(event.currentTarget).attr("data-articleID")}`
    }).then(() => {
        location.reload();
    }

    )
})