'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2023-06-10T14:43:26.374Z',
        '2023-06-13T16:33:06.386Z',
        '2023-06-14T18:49:59.371Z',
        '2023-06-15T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2023-06-10T14:43:26.374Z',
        '2023-06-13T16:33:06.386Z',
        '2023-06-14T18:49:59.371Z',
        '2023-06-15T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};


const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2023-06-10T14:43:26.374Z',
        '2023-06-13T16:33:06.386Z',
        '2023-06-14T18:49:59.371Z',
        '2023-06-15T12:01:20.894Z',
    ],
    currency: 'CNY',
    locale: 'zh-CN',
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    movementsDates: [
        '2020-01-25T14:18:46.235Z',
        '2023-06-10T14:43:26.374Z',
        '2023-06-13T16:33:06.386Z',
        '2023-06-14T18:49:59.371Z',
        '2023-06-15T12:01:20.894Z',
    ],
    currency: 'INR',
    locale: 'en-IN',
};

const accounts = [account1, account2, account3, account4];


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

const formattedCurrency = (acc) => new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency
});


function updateUI(acc) {
    calcBalance(acc);
    displayMovements(acc);
    calculateSummary(acc);
    resetTimer();
}

function displayMovements(account, sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
    movs.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const date = displayDate(new Date(account.movementsDates[i]), account.locale);
        const currency = formattedCurrency(account).format(mov);
        const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
            <div class = "movements__date">${date}</div>
            <div class="movements__value">${currency}</div>
            </div>
            `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}


function displayDateTop(newDate) {
    const locale = navigator.language;
    const dateFormat = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }
    return new Intl.DateTimeFormat(locale, dateFormat).format(newDate);
}


function displayDate(oldDate, locale) {
    const newDate = new Date();
    const diff = calcDaysPassed(newDate, oldDate);
    const dateFormat = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }
    const hourFormat = {
        hour: 'numeric',
        minute: 'numeric',
    }
    const hourMinutes = new Intl.DateTimeFormat(locale, hourFormat).format(oldDate);
    if (diff === 0) return `Today, ${hourMinutes}`;
    else if (diff === 1) return `Yesterday, ${hourMinutes}`;
    else if (diff <= 7) return `${diff} days ago, ${hourMinutes}`;
    else return new Intl.DateTimeFormat(locale, dateFormat).format(oldDate);
}


function calcBalance(acc) {
    acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0).toFixed(2);
    const currency = formattedCurrency(acc).format(acc.balance);
    labelBalance.textContent = `${currency}`;
}


function createUsernames(accountsArray) {
    accountsArray.forEach(function(account) {
        account.username = account.owner
            .toLowerCase()
            .split(' ')
            .map(un => un[0])
            .join('');
    });
}
createUsernames(accounts);

function calculateSummary(account) {
    const deposit = account.movements.filter(mov => mov > 0);
    const withdrawals = account.movements.filter(mov => mov < 0);
    const interest = deposit.map(deposit => deposit * (account.interestRate / 100)).filter(int => int > 1);
    const totalDeposits = deposit.reduce((arr, curr) => arr + curr, 0).toFixed(2);
    const totalWithdrawals = Math.abs(withdrawals.reduce((arr, curr) => arr + curr, 0)).toFixed(2);
    const totalInterest = interest.reduce((arr, curr) => arr + curr, 0).toFixed(2);

    labelSumIn.textContent = formattedCurrency(account).format(totalDeposits);
    labelSumOut.textContent = formattedCurrency(account).format(totalWithdrawals);
    labelSumInterest.textContent = formattedCurrency(account).format(totalInterest);
}


function startLogOutTimer() {
    let time = 10 * 60;

    function tick() {
        const min = String(Math.trunc(time / 60)).padStart(2, '0');
        const sec = String(time % 60).padStart(2, '0');
        labelTimer.textContent = `${min}:${sec}`;
        if (time === 0) {
            clearInterval(startLogOutTimer);
            labelWelcome.textContent = `Log in to get started`;
            containerApp.style.opacity = 0;
        }
        time--;
    }
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
}

function resetTimer() {
    if (timer) {
        clearInterval(timer);
    }
    timer = startLogOutTimer();
}



let currentAccount, timer;

btnLogin.addEventListener('click', function(e) {
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    (currentAccount && Number(inputLoginPin.value) === currentAccount.pin) ? currentAccount = currentAccount: console.log('Wrong Credentials');
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    labelDate.textContent = displayDateTop(new Date());
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
    updateUI(currentAccount);
});

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();
    const amt = Number(inputTransferAmount.value);
    const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
    if (receiverAccount && amt > 0 && currentAccount.balance > amt && receiverAccount.username !== currentAccount.username) {
        currentAccount.movements.push(-amt);
        receiverAccount.movements.push(amt);
        currentAccount.movementsDates.push(new Date());
        receiverAccount.movementsDates.push(new Date());
        updateUI(currentAccount);
    }
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();

});


btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const amt = Number(inputLoanAmount.value);
    if (amt < currentAccount.balance && currentAccount.movements.some(mov => mov > amt * 0.1)) {
        setTimeout(() => {
            currentAccount.movements.push(amt);
            currentAccount.movementsDates.push(new Date());
            updateUI(currentAccount);
        }, 3500);
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
    }
});


btnClose.addEventListener('click', function(e) {
    e.preventDefault();
    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const i = accounts.findIndex(acc => acc.username === currentAccount.username);
        accounts.splice(i, 1);
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

let sortingStatus = false;
btnSort.addEventListener('click', function(e) {
    e.preventDefault();
    displayMovements(currentAccount, !sortingStatus);
    sortingStatus = !sortingStatus;
});