import { Selector } from 'testcafe';

fixture `Test page`
   .page `file:///C:/Users/Luke/bootcamp/grade-table/index.html`;


let validInput = [
    {
      "grade": "8.21",
      "name": {
        "first": "Stanton",
        "last": "Carpenter"
      }
    },
    {
      "grade": "43.41",
      "name": {
        "first": "Lambert",
        "last": "Foley"
      }
    },
    {
      "grade": "58.47",
      "name": {
        "first": "Goodman",
        "last": "Kramer"
      }
    },
    {
      "grade": "57.09",
      "name": {
        "first": "Lowery",
        "last": "Mullen"
      }
    },
    {
      "grade": "57.82",
      "name": {
        "first": "Gilda",
        "last": "Rocha"
      }
    },
    {
      "grade": "82.38",
      "name": {
        "first": "Hall",
        "last": "Welch"
      }
    },
    {
      "grade": "61.92",
      "name": {
        "first": "Marsha",
        "last": "Patrick"
      }
    },
    {
      "grade": "61.39",
      "name": {
        "first": "Haley",
        "last": "Contreras"
      }
    },
    {
      "grade": "9.17",
      "name": {
        "first": "Waters",
        "last": "Benton"
      }
    },
    {
      "grade": "49.7",
      "name": {
        "first": "Lola",
        "last": "Schultz"
      }
    }
];

let extraValidNames = [
  {
    "name": {
      "first": "Leon",
      "last": "Cote"
    }
  },
  {
    "name": {
      "first": "Benton",
      "last": "Gaines"
    }
  },
  {
    "name": {
      "first": "Donna",
      "last": "Mueller"
    }
  },
  {
    "name": {
      "first": "Lesa",
      "last": "Charles"
    }
  },
  {
    "name": {
      "first": "Shelton",
      "last": "Holt"
    }
  },
  {
    "name": {
      "first": "Karyn",
      "last": "Brady"
    }
  },
  {
    "name": {
      "first": "Jenifer",
      "last": "Lowery"
    }
  },
  {
    "name": {
      "first": "Lynn",
      "last": "Cannon"
    }
  },
  {
    "name": {
      "first": "Rosa",
      "last": "Tyler"
    }
  },
  {
    "name": {
      "first": "Sears",
      "last": "Martinez"
    }
  }
];

let invalidInput = [
  {
    "grade": "100",
    "name": {
      "first": "Bob",
      "last": ""
    },
    "expectedErrorMsg": "Name is not 2 or more words"
    
  },
  {
    "grade": "100",
    "name": {
      "first": "Bob",
      "last": "123"
    },
    "expectedErrorMsg": "Name is not made up of purely letters and spaces"
  },
  {
    "grade": "100",
    "name": {
      "first": "",
      "last": ""
    },
    "expectedErrorMsg": "Name is empty"
  },
  {
    "grade": "-1",
    "name": {
      "first": "as",
      "last": "df"
    },
    "expectedErrorMsg": "Grade is not made up of purely digits and period, Grade is not within the range 0-100"
  },
  {
    "grade": "100.1",
    "name": {
      "first": "as",
      "last": "df"
    },
    "expectedErrorMsg": "Grade is not within the range 0-100"
  },
  {
    "grade": " ",
    "name": {
      "first": "as",
      "last": "df"
    },
    "expectedErrorMsg": "Grade is empty"
  },
  {
    "grade": " ",
    "name": {
      "first": " ",
      "last": " "
    },
    "expectedErrorMsg": "Name is empty, Grade is empty"
  }
];

const nameEntry = Selector('#name-entry');
const gradeEntry = Selector('#grade-entry');
const addBtn = Selector("#add-btn");
const alert = Selector("#alert");

const table = Selector("#grade-table");
const averageCol = table.find("tfoot .med-col");
const nameHeader = table.find("thead #name-col");
const gradeHeader = table.find("thead #grade-col");
const checkAll = table.find("thead #check-all");
const deleteBtn = table.find("tfoot #delete-btn");


async function addPeople(input, t) {
    for(let i = 0; i < input.length; ++i) {
        let person = input[i];
    await t
        .typeText(nameEntry, person.name.first + " " + person.name.last, { replace: true })
        .typeText(gradeEntry, person.grade, { replace: true })
        .click(addBtn); 
  }
}

async function checkNameOrder(correctOrder, t) {
  let names = await table.find("tbody tr .big-col p");
    for(let i = 0; i < validInput.length; ++i) {
        await t.expect(names.nth(i).textContent).eql(correctOrder[i]);
    }
}

async function checkGradeOrder(correctOrder, t) {
  let grades = await table.find("tbody tr .med-col p");
  for(let i = 0; i < validInput.length; ++i) {
      await t.expect(grades.nth(i).textContent).eql(parseFloat(correctOrder[i]).toFixed(2).toString() + "%");
  }
}

