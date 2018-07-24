let numStudents = 0;
let totalScore = 0;
const passingGrade = 60;

function validateName(name) {
    let errorMsg = "";  
    name = name.trim();
    if(name == "") {
        throw Error("Name is empty, ");
    }
    if(name.split(" ").length < 2) {
        errorMsg += "Name is not 2 or more words, ";
    }
    if(!/^[a-zA-Z ]+$/.test(name)) {
        errorMsg += "Name is not made up of purely letters and spaces, ";
    }
    if(errorMsg != "") {
        throw Error(errorMsg);
    }
}

function validateGrade(grade) {
    let errorMsg = "";
    if(grade.trim() == "") {
        throw Error("Grade is empty, ");
    }
    else if(!/^[0-9.]+$/.test(grade)) {
        errorMsg += "Grade is not made up of purely digits and period, ";
    }
    let gradeNum = parseFloat(grade);
    if(gradeNum > 100 || gradeNum < 0) {
        errorMsg += "Grade is not within the range 0-100, ";
    }
    if(errorMsg != "") {
        throw Error(errorMsg);
    }
}

function checkPassing(grade) {
    if(grade >= passingGrade) {
        return "passing";
    }
    else {
        return "failing";
    }
}

function updateAverage(table) {
    let averageEntry = table.children("tfoot").find("#average-score");
    if(numStudents == 0) {
        averageEntry.text(0);
    }
    else {
        averageEntry.text((totalScore/numStudents).toFixed(2));
    }
}

function generateStudent(name, gradeNum) {
    return `<tr> 
                <td class='small-col'> 
                    <input type='checkbox'> 
                </td> 
                <td class='big-col'> 
                    <p>${name}</p> 
                </td> 
                <td class='med-col ${checkPassing(gradeNum)}'>
                    ${gradeNum}%
                </td>
                <td class='smaller-col'>
                    <i class='fas fa-times'>
                </td>
            </tr>`;
}

function addStudent(table, name, grade) {
    let gradeNum = parseFloat(grade);
    table.children("tbody").append(generateStudent(name, gradeNum.toFixed(2)));
    ++numStudents;
    totalScore += gradeNum;
    updateAverage(table);
}

function deleteStudent(table, toDelete) {
    --numStudents;
    totalScore -= parseFloat($(toDelete).children(".med-col").text());
    updateAverage(table);
    toDelete.remove();
}

function deleteChecked(table, checkAllBtn) {
    let checkedBoxes = table.children("tbody").find("input:checked");
    let rows = checkedBoxes.parent().parent();
    for(let i = 0; i < rows.length; ++i) {
        deleteStudent(table, rows[i]);
    }
    $(checkAllBtn).prop("checked", false);
}

function checkOrUncheckAll(table, check) {
    let checkboxes = table.children("tbody").find(":checkbox");
    for(let i = 0; i < checkboxes.length; ++i) {
        $(checkboxes[i]).prop("checked", check);
    }
}

function removeAllRows(tbody) {
    let rows = $(tbody).children();
    for(let i = 0; i < rows.length; ++i) {
        rows.remove();
    }
}

function sortRows(tbody, sortfunc, arr) {
    arr.sort(sortfunc);
    removeAllRows(tbody);
    for(let i = 0; i < arr.length; ++i) {
        $(tbody).append($(arr[i]).parent());
    }
}

function showAlert(alert, message) {
    alert.css({"opacity": 1, "z-index": 1, "top": "5px"});
    alert.text("Error: " + message);
    setTimeout(function() {
        alert.css({"opacity": 0, "z-index": 0, "top": "-500px"});
    }, 4500);
}

$(document).ready(function() {
    let table = $("#grade-table");
    let tbody = table.children("tbody");
    let form = $("#add-form");
    let checkAllBtn = $("#check-all");
    let nameEntry = form.children("#name-entry");
    let alert = $("#alert");
    let nameSort = 0;
    let gradeSort = 0;

    let oldName;

    nameEntry.focus();   

    $("input").keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            form.submit();
        }
      });

    form.on("submit", function(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        let name = fd.get("name");  
        let grade = fd.get("grade");
        let errorMsg = "";

        try {
            validateName(name);
        }
        catch(e) {
            errorMsg += e.message;
        }
        try {
            validateGrade(grade);
        }
        catch(e) {
            errorMsg += e.message;
        }
        if(errorMsg != "") {
            showAlert(alert, errorMsg.slice(0, -2));
        }
        else {
            addStudent(table, name.trim(), grade);
            form.children("input").val("");
        }
        
        nameEntry.focus();
    });

    checkAllBtn.change(function() {
        checkOrUncheckAll(table, checkAllBtn[0].checked);
    });

    $("#delete-btn").click(function() {
        deleteChecked(table, checkAllBtn);
    });

    table.find("#name-col").click(function() {
        nameSort = (nameSort + 1) % 2;
        let names = $(tbody).find(".big-col");
        switch(nameSort) {
            case 1:
                sortRows(tbody, function(a, b) {
                    return a.textContent > b.textContent;
                }, names);
                break;
            case 0:
                sortRows(tbody, function(a, b) {
                    return a.textContent < b.textContent;
                }, names);
                break;
        }
    });
    
    table.find("#grade-col").click(function() {
        gradeSort = (gradeSort + 1) % 2;
        let grades = $(tbody).find(".med-col");
        switch(gradeSort) {
            case 1:
                sortRows(tbody, function(a, b) {
                    return parseFloat(a.textContent) > parseFloat(b.textContent);
                }, grades);
                break;
            case 0:
                sortRows(tbody, function(a, b) {
                    return parseFloat(a.textContent) < parseFloat(b.textContent);
                }, grades);
                break;
        }
    });

    tbody.on("click", ".fa-times", function() {
        deleteStudent(table, $(this).parent().parent());
    });

    tbody.on("click", "p", function() {
        oldName = $(this).text();
        let inputbox = $("<input>").attr({"type": "text", "value": oldName}).addClass("name-replacer");
        $(this).replaceWith(inputbox);
        inputbox.select();
    });

    tbody.on("focusout", ".name-replacer", function() {
        let newName = $(this).val();
        if(newName.trim() == "") {
            newName = oldName;
            let nameP = $("<p>").text(newName);
            $(this).replaceWith(nameP);
        }
        else {
            try {
                validateName(newName);  
                let nameP = $("<p>").text(newName);
                $(this).replaceWith(nameP);
            }
            catch(e) {
                if(e.message != "Failed to execute 'replaceChild' on 'Node': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?")
                showAlert(alert, e.message.slice(0, -2));
            }
        }
        
    });

    tbody.on("keydown", ".name-replacer", function (e) {
        if (e.which == 13 || e.which == 27) {   
            $(this).focusout();
        }
      });
    
});