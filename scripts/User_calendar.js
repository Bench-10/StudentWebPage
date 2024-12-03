const philippineHolidays = {
    '1/1': { name: 'New Year\'s Day' },
    '2/25': { name: 'EDSA People Power Revolution' },
    '4/9': { name: 'Araw ng Kagitingan' },
    '5/1': { name: 'Labor Day' },
    '6/12': { name: 'Independence Day' },
    '8/21': { name: 'Ninoy Aquino Day' },
    '11/1': { name: 'All Saints\' Day' },
    '11/30': { name: 'Bonifacio Day' },
    '12/25': { name: 'Christmas Day' },
    '12/30': { name: 'Rizal Day' },
};

const appointments = {};
let selectedDate = null;
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const currentDate = new Date();
const calendarElement = document.getElementById('calendar');
const monthYearElement = document.getElementById('month-year');
const selectedDateElement = document.getElementById('selected-date');
const appointmentInfoElement = document.getElementById('appointment-info');
const holidayInfoElement = document.getElementById('holiday-info');
const workingHoursElement = document.getElementById('working-hours');
const proceedButton = document.getElementById('proceed-button');
const popupContainer = document.getElementById('popup-container');
const closePopupButton = document.getElementById('close-popup');
const nextButton = document.getElementById('next-button');
const appointmentsByDate = {};

let isFormInProgress = false;

// Load existing appointments from localStorage if any exist
const savedAppointments = localStorage.getItem('appointments');
const savedAppointmentsByDate = localStorage.getItem('appointmentsByDate');

if (savedAppointments) {
    Object.assign(appointments, JSON.parse(savedAppointments));
}
if (savedAppointmentsByDate) {
    Object.assign(appointmentsByDate, JSON.parse(savedAppointmentsByDate));
}

// Update the calendar to reflect any loaded appointments
updateCalendar();

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    calendarElement.innerHTML = '';

    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('day-header');
        dayHeader.textContent = day;
        calendarElement.appendChild(dayHeader);
    });

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarElement.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toDateString();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dayElement = document.createElement('div');
        dayElement.classList.add('date');
        dayElement.textContent = day;
        dayElement.dataset.date = dateString;

        // Disable past dates
        if (date < today) {
            dayElement.classList.add('disabled');
            dayElement.style.cursor = 'not-allowed';
            dayElement.style.color = '#ccc';
        } else {
            const counts = updateAppointmentCount(dateString);
            if (counts.available === 0) {
                dayElement.classList.add('full');
            }
            

            dayElement.addEventListener('click', () => selectDate(dateString));
        }

        if (dateString === new Date().toDateString()) {
            dayElement.classList.add('today');
        }

        if (philippineHolidays[`${month + 1}/${day}`]) {
            dayElement.classList.add('holiday');
            dayElement.dataset.holiday = philippineHolidays[`${month + 1}/${day}`].name;
            dayElement.style.cursor = 'not-allowed';
        }

        calendarElement.appendChild(dayElement);
    }
}

function updateAppointmentCount(dateString) {
    const appointmentsByDate = JSON.parse(localStorage.getItem('appointmentsByDate') || '{}');
    const currentCount = appointmentsByDate[dateString]?.length || 0;
    const maxAppointments = 50; // Maximum appointments per day
    
    return {
        available: maxAppointments - currentCount,
        total: maxAppointments
    };
}

function selectDate(dateString) {
    if (!dateString) return;

    const selectedDateObj = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent selecting past dates
    if (selectedDateObj < today) {
        alert('Cannot schedule appointments for past dates');
        return;
    }

    // Set the selected date
    selectedDateElement.textContent = dateString;
    clearAppointmentDetails();

    // Fetch current appointment count for the selected date
    fetch(`api/get_date_appointments_count.php?date=${dateString}`)
        .then(response => response.json())
        .then(data => {
            const maxAppointments = 50;
            const currentCount = data.count;
            const availableSlots = maxAppointments - currentCount;

            if (philippineHolidays[`${selectedDateObj.getMonth() + 1}/${selectedDateObj.getDate()}`]) {
                holidayInfoElement.textContent = `${philippineHolidays[`${selectedDateObj.getMonth() + 1}/${selectedDateObj.getDate()}`].name} - No Working Hours`;
                proceedButton.style.display = 'none';
            } else {
                holidayInfoElement.textContent = '';
                if (availableSlots > 0) {
                    proceedButton.style.display = 'inline-block';
                    proceedButton.disabled = false;
                    proceedButton.style.opacity = '1';
                    proceedButton.style.cursor = 'pointer';
                    appointmentInfoElement.textContent = 
                        `${currentCount} Appointment(s) Scheduled - ${availableSlots} slots available`;
                } else {
                    proceedButton.style.display = 'none';
                    appointmentInfoElement.textContent = 'Fully Booked';
                }
            }

            // Update the global selectedDate variable
            selectedDate = dateString;
            updateAppointmentList(dateString);
        })
        .catch(error => {
            console.error('Error fetching appointment count:', error);
        });
}

proceedButton.addEventListener('click', () => {
    if (selectedDate && !isFormInProgress) {
        isFormInProgress = true;
        proceedButton.disabled = true;
        proceedButton.style.opacity = '0.5';
        proceedButton.style.cursor = 'not-allowed';
        popupContainer.classList.add('active');
    }
});

nextButton.addEventListener('click', () => {
    popupContainer.classList.add('active');
});

