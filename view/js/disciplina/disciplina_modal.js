document.addEventListener('DOMContentLoaded', function () {
    function toggleCalendar(picker) {
    const calendar = picker.querySelector('.calendar');
    calendar.style.display = calendar.style.display === 'block' ? 'none' : 'block';
    }

    function createCalendar(picker) {
    const calendar = picker.querySelector('.calendar');
    const input = picker.querySelector('input');
    const currentDate = new Date();
    calendar.innerHTML = `
        <table>
        <thead>
            <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            </tr>
        </thead>
        <tbody>
            <!-- Calendar days will be populated here -->
        </tbody>
        </table>
    `;
    const tbody = calendar.querySelector('tbody');
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    let days = '<tr>';
    for (let i = 0; i < firstDay; i++) {
        days += '<td></td>';
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days += `<td>${i}</td>`;
        if ((i + firstDay) % 7 === 0) {
        days += '</tr><tr>';
        }
    }
    days += '</tr>';
    tbody.innerHTML = days;

    tbody.addEventListener('click', function (e) {
        if (e.target.tagName === 'TD' && e.target.innerText) {
        const day = String(e.target.innerText).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const hour = '23';
        const minute = '50';
        input.value = `${year}-${month}-${day} ${hour}:${minute}`;
        calendar.style.display = 'none';
        }
    });
    }

    function restrictInput(input) {
    input.addEventListener('input', function () {
        const value = input.value.replace(/\D/g, '');
        if (value.length >= 8) {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);
        input.value = `${year}-${month}-${day} `;
        } else if (value.length >= 6) {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        input.value = `${year}-${month}-`;
        } else if (value.length >= 4) {
        const year = value.substring(0, 4);
        input.value = `${year}-`;
        } else {
        input.value = value;
        }
    });

    input.addEventListener('blur', function () {
        const [datePart, timePart] = input.value.split(' ');
        if (datePart) {
        const [year, month, day] = datePart.split('-');
        const validYear = /^\d{4}$/.test(year);
        const validMonth = /^(0[1-9]|1[0-2])$/.test(month);
        const daysInMonth = new Date(year, month, 0).getDate();
        const validDay = new RegExp(`^(0[1-9]|[12][0-9]|3[01])$`).test(day) && day <= daysInMonth;

        if (!validYear || !validMonth || !validDay) {
            input.value = '';
        }
        }

        if (timePart) {
        const [hour, minute] = timePart.split(':');
        const validHour = /^(0[0-9]|1[0-9]|2[0-3])$/.test(hour);
        const validMinute = /^[0-5][0-9]$/.test(minute);

        if (!validHour || !validMinute) {
            input.value = input.value.split(' ')[0];
        }
        }
    });
    }

    const pickers = document.querySelectorAll('.datetime-picker');
    pickers.forEach(picker => {
    const input = picker.querySelector('input');
    input.addEventListener('focus', function () {
        toggleCalendar(picker);
    });
    createCalendar(picker);
    restrictInput(input);
    });

    document.addEventListener('click', function (e) {
    pickers.forEach(picker => {
        if (!picker.contains(e.target)) {
        picker.querySelector('.calendar').style.display = 'none';
        }
    });
    });
});