async function addValidInput() {
  test('Adding valid input', async t => {
    let totalGrade = 0;
    for(let i = 0; i < validInput.length; ++i) {
        let person = validInput[i];
        totalGrade += parseFloat(person.grade);
        await t
            .typeText(nameEntry, person.name.first + " " + person.name.last)
            .typeText(gradeEntry, person.grade)
            .click(addBtn);
        const row = await table.find("tbody tr").nth(i);
        const name = await row.find(".big-col p");
        const grade = await row.find(".med-col p");
        const passOrFail = parseFloat(grade) >= 60 ? "passing" : "failing";
        const checkBox = await row.find(".small-col input");
        const deleteButton = await row.find(".smaller-col .fa-times");
        await t
            .expect(row.exists).ok()
            .expect(checkBox.exists).ok()
            .expect(deleteButton.exists).ok()
            .expect(name.textContent).contains(person.name.first + " " + person.name.last)
            .expect(grade.textContent).contains(parseFloat(person.grade).toFixed(2).toString() + "%")
            .expect(grade.hasClass(passOrFail));
    }
    await t.expect(averageCol.textContent).eql("Average: " + (totalGrade/validInput.length).toFixed(2).toString() + "%");
  });
}

async function sortValidInput() {
  test('Sorting input', async t => {
    let correctSortedNames = validInput.map(function(i) { return i.name.first + " " + i.name.last; });
    let correctSortedGrades = validInput.map(function(i) { return i.grade; });
    correctSortedNames.sort();
    correctSortedGrades.sort(function(a, b) { return parseFloat(a) > parseFloat(b); });
    await addPeople(validInput, t);

    await t.click(nameHeader);
    await checkNameOrder(correctSortedNames, t);
    correctSortedNames.reverse();

    await t.click(nameHeader);
    await checkNameOrder(correctSortedNames, t);

    await t.click(gradeHeader);
    await checkGradeOrder(correctSortedGrades, t);

    correctSortedGrades.reverse();
  
    await t.click(gradeHeader);
    await checkGradeOrder(correctSortedGrades, t);
  });  
}

async function deleteValidInput() {
  test('Deleting input', async t => {   

    await addPeople(validInput, t);
    for(let i = 0; i < validInput.length; ++i) {
      let row = await table.find("tbody tr").nth(0);
      let rowText = row.find("big-col").textContent;
      let deleteButton = await row.find(".smaller-col .fa-times");
      await t.click(deleteButton);
      let sameRow = table.find("tbody tr big-col").withText(rowText.toString());
      await t.expect(sameRow.exists).notOk();
    }

    await addPeople(validInput, t);
    await t.click(checkAll);
    await t.click(deleteBtn);
    let numRows = await table.find("tbody tr").count;
    await t.expect(numRows).eql(0);

    let totalGrade = 0;
    await addPeople(validInput, t);
    for(let i = 0; i < validInput.length; ++i) {
      totalGrade += parseFloat(validInput[i].grade);
    }

    let rows = await table.find("tbody tr");
    let toDelete = [rows.nth(0), rows.nth(3), rows.nth(6)];
    for(let i = 0; i < toDelete.length; ++i) {
      const grade = await toDelete[i].find(".med-col p").textContent;
      totalGrade -= parseFloat(grade.toString().slice(0, -1));
      let checkBox = await toDelete[i].find(".small-col input");
      await t.click(checkBox);
    }
    await t.click(deleteBtn);
    for(let i = 0; i < toDelete.length; ++i) {
      let sameRow = table.find("tbody tr .big-col").withText(toDelete[i].find(".big-col").textContent.toString());
      await t.expect(sameRow.exists).notOk();
    }
    await t.expect(averageCol.textContent).contains((totalGrade/(validInput.length - toDelete.length)).toFixed(2).toString() + "%");
  });
}

async function addInvalidInput() {
  test('Adding invalid input', async t => {
    for(let i = 0; i < invalidInput.length; ++i) {
      let person = invalidInput[i];
      await t
        .selectText(nameEntry)
        .typeText(nameEntry, person.name.first + " " + person.name.last, { replace: true })
        .selectText(gradeEntry)
        .pressKey('delete')
        .typeText(gradeEntry, person.grade, { replace: true })
        .click(addBtn)
        .expect(alert.textContent).eql("Error: " + person.expectedErrorMsg);
      }
    let row = await table.find("tbody tr");
    await t.expect(row.exists).notOk();
  });
}

async function editValidInput() {
  test('Editing input to be valid', async t => {
    await addPeople(validInput, t);
    let rows = table.find("tbody tr");
    for(let i = 0; i < validInput.length; ++i) {
      let text = rows.nth(i).find(".big-col p");
      await t.click(text);
      let inputbox = rows.nth(i).find(".name-replacer");
      let newName = extraValidNames[i].name.first + " " + extraValidNames[i].name.last;
      await t
        .typeText(inputbox, newName, { replace: true })
        .pressKey('esc')
        .expect(text.textContent).eql(newName);
    }
    let oldName = await rows.nth(0).find(".big-col p").textContent;
    let firstRow = await rows.nth(0).find(".big-col p");
    await t.click(firstRow);
    let inputbox = await rows.nth(0).find(".name-replacer");
    let correctSortedNames = extraValidNames.map(function(i) { return i.name.first + " " + i.name.last; });
    correctSortedNames.sort();
    await t
      .selectText(inputbox)
      .pressKey('delete')
      .pressKey('esc')
      .expect(firstRow.textContent).eql(oldName)
      .click(nameHeader);
    await checkNameOrder(correctSortedNames, t);
    });
}

async function editInvalidInput() {
  test('Editing input to be invalid', async t => {
    await addPeople(validInput, t);

  });
}

async function testValidInput() {
  //addValidInput();
  //sortValidInput();   
  //deleteValidInput();  
  editValidInput();
}

async function testInvalidInput() {
  addInvalidInput();
  //editInvalidInput();
}

testValidInput();
//testInvalidInput();