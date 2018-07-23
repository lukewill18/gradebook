let num_tests = 0;
let num_caught = 0;

function tryFunction(func, name) {
    ++num_tests;
    console.log("Testing", func.name, "with input:", name);
    try {
        func(name);
        return true;
    }
    catch(e) {
        ++num_caught;
        console.log("Error caught successfully");
    }
}

function name_testNumWords() {
    tryFunction(validateName, "Bob");
}

function name_testEmpty() {
    tryFunction(validateName, "");
    tryFunction(validateName, "     ");
}

function name_testCharacters() {
    tryFunction(validateName, "123");
    tryFunction(validateName, "Bob 1");
    tryFunction(validateName, "Bob!");
    tryFunction(validateName, "Bob Jr.");
}

function grade_testDigits() {
    tryFunction(validateGrade, "asdf");
    tryFunction(validateGrade, "10.o");
    tryFunction(validateGrade, "10%");
}

function grade_testEmpty() {
    tryFunction(validateGrade, "");
    tryFunction(validateGrade, "     ");
}

function grade_testRange() {
    tryFunction(validateGrade, "-1");
    tryFunction(validateGrade, "100.1");
}

function testAll() {
    name_testNumWords();
    name_testEmpty();
    name_testCharacters();
    grade_testDigits();
    grade_testEmpty();
    grade_testRange();
    console.log("Caught", num_caught, "out of", num_tests, "errors.");
}