closePopupButton.addEventListener('click', () => {
    popupContainer.classList.remove('active');
    isFormInProgress = false;
    proceedButton.disabled = false;
    proceedButton.style.opacity = '1';
    proceedButton.style.cursor = 'pointer';
});

const appointmentsListContainer = document.querySelector('#appointments-list');
const mainContainer = document.querySelector('.main-container');

let appointmentData = [];

document.getElementById('appointment-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const appointmentDetails = {
        dateString: selectedDate,
        fullName: document.getElementById('full-name').value,
        program: document.getElementById('program').value,
        contactNumber: document.getElementById('contact-number').value,
        yearLevel: document.getElementById('year-level').value,
        documentation: Array.from(document.querySelectorAll('input[name="documentation"]:checked'))
            .map(checkbox => checkbox.value)
            .join(', ')
    };

    try {
        const response = await fetch('api/submit_appointment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentDetails)
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Appointment successfully scheduled!');
            document.getElementById('appointment-form').reset();
            updateCalendar();
            popupContainer.classList.remove('active');
            
            // Reset form progress state but don't disable proceed button
            isFormInProgress = false;
            
            // Refresh the selected date info and appointments list
            if (selectedDate) {
                selectDate(selectedDate);
                updateAppointmentList(selectedDate);
            }
        } else {
            alert('Error scheduling appointment');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error scheduling appointment');
    }
});

function showAppointmentDetails(appointment, clickedElement) {
    // Remove any existing detail containers
    const existingDetailsContainer = document.querySelector('.appointment-detail-container');
    if (existingDetailsContainer) {
        existingDetailsContainer.remove();
    }

    const appointmentDetailContainer = document.createElement('div');
    appointmentDetailContainer.classList.add('appointment-detail-container');
    appointmentDetailContainer.style.cssText = `
        border: 1px solid #ccc;
        padding: 10px;
        margin-top: 5px;
        position: relative;
        background-color: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
        width: calc(100% - 20px);
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        border: none;
        background-color: transparent;
        font-size: 18px;
        cursor: pointer;
        color: #666;
        padding: 0 5px;
    `;

    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        appointmentDetailContainer.remove();
    });

    appointmentDetailContainer.innerHTML = `
        <h4 style="margin-top: 0; margin-bottom: 10px;">Appointment Details</h4>
        <strong>Program:</strong> ${appointment.program}<br />
        <strong>Year Level:</strong> ${appointment.year_level}<br />
        <strong>Documentation Requested:</strong> ${appointment.documentation}<br />
    `;

    appointmentDetailContainer.appendChild(closeButton);

    // Insert the details container after the clicked list item
    clickedElement.insertAdjacentElement('afterend', appointmentDetailContainer);
}

function updateAppointmentInfo(dateKey) {
    const bookedCount = appointments[dateKey] ? appointments[dateKey].count : 0;
    appointmentInfoElement.textContent = `${bookedCount} Appointment(s) Scheduled`;

    if (bookedCount >= 1000) {
        appointmentInfoElement.textContent += " - Fully Booked";
    }
}

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

function updateAppointmentList(dateString) {
    const appointmentsListContainer = document.querySelector('#appointments-list');
    appointmentsListContainer.innerHTML = ''; // Clear existing appointments

    // Fetch appointments for the selected date
    fetch(`api/get_date_appointments.php?date=${dateString}`)
        .then(response => response.json())
        .then(appointments => {
            if (appointments.length === 0) {
                appointmentsListContainer.innerHTML = '<li>No appointments for this date</li>';
            } else {
                appointments.forEach(appointment => {
                    const listItem = document.createElement('li');
                    listItem.textContent = appointment.full_name;
                    listItem.style.cursor = 'pointer';
                    listItem.addEventListener('click', () => showAppointmentDetails(appointment, listItem));
                    appointmentsListContainer.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
            appointmentsListContainer.innerHTML = '<li>Error loading appointments</li>';
        });
}

function clearAppointmentDetails() {
    const detailContainers = document.querySelectorAll('.appointment-detail-container');
    detailContainers.forEach(container => container.remove());
}

document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const monthYearElement = document.getElementById('month-year');
    const selectedDateElement = document.getElementById('selected-date');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    
    let currentDate = new Date();
    
    function updateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthYearElement.textContent = `${monthNames[month]} ${year}`;
        calendarElement.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.classList.add('day-header');
            dayHeader.textContent = day;
            calendarElement.appendChild(dayHeader);
        });

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            calendarElement.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toDateString();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dayElement = document.createElement('div');
            dayElement.classList.add('date');
            dayElement.textContent = day;
            dayElement.dataset.date = dateString;

            // Disable past dates
            if (date < today) {
                dayElement.classList.add('disabled');
                dayElement.style.cursor = 'not-allowed';
                dayElement.style.color = '#ccc';
            } else {
                const counts = updateAppointmentCount(dateString);
                if (counts.available === 0) {
                    dayElement.classList.add('full');
                }
                dayElement.addEventListener('click', () => selectDate(dateString));
            }

            if (dateString === today.toDateString()) {
                dayElement.classList.add('today');
            }

            const dateKey = `${month + 1}/${day}`;
            if (philippineHolidays[dateKey]) {
                dayElement.classList.add('holiday');
                dayElement.dataset.holiday = philippineHolidays[dateKey].name;
                dayElement.style.cursor = 'not-allowed';
            }

            calendarElement.appendChild(dayElement);
        }
    }

    // Event listeners for month navigation
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });

    // Initial calendar update
    updateCalendar();
});





