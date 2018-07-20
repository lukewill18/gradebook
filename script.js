let numStudents = 0;
let totalScore = 0;
const passingGrade = 60;

function checkPassing(gradeCol, grade) {
    if(grade >= passingGrade) {
        gradeCol.css("background-color", "#a1f06c");
    }
    else {
        gradeCol.css("background-color", "#ff715e");
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

function addStudent(table, name, grade) {
    let newStudent = $("<tr>").append($("<td>").addClass("small-col").append($("<input>").attr("type", "checkbox")));
    let nameCol = $("<td>").addClass("big-col").text(name);
    newStudent.append(nameCol);
    
    let gradeNum = parseFloat(grade);
    let gradeCol = $("<td>").addClass("med-col").text(gradeNum.toFixed(2));
    checkPassing(gradeCol, gradeNum);
    newStudent.append(gradeCol);

    table.children("tbody").append(newStudent);
    
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

$(document).ready(function() {
    let table = $("#grade-table");
    let tbody = table.children("tbody")
    let form = $("#add-form");
    let checkAllBtn = $("#check-all");

    let nameSort = 0;
    let gradeSort = 0;

    form.children("#name-entry").focus();   

    $("input").keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#add-form").submit();
        }
      });

    form.on("submit", function(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        let name = fd.get("name");
        let grade = fd.get("grade");

        if(name == "") {
            alert("Please enter a name");
        }
        else if(grade == "" || parseFloat(grade) > 100 || parseFloat(grade) < 0) {
            alert("Please enter a valid number from 0-100 (no letters or special characters)")
        }
        else {
            addStudent(table, name, grade);
            form.children("input").val("");
        }
        form.children("#name-entry").focus();
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
});