const currentDate = document.querySelector(".current-date");
const daysTag = document.querySelector(".days"),
prevNextIcon = document.querySelectorAll(".icons span");

//Getting new date , current year and month
let date = new Date();
currYear = date.getFullYear(),
currMonth = date.getMonth();

const months = ["January", "February", "March", "April",
                "May", "June", "July", "August", "September",
                "October", "November", "December"];


const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), //getting first date of month

    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(); //getting last date of month

    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(); //getting last date of month

    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); //getting last date of previous month


    let liTag = "";

    //Creating li of previous month last days
    for (let i = firstDayofMonth; i > 0; i--)
    {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    //Creating li of all all days of current month
    for (let i = 1; i <= lastDateofMonth; i++)
    {
        //Adding active class to li if the current date, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                    && currYear === new Date().getFullYear() ? "act" : "";

        liTag += `<li class="${isToday}">${i}</li>`;
    }

    //Creating li of next month first days
    for (let i = lastDayofMonth; i < 6; i++)
    {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
}

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1 ;

        //If current month is less than 0 or  greater than 11
        if(currMonth < 0 || currMonth > 11)
        {
            //Creating a new date of current year & month  and pass it as date value
            date = new Date(currYear,currMonth);

            currYear = date.getFullYear(); //Updating current year with new date year
            currMonth = date.getMonth(); //Updating current month with new date month
        }
        else
        {   //Else pass new Date as date value
            date = new Date();
        }
        renderCalendar();
    });
});