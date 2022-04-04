'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'John Smith',
  movements: [200, 455.23, -306.5, 25000, -642.21, 1, -133.9, 2, 79.97, 1300],
  interestRate: 1.2, // %

  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    '2021-12-31T09:01:20.894Z',
    '2021-12-30T09:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 20, 100],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    '2021-12-30T09:01:20.894Z',
    new Date(),
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const formatNumber = function (value, locale, currencyy) {
  let option = {
    style: 'currency',
    currency: currencyy,
  };
  return new Intl.NumberFormat(locale, option).format(value.toFixed(2));
};

const dateDisplay = function (date, locals = 'en-US') {
  const now = new Date();
  const option = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'short',
  };

  const dayDiff = Math.round((now - date) / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff === 2) return '1 day ago';
  if (dayDiff <= 7) return `${dayDiff} days ago`;
  else {
    return new Intl.DateTimeFormat(locals, option).format(date);
  }
};

const displayMovement = function (acc, locale, curr) {
  const moveMents = acc.movements;

  containerMovements.innerHTML = '';

  moveMents.forEach(function (mov, i, array) {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = dateDisplay(date, locale);
    const displayNumber = formatNumber(mov, locale, curr);

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    let html = `<div class="movements__row">
<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
<div class="movements__date">${displayDate}</div>
<div class="movements__value">${displayNumber}</div>
</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySum = function (acc, locale, curr) {
  const moveMents = acc.movements;

  const income = moveMents
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  const incomeNum = formatNumber(income, locale, curr);

  labelSumIn.textContent = incomeNum;

  const outcome = moveMents
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);

  const outcomeNum = formatNumber(outcome, locale, curr);

  labelSumOut.textContent = outcomeNum;

  const interest = moveMents
    .filter(mov => mov > 0)
    .map(mov => (mov * curraccount.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int);

  const interestNum = formatNumber(interest, locale, curr);

  labelSumInterest.textContent = interestNum;

  const balance = moveMents.reduce((acc, mov) => acc + mov, 0);

  const balanceNum = formatNumber(balance, locale, curr);

  labelBalance.textContent = balanceNum;
};

const counter = function () {
  let time = 60 * 9;
  const Timer = () => {
    let min = Math.trunc(time / 60);
    let sec = String(time % 60).padStart(2, 0);

    if (time === -1) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in To Get Started';
      clearInterval(Timing);
    } else {
      labelTimer.textContent = `${min} : ${sec}`;
    }
    time--;
  };
  Timer();
  let Timing = setInterval(Timer, 1000);
  return Timing;
};

const username = function (acc) {
  acc.user = acc.owner
    .split(' ')
    .map(word => word[0].toLowerCase())
    .join('');
};

accounts.forEach(acc => username(acc));

//btnLogin inputLoginPin inputLoginUsername
let curraccount;
let transToacc;
let time;

const listen = function (e) {
  const name = inputLoginUsername.value;
  const pinn = Number(inputLoginPin.value);
  const now = new Date();
  let option = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  e.preventDefault();

  if (accounts.find(acc => acc.user === name)) {
    curraccount = accounts.find(acc => acc.user === name);
    const local = curraccount.locale;

    if (curraccount.pin === pinn) {
      calcDisplaySum(curraccount, curraccount.locale, curraccount.currency);
      displayMovement(curraccount, curraccount.locale, curraccount.currency);
      labelDate.textContent = new Intl.DateTimeFormat(local, option).format(
        now
      );
      if (time) clearInterval(time);
      time = counter();
    } else {
      alert('wrong password');
    }
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back ${
      curraccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    alert(`account doesn't exist`);
  }

  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const transTo = inputTransferTo.value;
    const transAmo = Number(inputTransferAmount.value);

    let balance = curraccount.movements.reduce((acc, mov) => acc + mov, 0);

    if (
      accounts.find(acc => acc.user === transTo) &&
      transAmo > 0 &&
      curraccount.user !== transTo &&
      transAmo < `${balance}`
    ) {
      transToacc = accounts.find(acc => acc.user === transTo);
      curraccount.movements.push(-transAmo);
      curraccount.movementsDates.push(new Date().toISOString());
      transToacc.movementsDates.push(new Date().toISOString());
      displayMovement(curraccount, curraccount.locale, curraccount.currency);
      calcDisplaySum(curraccount, curraccount.locale, curraccount.currency);
      transToacc.movements.push(transAmo);
    } else {
      alert(`account doesn't exist`);
    }

    inputTransferTo.value = inputTransferAmount.value = '';
  });

  let loan;
  btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    let balance = curraccount.movements.reduce((acc, mov) => acc + mov, 0);

    loan = +inputLoanAmount.value;

    inputLoanAmount.value = '';
    inputLoanAmount.blur();

    if (loan >= 0 || loan < balance) {
      curraccount.movements.push(loan);
      curraccount.movementsDates.push(new Date().toISOString());
      displayMovement(curraccount, curraccount.locale, curraccount.currency);
      calcDisplaySum(curraccount, curraccount.locale, curraccount.currency);
    } else {
      alert('Invalid');
    }
  });

  let closeaccount;
  btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    const accountname = inputCloseUsername.value;
    const accountpin = Number(inputClosePin.value);

    closeaccount = accounts.find(acc => acc.user === accountname);

    if (closeaccount.user === curraccount.user) {
      const index = accounts.findIndex(acc => acc.user === curraccount.user);

      if (accountpin === curraccount.pin) {
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
        labelWelcome.textContent = 'Log in To Get Started';
      } else {
        alert('wrong password');
      }
    } else {
      alert('username or password is wrong');
    }
  });
  let sorted = false;
  let notSortedarr = curraccount.movements;
  btnSort.addEventListener('click', function (e) {
    e.preventDefault();

    let sortedarr = [...curraccount.movements].sort((a, b) => a - b);

    btnSort.textContent = !sorted ? 'Unsort' : 'Sort';
    btnSort.style.fontSize = 'large';
    curraccount.movements = !sorted ? sortedarr : notSortedarr;
    displayMovement(curraccount, curraccount.locale, curraccount.currency);

    sorted = !sorted;
  });
}; //main listen fun

document.addEventListener('click', function () {
  if (time) clearInterval(time);
  time = counter();
});

btnLogin.addEventListener('click', listen);

inputLoginPin.addEventListener('keypress', function (event) {
  if (event.key === 'enter') {
    listen();
  }
});
