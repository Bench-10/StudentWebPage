class BillingSystem {
    constructor() {
        this.currentDate = new Date();
        this.documentFees = {
            'Diploma (₱400.00)': 400,
            'Certificate of Transfer Credentials (₱100.00)': 100,
            'Form 137 (₱100.00)': 100,
            'Certification (₱30.00)': 30,
            'Transcript of Records (₱50.00 per page)': 50,
            'Authentication (₱20.00 per page)': 20,
            'Send Copy of Registration Form (₱15.00)': 15,
            'Graduation Fee (₱1,000.00)': 1000,
            'Others, Please Specify': 0
        };
        this.init();
        this.initStatusPopup();
    }

    async fetchBillingData() {
        try {
            const dateStr = this.currentDate.toDateString();
            const response = await fetch(`api/get_billing_data.php?date=${encodeURIComponent(dateStr)}`);
            const data = await response.json();
            this.updateBillingDisplay(data);
        } catch (error) {
            console.error('Error fetching billing data:', error);
        }
    }

    updateBillingDisplay(appointments) {
        this.billingCardsContainer.innerHTML = '';
        let totalAmount = 0;
        
        appointments.forEach(appointment => {
            const card = document.createElement('div');
            card.className = 'billing-card';
            
            const amount = this.calculateFees(appointment.documentation);
            totalAmount += amount;

            const documentsList = appointment.documentation.split(',')
                .map(doc => doc.trim())
                .map(doc => `<li>${doc} - ₱${this.documentFees[doc] || 0}</li>`)
                .join('');

            card.innerHTML = `
                <div class="billing-card-header">
                    <h3>${appointment.fullName}</h3>
                    <span class="status-badge ${appointment.status}">${appointment.status.toUpperCase()}</span>
                </div>
                <div class="billing-card-details">
                    <p><strong>Program:</strong> ${appointment.program}</p>
                    <p><strong>Year Level:</strong> ${appointment.yearLevel}</p>
                    <p><strong>Contact:</strong> ${appointment.contactNumber}</p>
                    <div class="billing-documents">
                        <strong>Requested Documents:</strong>
                        <ul>${documentsList}</ul>
                    </div>
                    <p><strong>Total Amount:</strong> ₱${amount.toFixed(2)}</p>
                    ${this.getStatusButtons(appointment)}
                </div>
            `;

            // Add event listeners for status buttons
            card.querySelectorAll('.status-btn').forEach(btn => {
                btn.addEventListener('click', () => this.updateAppointmentStatus(appointment.id, btn.dataset.status));
            });

            this.billingCardsContainer.appendChild(card);
        });

        // Update summary
        this.totalTransactionsSpan.textContent = appointments.length;
        this.totalAmountSpan.textContent = totalAmount.toFixed(2);
        this.currentDateSpan.textContent = this.currentDate.toDateString();
    }

    getStatusButtons(appointment) {
        if (appointment.status === 'pending') {
            return `
                <div class="status-buttons">
                    <button class="status-btn paid" data-status="paid" data-appointment-id="${appointment.id}">Mark as Paid</button>
                    <button class="status-btn missed" data-status="missed" data-appointment-id="${appointment.id}">Mark as Missed</button>
                </div>
            `;
        }
        return '';
    }

    async updateAppointmentStatus(appointmentId, newStatus) {
        // Find the specific button that was clicked using both status and appointment ID
        const statusBtn = document.querySelector(`.status-btn[data-status="${newStatus}"][data-appointment-id="${appointmentId}"]`);
        
        if (!statusBtn) {
            console.error('Status button not found');
            this.showError('Error updating status. Please refresh the page and try again.');
            return;
        }

        try {
            statusBtn.classList.add('loading');
            statusBtn.disabled = true;
            
            // Show confirmation dialog for paid status
            if (newStatus === 'paid') {
                const confirmed = await this.showConfirmationDialog(
                    'Confirm Payment',
                    'Are you sure you want to mark this appointment as paid?'
                );
                if (!confirmed) {
                    statusBtn.classList.remove('loading');
                    statusBtn.disabled = false;
                    return;
                }
            }

            const response = await fetch('api/update_appointment_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: appointmentId,
                    status: newStatus,
                    paid_date: newStatus === 'paid' ? new Date().toISOString() : null
                })
            });

            const result = await response.json();
            if (result.success) {
                await this.fetchBillingData();
                await this.updateStatusLists();
                
                // Show payment confirmation popup if status is 'paid'
                if (newStatus === 'paid') {
                    this.showPaymentConfirmation(appointmentId);
                }
            } else {
                console.error('Failed to update appointment status');
            }
        } catch (error) {
            console.error('Error updating appointment status:', error);
            this.showError('Failed to update appointment status. Please try again.');
        } finally {
            statusBtn.classList.remove('loading');
            statusBtn.disabled = false;
        }
    }

    async showPaymentConfirmation(appointmentId) {
        try {
            // Fetch the updated appointment details
            const response = await fetch(`api/get_appointment_details.php?id=${appointmentId}`);
            const appointment = await response.json();

            if (!appointment) {
                throw new Error('Failed to fetch appointment details');
            }

            const amount = this.calculateFees(appointment.documentation);
            const documentsList = appointment.documentation.split(',')
                .map(doc => doc.trim())
                .map(doc => `<li>${doc} - ₱${this.documentFees[doc] || 0}</li>`)
                .join('');

            // Create and show the payment confirmation popup
            const popup = document.createElement('div');
            popup.className = 'status-popup payment-confirmation';
            popup.style.display = 'block';

            popup.innerHTML = `
                <div class="status-popup-content">
                    <span class="close-status">&times;</span>
                    <div class="payment-confirmation-header">
                        <h3>Payment Confirmed</h3>
                        <span class="status-badge paid">PAID</span>
                    </div>
                    <div class="payment-details">
                        <p><strong>Student Name:</strong> ${appointment.fullName}</p>
                        <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Program:</strong> ${appointment.program}</p>
                        <p><strong>Year Level:</strong> ${appointment.yearLevel}</p>
                        <div class="payment-documents">
                            <strong>Requested Documents:</strong>
                            <ul>${documentsList}</ul>
                        </div>
                        <p class="payment-total"><strong>Total Amount Paid:</strong> ₱${amount.toFixed(2)}</p>
                    </div>
                </div>
            `;

            // Add to document and handle close button
            document.body.appendChild(popup);
            
            const closeBtn = popup.querySelector('.close-status');
            closeBtn.addEventListener('click', () => {
                popup.remove();
            });

            // Auto-close after 5 seconds
            setTimeout(() => {
                if (document.body.contains(popup)) {
                    popup.remove();
                }
            }, 5000);

        } catch (error) {
            console.error('Error showing payment confirmation:', error);
        }
    }

    async updateStatusLists() {
        try {
            const response = await fetch('api/get_status_appointments.php');
            const data = await response.json();
            
            const paidList = document.getElementById('paid-list');
            const missedList = document.getElementById('missed-list');
            
            paidList.innerHTML = '';
            missedList.innerHTML = '';

            // Update paid appointments list
            data.paid.forEach(appointment => {
                const card = this.createStatusCard(appointment, appointment.date_string, 'paid');
                paidList.appendChild(card);
            });

            // Update missed appointments list
            data.missed.forEach(appointment => {
                const card = this.createStatusCard(appointment, appointment.date_string, 'missed');
                missedList.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching status appointments:', error);
        }
    }

    startAutoRefresh() {
        setInterval(() => this.fetchBillingData(), 30000);
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.fetchBillingData();
        this.startAutoRefresh();
    }

    bindElements() {
        this.prevDateBtn = document.getElementById('prev-billing-date');
        this.nextDateBtn = document.getElementById('next-billing-date');
        this.currentDateSpan = document.getElementById('current-billing-date');
        this.billingCardsContainer = document.getElementById('billing-cards');
        this.totalTransactionsSpan = document.getElementById('total-transactions');
        this.totalAmountSpan = document.getElementById('total-amount');
        
        // Add search input to the billing header
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'billing-search';
        searchInput.placeholder = 'Search by name...';
        searchInput.className = 'billing-search';
        document.querySelector('.billing-header').appendChild(searchInput);
        this.searchInput = searchInput;
    }

    bindEvents() {
        this.prevDateBtn.addEventListener('click', () => this.changeDate(-1));
        this.nextDateBtn.addEventListener('click', () => this.changeDate(1));
        this.searchInput.addEventListener('input', () => this.filterBillingCards());
        
        // Add event listener for status popup
        const showStatusBtn = document.getElementById('show-status-btn');
        const statusPopup = document.getElementById('status-popup');
        const closeStatusBtn = document.querySelector('.close-status');
        
        showStatusBtn.addEventListener('click', () => {
            statusPopup.style.display = 'block';
            this.updateStatusLists();
        });
        
        closeStatusBtn.addEventListener('click', () => {
            statusPopup.style.display = 'none';
        });
    }

    filterBillingCards() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const cards = this.billingCardsContainer.getElementsByClassName('billing-card');
        
        Array.from(cards).forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = name.includes(searchTerm) ? 'block' : 'none';
        });
    }

    changeDate(days) {
        this.currentDate.setDate(this.currentDate.getDate() + days);
        this.fetchBillingData();
    }

    calculateFees(documentation) {
        if (!documentation) return 0;
        
        try {
            // Split by comma and handle potential whitespace
            const docs = documentation.split(',').map(doc => doc.trim());
            let total = 0;
            
            docs.forEach(doc => {
                // Get the exact fee from the documentFees object
                const fee = this.documentFees[doc];
                if (fee !== undefined) {
                    total += fee;
                    console.log(`Added fee for ${doc}: ${fee}`);
                } else {
                    console.warn(`No fee found for document: "${doc}"`);
                }
            });
            
            console.log('Final total:', total);
            return total;
        } catch (error) {
            console.error('Error calculating fees:', error);
            return 0;
        }
    }

    initStatusPopup() {
        const statusBtn = document.getElementById('show-status-btn');
        const statusPopup = document.getElementById('status-popup');
        const closeStatus = document.querySelector('.close-status');
        const tabBtns = document.querySelectorAll('.tab-btn');

        statusBtn.addEventListener('click', () => {
            statusPopup.style.display = 'block';
            this.updateStatusLists();
        });

        closeStatus.addEventListener('click', () => {
            statusPopup.style.display = 'none';
        });

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${e.target.dataset.tab}-content`).classList.add('active');
            });
        });

        // Add search inputs for both tabs
        const paidContent = document.getElementById('paid-content');
        const missedContent = document.getElementById('missed-content');

        // Add search input for paid appointments
        const paidSearch = document.createElement('input');
        paidSearch.type = 'text';
        paidSearch.className = 'status-search';
        paidSearch.placeholder = 'Search paid appointments...';
        paidSearch.addEventListener('input', (e) => this.filterStatusCards(e.target.value, 'paid'));
        paidContent.insertBefore(paidSearch, paidContent.firstChild);

        // Add search input for missed appointments
        const missedSearch = document.createElement('input');
        missedSearch.type = 'text';
        missedSearch.className = 'status-search';
        missedSearch.placeholder = 'Search missed appointments...';
        missedSearch.addEventListener('input', (e) => this.filterStatusCards(e.target.value, 'missed'));
        missedContent.insertBefore(missedSearch, missedContent.firstChild);
    }

    createStatusCard(appointment, date, status) {
        const card = document.createElement('div');
        card.className = `status-card ${status}`;
        
        const amount = this.calculateFees(appointment.documentation);
        const documentsList = appointment.documentation.split(',')
            .map(doc => doc.trim())
            .map(doc => `<li>${doc} - ₱${this.documentFees[doc] || 0}</li>`)
            .join('');

        card.innerHTML = `
            <div class="status-card-header">
                <h3>${appointment.fullName}</h3>
                <span class="status-badge ${status}">${status.toUpperCase()}</span>
            </div>
            <div class="status-card-details">
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
                <p><strong>Program:</strong> ${appointment.program}</p>
                <p><strong>Year Level:</strong> ${appointment.yearLevel}</p>
                <p><strong>Contact:</strong> ${appointment.contactNumber}</p>
                <div class="status-documents">
                    <strong>Requested Documents:</strong>
                    <ul>${documentsList}</ul>
                </div>
                <p><strong>Total Amount:</strong> ₱${amount.toFixed(2)}</p>
                ${status === 'paid' ? 
                    `<p><strong>Paid Date:</strong> ${appointment.paidDate}</p>` : 
                    `<p><strong>Expected Claim Date:</strong> ${appointment.expectedClaimDate || 'Not set'}</p>`}
            </div>
        `;

        return card;
    }

    async checkMissedAppointments() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Fetch all pending appointments
            const response = await fetch('api/get_pending_appointments.php');
            const appointments = await response.json();

            // Check each appointment
            for (const appointment of appointments) {
                // Parse the date_string to match the format
                const appointmentDate = new Date(appointment.date_string);
                appointmentDate.setHours(0, 0, 0, 0);
                
                if (appointmentDate < today) {
                    await this.updateAppointmentStatus(appointment.id, 'missed');
                }
            }

            this.fetchBillingData();
            this.updateStatusLists();
        } catch (error) {
            console.error('Error checking missed appointments:', error);
        }
    }

    filterStatusCards(searchTerm, type) {
        const listId = type === 'paid' ? 'paid-list' : 'missed-list';
        const cards = document.getElementById(listId).getElementsByClassName('status-card');
        
        Array.from(cards).forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const visible = name.includes(searchTerm.toLowerCase());
            card.style.display = visible ? 'block' : 'none';
        });
    }

    // Add confirmation dialog
    showConfirmationDialog(title, message) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'confirmation-dialog';
            dialog.innerHTML = `
                <div class="confirmation-content">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="confirmation-buttons">
                        <button class="confirm-btn">Confirm</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            dialog.querySelector('.confirm-btn').onclick = () => {
                dialog.remove();
                resolve(true);
            };
            
            dialog.querySelector('.cancel-btn').onclick = () => {
                dialog.remove();
                resolve(false);
            };
        });
    }

    // Add error notification
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize the billing system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const billingSystem = new BillingSystem();
    // Check for missed appointments every hour
    setInterval(() => billingSystem.checkMissedAppointments(), 3600000);
    // Initial check
    billingSystem.checkMissedAppointments();
});