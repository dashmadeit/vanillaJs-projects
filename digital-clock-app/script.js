let clock = document.getElementById("clock");

console.log(clock);

//Added a helper zero pad here:
const pad = n => String(n).padStart(2, "0");

const formatNow = () => {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const ampm = hours >= 12 ? "PM" : "AM";

    //Then I'll fomart the hours to 12-hour with AM/PM
    
    hours = hours % 12;
    if(hours === 0) hours = 12;

    return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)} ${ampm}`;

};

const updateClock = () => {
    clock.textContent = formatNow();
};
updateClock();

setInterval(updateClock, 1000);

