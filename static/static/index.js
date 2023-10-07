$(function() {

    // Clone Add form inputs for future use
    const clonedInputs = cloneInputs("#add-form");

    // Create buttons for update and cancel rows
    const updateButton = "<button class='update'>Update</button>";
    const cancelButton = "<button class='cancel'>Cancel</button>";

    // Add click event to buttons
    $(".btn-edit").click((e) => updateRow(e, clonedInputs, updateButton, cancelButton));

    // Add event to delete buttons
    $(".delete-form").submit(deleteRow);
});

function cloneInputs(parent) {
    // Clone every input and select from the form
    const children = $(parent).children("input, select").clone()

    // Set class to match them
    $(children[0]).prop("class", "editName")
    $(children[1]).prop("class", "editMonth")
    $(children[2]).prop("class", "editDay")

    // Return inputs in object format
    return {
        "editName": children[0],
        "editMonth": children[1],
        "editDay": children[2],
    }
}

function deleteRow(event) {
    // Prevent form to auto submit
    event.preventDefault()

    // Get id from row
    const [temp] = $(this).serializeArray()
    const id = temp.value

    // Make API request
    $.ajax({
        url: "/",
        data: {
            id: id
        },
        method: "DELETE",
        success: function(response) {
            window.location.replace("/")
        },
        error: function(reject) {
            window.location.replace("/")
        }
    })
}

function updateRow(e, inputs, updateBut, cancelBut) {
    // Find the row being currently updated
    let tr = $(e.target).parent().parent();

    // Store a copy of the row
    let clonedTr = $(tr).clone();

    // Select every td from row
    let tds = tr.children();

    // Insert copied inputs for user to insert new data
    $(tds[0]).html(inputs.editName);
    $(tds[1]).html(inputs.editMonth).append(inputs.editDay);
    $(tds[2]).html(updateBut).append(cancelBut);

    // Search for inputted data when user submits
    $(tds[2]).find(".update").click(function() {
        const id = $(".update").parent().parent().find(".id").val();
        const name = $(".update").parent().parent().find(".editName").val();
        const month = $(".update").parent().parent().find(".editMonth").val();
        const day = $(".update").parent().parent().find(".editDay").val();

        // If data is correct, make an API req
        if (id && name && month && day) {
            $.ajax({
                url: "/",
                data: {
                    id: id,
                    name: name,
                    month: month,
                    day: day,
                },
                method: "PUT",
                success: function(response) {
                    window.location.replace("/")
                },
                error: function(reject) {
                    window.location.replace("/")
                }
            })
        }
        // Restore row and set the click listener again
        $(tr).replaceWith(clonedTr);
        $(clonedTr).find(".btn-edit").click((e) => updateRow(e, inputs, updateBut, cancelBut))
    });

    // Cancel button functionality
    $(tds[2]).find(".cancel").click(function() {
        $(tr).replaceWith(clonedTr);
        $(clonedTr).find(".btn-edit").click((e) => updateRow(e, inputs, updateBut, cancelBut))
    });
}

