"use strict";
// Домашнее задание:
// Бизнес поставил вам задачу добавить новую возможность в код (какую - написано ниже)
// Сначала разорвите зависимость так, чтобы можно было запустить тесты на старый код
// Затем подготовьте код к изменениям, рефакторя маленькими шагами
// В конце добавьте новую функциональность

// Введение в бизнес:
// Вы разрабатываете ПО для сети магазинов в США
// Налоговое законодательство здесь строгое и индивидуально для каждого штата
// Налог на товар складывается из базовой ставки и дополнительной ставки по категориям товаров
// Для некоторых категорий товаров налог отменяется полностью
// Для некоторых категорий товаров дополнительной ставки нет
// ----
// Сеть расширяется и вас просят добавить новые штаты каждую неделю
// Сегодня вам надо будет добавить два штата:
// Tennessee и Texas
// В Tennessee (Базовая ставка: 7%, Groceries: +5%, Prepared food: базовая, Prescription drug: базовая )
// В Texas (Базовая ставка: 6.25%, Groceries: налога нет, Prepared food: базовая, Prescription drug: налога нет )

// Вопросы и Ответы:
// Как запустить тесты?
// Закомментируейте вызов production(), раскомментируйте runTest(), запустите файл

// Какие зависимости разрывать?
// Посмотрите на тесты. Они уже ожидают функцию, которая считает сумму с налогом.
// Двигайтесь в этом направлении

// На что будет обращаться внимание при проверке?
// Главный критерий - удобство добавления новых штатов
// Следующие по важности:
// Читаемость кода
// Наличие очевидных smell'ов
// Частые коммиты, тесты проходят после кадого коммита

//############################
// Этот код можно менять как угодно

var items = {
    "milk": {price: 5.5, type: "Groceries"},
    "eggs": {price: 3.0, type: "Groceries"},
    "coca-cola": {price: 0.4, type: "Groceries"},
    "amoxicillin": {price: 6.7, type: "Groceries"},
    "aspirin": {price: 0.2, type: "PrescriptionDrug"},
    "marijuana": {price: 1.4, type: "PrescriptionDrug"},
    "hamburger": {price: 2, type: "PreparedFood"},
    "ceasar salad": {price: 4.2, type: "PreparedFood"},
};


class State {
    constructor(name, baseTax, itemTypeTax) {
        this._name = name;
        this._baseTax = baseTax;
        this._itemTypeTax = itemTypeTax;
    };

    get name() {
        return this._name;
    };

    calcTax(itemType) {
        if (!(itemType in this._itemTypeTax)){
            return this._baseTax;
        } else if (this._itemTypeTax[itemType] === "") {
            return 0;
        }
        return this._baseTax + this._itemTypeTax[itemType];
    };

    priceFor(item){
        var itemObj = items[item];
        return (1 + this.calcTax(itemObj.type)) * (itemObj.price);
    }

}

var states = [
    new State("Alabama",0.04,{"Groceries":0,"PrescriptionDrug":""}),
    new State("Alaska",0,{"Groceries":0,"PrescriptionDrug":0}),
    new State("Arizona",0.056,{"Groceries":"","PrescriptionDrug":""}),
    new State("Arkansas",0.065,{"Groceries":0.015,"PrescriptionDrug":""}),
    new State("California",0.075,{"Groceries":"","PrescriptionDrug":""}),
    new State("Colorado",0.029,{"Groceries":"","PrescriptionDrug":""}),
    new State("Connecticut",0.0635,{"Groceries":"","PrescriptionDrug":""}),
]

function getState(name){
    for (var i = 0; i < states.length; i++) {
        if (name === states[i].name){
            return states[i];
        }
    }
}


class TaxCalculator {
    // У этой функции нелья менять интерфейс
    // Но можно менять содержимое
    calculateTax() {
        var ordersCount = getOrdersCount();
        var state = getSelectedState();
        console.log(`----------${state}-----------`);
        for (var i = 0; i < ordersCount; i++) {
            var item = getSelectedItem();
            var result = getState(state).priceFor(item);
            console.log(`${item}: $${result.toFixed(2)}`);
        }
        console.log(`----Have a nice day!-----`);
    }
}

//############################
//Production - код:
//production();

//############################
//Тесты:
var tests = [
    () => assertEquals(3.0 * (1 + 0.04), getState("Alabama").priceFor("eggs")),
    () => assertEquals(0.4 * (1 + 0.015 + 0.065), getState("Arkansas").priceFor("coca-cola")),
    () => assertEquals(6.7 * (1 + 0.0), getState("Alaska").priceFor("amoxicillin")),
    () => assertEquals(6.7 * (1 + 0.0), getState("California").priceFor("amoxicillin")),
    () => assertEquals(2 * (1 + 0.0635), getState("Connecticut").priceFor("hamburger")),
];
//Раскомментируйте следующую строчку для запуска тестов:
runTests (tests);

//############################
//Код ниже этой строчки не надо менять для выполнения домашней работы

function production(){
    var calculator = new TaxCalculator();
    calculator.calculateTax();
}

function getSelectedItem(){
    var items = ["milk", "eggs", "coca-cola", "amoxicillin", "aspirin", "marijuana", "hamburger", "ceasar salad"];
    return items[Math.floor(Math.random() * items.length)];
}

function getSelectedState(){
    var state = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut"];
    return state[Math.floor(Math.random() * state.length)];
}

function getOrdersCount(){
    return Math.floor(Math.random() * 3) + 1;
}

//############################
// Кустарный способ писать тесты

function assertEquals (expected, actual) {
    var epsilon = 0.000001;
    var difference = Math.abs(expected - actual);
    if ( difference > epsilon || difference === undefined || isNaN(difference)) {
        console.log(`Fail! Expected: ${expected}, Actual: ${actual}` );
        return -1;
    }
    return 0;
}

function runTests (tests) {
    var failedTests = tests
        .map((f) => f())
        .map((code) => {if (code === -1) {return 1} else {return 0}})
        .reduce((a, b) => a + b, 0);

    if (failedTests === 0) {
        console.log(`Success: ${tests.length} tests pass`);
    }
    else {
        console.log(`Fail: ${failedTests} tests failed`);
    }
}

