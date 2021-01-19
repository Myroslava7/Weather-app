
let activeEl;
let coordCity,
    coordLon,
    coordLat,
    coordNameCity;
let duration;
let elID;
let hourlyFiveDays = document.querySelector('.hourly_fiveDays');
let wrapError = document.querySelector('#error-mess');
function openWeather(evt, days) {
    let tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace('active', '');
    }
    console.log(days)
    evt.currentTarget.className += ' active';
    document.getElementById(days).style.display = 'block';
}
document.getElementById('defaultOpen').click();
class AddEl {
    constructor(selector) {
        this.selector = selector;
        this.element = document.querySelector(this.selector);
    }
    addElement(tag, content, classEl, parent) {
        const el = document.createElement(tag);
        el.innerHTML = content;
        el.className = classEl;
        parent.append(el);
        return el;
    }
}
function getCoord(coordIP) {
    coordCity = coordIP.loc;
    coordNameCity = coordIP.city;
    coordLat = coordCity.split(',')[0];
    coordLon = coordCity.split(',')[1];
    document.getElementById('city-search').value = `${coordIP.city} ${coordIP.country}`;
}
function searchCoord(coordBySearch) {
    coordLon = coordBySearch.coord.lon;
    coordLat = coordBySearch.coord.lat;
}
function durationT(data) {
    let dt1 = data.current.sunrise;
    let dt2 = data.current.sunset;
    let d = ((dt2 - dt1) / 3600).toString().split('.');
    let h = d[0];
    let m = d[1].slice(0, 2);
    if (m > 59) {
        h = +h + 1;
        m = m - 60;
        if (m < 10) {
            m = m + '0'
        }
    }
    else if (m < 10 && m >= 6) {
        m = m + '0';
        h = +h + 1;
        m = m - 60;
    }
    duration = `${h}:${m}`;
}
function formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    let yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;
    return dd + '.' + mm + '.' + yy;
}
function convertTimestamp(timestamp) {
    let d = new Date(timestamp * 1000);
    let yyyy = d.getFullYear();
    let mm = ('0' + (d.getMonth() + 1)).slice(-2);
    let dd = ('0' + d.getDate()).slice(-2);
    let hh = d.getHours();
    let h = hh;
    let min = ('0' + d.getMinutes()).slice(-2);
    let ampm = 'AM';
    let time;
    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }
    time = `${yyyy}-${mm}-${dd}, ${h}:${min} ${ampm}`;
    return time;
}
function addCurent(data) {
    let curent = document.querySelector('.current');
    let temp = Math.round(data.current.temp);
    let feelsLike = Math.round(data.current.feels_like);
    let today1 = formatDate(new Date());
    let Sunrise = convertTimestamp(data.current.sunrise).slice(12);
    let Sanset = convertTimestamp(data.current.sunset).slice(12);
    durationT(data);
    curent.innerHTML = `
    <div>
        <h2>CURRENT WEATHER</h2>
        <h2>${today1}</h2>
    </div>
    <div class="add_curent">
    <div>
        <img src='../IMG_Weather/${data.current.weather[0].icon}.png'>
        <p>${data.current.weather[0].main}</p>
    </div>
    <div class='temp'>
        <p>${temp}&#176;С</p>
        <p>Real Feel ${feelsLike}&#176;С</p>
    </div>
    <div>
        <p>Sunrise: ${Sunrise}</p>
        <p>Sanset: ${Sanset}</p>
        <p>Duration: ${duration} hr</p>
    </div>
    </div>`
}
function curentHourly(data) {
    let hourlyToday = document.querySelector('.hourly_today')
    let hourly = data.hourly.slice(0, 6);
    let content1 = `
    <div class='hourly-first'>
    <h3>TODAY</h3>
    <img src='../IMG_Weather/empty.png'>
    <p>Forecast</p>
    <div><p>Temp (&#176;С)</p></div>
    <div><p>RealFiel</p></div>
    <div><p>Wind(km/h)</p></div>
    </div>`;
    let content = hourly.map(item => `
    <div class='hourly'>
    <h3>${convertTimestamp(item.dt).slice(12)}</h3>
    <img src='../IMG_Weather/${item.weather[0].icon}.png'>
    <p>${item.weather[0].main}</p>
    <div><p>${Math.round(item.temp)}&#176;С</p></div>
    <div><p>${Math.round(item.feels_like)}&#176;С</p></div>
    <div><p>${Math.round(item.wind_speed)}(km/h)</p></div>
    </div>
    `);
    hourlyToday.innerHTML = `<h2>HOURLY</h2>`
    let add = new AddEl;
    add.addElement('div', content1 + content.join(''), 'wrap-hourly', hourlyToday);
    hourlyFiveDays.innerHTML = `<h2>HOURLY</h2>`;
    let addFive = new AddEl;
    addFive.addElement('div', content1 + content.join(''), 'wrap-hourly', hourlyFiveDays)
}
function addNearbyPlaces(near) {
    let nearby = document.querySelector('.nearby')
    let content = near.list.map(item => `<div class='box'>
        <div><p>${item.name}</p></div>
        <div class='pic'><img src='../IMG_Weather/${item.weather[0].icon}.png'></div>
        <div>${Math.round(item.main.temp)}&#176;С</div>
        </div>` );
    nearby.innerHTML = `<h2>NEARBY PLACES</h2>`
    let add = new AddEl;
    add.addElement('div', content.join(''), 'wrap-nearby', nearby);
}
function fiveDaysWeather(data) {
    let fiveDays = document.querySelector('.by-five-days');
    let daily1 = data.daily.slice(0, 1);
    let daily2 = data.daily.slice(1, 5);
    console.log(daily1)
    console.log(data.daily)
    let content1 = daily1.map(item => `
    <div class="five-days first active" data-id=${convertTimestamp(item.dt).toString().slice(0, 10)}>
    <h2>TODAY</h2>
    <p>${new Date(item.dt * 1000).toString().slice(3, 10)}</p>
    <div id='first' class='pic'><img src='../IMG_Weather/${item.weather[0].icon}.png'></div>
    <p>${Math.round(item.temp.day)}&#176;С</p>
    <p>${item.weather[0].main}</p>
    </div>
    `);
    let content2 = daily2.map(item => `
    <div class="five-days" data-id=${convertTimestamp(item.dt).toString().slice(0, 10)}>
    <h2>${new Date(item.dt * 1000).toString().slice(0, 3)}</h2>
    <p>${new Date(item.dt * 1000).toString().slice(3, 10)}</p>
    <div class='pic'><img src='../IMG_Weather/${item.weather[0].icon}.png'></div>
    <p>${Math.round(item.temp.day)}&#176;С</p>
    <p>${item.weather[0].main}</p>
    </div>
    `);
    const wrapFiveDay = document.createElement('div');
    wrapFiveDay.classList.add('wrap-five');
    wrapFiveDay.innerHTML = content1 + content2.join('');
    fiveDays.innerHTML = '';
    fiveDays.prepend(wrapFiveDay);
    wrapFiveDay.addEventListener('click', checkDay);
    activeEl = document.querySelector('.first');
}
function checkDay(event) {
    const el = event.target.closest('.five-days');
    if (el) {
        if (activeEl) {
            activeEl.classList.remove('active');
        }
        // console.log(activeEl)
        if (el) {
            activeEl = el;
            el.classList.add('active');
            // console.log(el)
            elID = el.dataset.id;
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordLat}&lon=${coordLon}&units=metric&appid=5c7bf69bf49ec29f3911aa5565f30578`)// 5day by 3hour
                .then(function (resp) { return resp.json() })
                .then(function (fiveDays) {
                    fiveDaysHourly(fiveDays, elID);
                })
                .catch(function () {
                    console.log('error')
                });
        }
    }
}
function fiveDaysHourly(fiveDays, elID) {

    let arr = fiveDays.list;
    let brr = arr.filter(item => {
        return item.dt_txt.includes(`${elID}`)
    })
    let hourly = brr.slice(0, 6);
    let dayOfWeek = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };
    let content1 = `
    <div class='hourly-first'>
        <h3>${dayOfWeek[new Date(hourly[0].dt * 1000).toString().slice(0, 3)].toUpperCase()}</h3>
        <img src='../IMG_Weather/empty.png'>
        <p>Forecast</p>
        <div><p>Temp (&#176;С)</p></div>
        <div><p>RealFiel</p></div>
        <div><p>Wind(km/h)</p></div>
    </div>
    `;
    let content = hourly.map(item => `
    <div class='hourly'>
        <h3>${convertTimestamp(item.dt).slice(12)}</h3>
        <img src='../IMG_Weather/${item.weather[0].icon}.png'>
        <p>${item.weather[0].main}</p>
        <div><p>${Math.round(item.main.temp)}&#176;С</p></div>
        <div><p>${Math.round(item.main.feels_like)}&#176;С</p></div>
        <div><p>${Math.round(item.wind.speed)}(km/h)</p></div>
    </div>
    `);
    hourlyFiveDays.innerHTML = `<h2>HOURLY</h2>`;
    let add = new AddEl;
    add.addElement('div', content1 + content.join(''), 'wrap-hourly', hourlyFiveDays);
}
function search() {
    let citySearch = document.querySelector('#city-search');
    wrapError.style.display = 'block';
    citySearch = citySearch.value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&cnt=4&weather?&units=metric&appid=5c7bf69bf49ec29f3911aa5565f30578`)
        .then(function (resp) { return resp.json() })
        .then(function (coordBySearch) {
            searchCoord(coordBySearch)
        })
        .then(function (resp) {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordLat}&lon=${coordLon}&exclude=minutely,alerts&units=metric&appid=5c7bf69bf49ec29f3911aa5565f30578`)
                .then(function (resp) { return resp.json() })
                .then(function (data) {
                    addCurent(data);
                    fiveDaysWeather(data);
                    curentHourly(data)
                })
                .catch(function () {
                    console.log('error')
                });
        })
        .then(function (resp) {
            fetch(`https://api.openweathermap.org/data/2.5/find?lat=${coordLat}&lon=${coordLon}&cnt=4&weather?&units=metric&appid=5c7bf69bf49ec29f3911aa5565f30578`)// nearby by city//
                .then(function (resp) { return resp.json() })
                .then(function (data) {
                    addNearbyPlaces(data);
                })
                .catch(function () {
                    console.log('error')
                });
        })
        .catch(function () {
            console.log(`${citySearch} could not be found`);
            ErrorMessage(citySearch)
        });
    console.log(citySearch)
    citySearch.value = '';

    let errorBlock = document.querySelector('.error');
    if (errorBlock) {
        errorBlock.remove();
        console.log(errorBlock)
    }
}
function ErrorMessage(citySearch) {
    let wrapError = document.querySelector('#error-mess');
    let wrapForecast = document.querySelector('#wrap_forecast');
    let content = `
    <div>
    <p>${citySearch} could not be found.</p>
    <p>Please enter a different location.</p>
    </div> `;
    wrapError.style.display = 'none';
    let errorMessage = new AddEl;
    errorMessage.addElement('div', content, 'error', wrapForecast);
}
fetch("https://ipinfo.io?token=b30f6c239c3f75")//GET IP
    .then(function (resp) { return resp.json() })
    .then(function (coordIP) {
        getCoord(coordIP);
    })
    // onecoll
    .then(function (resp) {
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordLat}&lon=${coordLon}&exclude=minutely,alerts&units=metric&appid=5c7bf69bf49ec29f3911aa5565f30578`)
            .then(function (resp) { return resp.json() })
            .then(function (data) {
                addCurent(data);
                fiveDaysWeather(data);
                curentHourly(data)
            })
            .catch(function () {
                console.log('error')
            });
    })
    // nearby by city           //
    .then(function (resp) {
        fetch(`https://api.openweathermap.org/data/2.5/find?lat=${coordLat}&lon=${coordLon}&cnt=4&weather?&units=metric&appid=5c7bf69bf49ec29f3911aa5565f30578`)// nearby by city//
            .then(function (resp) { return resp.json() })
            .then(function (data) {
                addNearbyPlaces(data);
            })
            .catch(function () {
                console.log('error')
            });
    })
    .catch(function () {
        console.log('error');
    });
