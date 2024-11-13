class BillingSystem {
    constructor() {
        this.appointments = JSON.parse(localStorage.getItem('appointmentsByDate')) || {};
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
        console.log('Initial appointments:', this.appointments);
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.updateBillingDisplay();
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
    }

    filterBillingCards() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const cards = this.billingCardsContainer.getElementsByClassName('billing-card');
        
        Array.from(cards).forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = name.includes(searchTerm) ? 'block' : 'none';
        });
    }

    changeDate(offset) {
        this.currentDate.setDate(this.currentDate.getDate() + offset);
        this.updateBillingDisplay();
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

    updateBillingDisplay() {
        const dateString = this.currentDate.toDateString();
        this.currentDateSpan.textContent = dateString;
        this.billingCardsContainer.innerHTML = '';

        const appointments = this.appointments[dateString] || [];
        let totalAmount = 0;

        if (appointments.length === 0) {
            const noTransactions = document.createElement('div');
            noTransactions.className = 'no-transactions';
            noTransactions.textContent = 'No transactions for this date';
            this.billingCardsContainer.appendChild(noTransactions);
        } else {
            appointments.forEach((appointment, index) => {
                // Calculate amount for this appointment
                const amount = this.calculateFees(appointment.documentation);
                console.log(`Amount for ${appointment.fullName}: ${amount}`); // Debug log
                totalAmount += amount;

                const card = this.createBillingCard(appointment, amount, index, dateString);
                this.billingCardsContainer.appendChild(card);
            });
        }

        // Update totals display
        console.log(`Final total amount: ${totalAmount}`); // Debug log
        this.totalTransactionsSpan.textContent = appointments.length;
        this.totalAmountSpan.textContent = totalAmount.toFixed(2);
    }

    createBillingCard(appointment, amount, index, dateString) {
        const card = document.createElement('div');
        card.className = 'billing-card';
        if (this.currentDate.toDateString() === new Date().toDateString()) {
            card.classList.add('current-day');
        }

        // Log the appointment data for debugging
        console.log('Creating card for appointment:', appointment);
        console.log('Calculated amount:', amount);

        // Split documents and create vertical list with exact matching of document names
        const documentsList = appointment.documentation.split(',')
            .map(doc => doc.trim())
            .map(doc => {
                const fee = this.documentFees[doc];
                console.log(`Document: "${doc}", Fee: ${fee}`);
                return `<li class="document-item">
                    <span class="document-name">${doc}</span>
                    <span class="document-fee">₱${fee ? fee.toFixed(2) : '0.00'}</span>
                </li>`;
            })
            .join('');

        card.innerHTML = `
            <div class="billing-card-header">
                <h3>${appointment.fullName}</h3>
                <span class="program-year">${appointment.program} - ${appointment.yearLevel}</span>
            </div>
            <div class="billing-details">
                <p><strong>Contact:</strong> ${appointment.contactNumber}</p>
                <div class="documents-list">
                    <strong>Requested Documents:</strong>
                    <ul class="documents-ul">${documentsList}</ul>
                </div>
                <div class="billing-amount">Total Amount Due: ₱${amount.toFixed(2)}</div>
            </div>
            <div class="billing-actions">
                <button class="complete-btn">Mark as Paid</button>
                <button class="cancel-btn">Cancel</button>
            </div>
            <div class="transaction-time">
                Created: ${new Date().toLocaleTimeString()}
            </div>
        `;

        // Add event listeners for the buttons
        card.querySelector('.complete-btn').addEventListener('click', () => 
            this.completeTransaction(dateString, index));
        
        card.querySelector('.cancel-btn').addEventListener('click', () => 
            this.cancelTransaction(dateString, index));

        return card;
    }

    completeTransaction(dateString, index) {
        if (confirm('Mark this transaction as complete and paid?')) {
            const appointments = this.appointments[dateString] || [];
            
            // Store completed transaction in a separate history
            const completedTransaction = appointments[index];
            const completedTransactions = JSON.parse(localStorage.getItem('completedTransactions') || '[]');
            completedTransactions.push({
                ...completedTransaction,
                completedDate: new Date().toISOString(),
                amount: this.calculateFees(completedTransaction.documentation)
            });
            localStorage.setItem('completedTransactions', JSON.stringify(completedTransactions));
            
            // Remove from active appointments
            appointments.splice(index, 1);
            
            if (appointments.length === 0) {
                delete this.appointments[dateString];
            } else {
                this.appointments[dateString] = appointments;
            }

            localStorage.setItem('appointmentsByDate', JSON.stringify(this.appointments));
            this.updateBillingDisplay();
            
            if (typeof updateAdminCalendar === 'function') {
                updateAdminCalendar();
            }
        }
    }

    cancelTransaction(dateString, index) {
        if (confirm('Are you sure you want to cancel this transaction? This cannot be undone.')) {
            const appointments = this.appointments[dateString] || [];
            
            // Store cancelled transaction in history
            const cancelledTransaction = appointments[index];
            const cancelledTransactions = JSON.parse(localStorage.getItem('cancelledTransactions') || '[]');
            cancelledTransactions.push({
                ...cancelledTransaction,
                cancelledDate: new Date().toISOString(),
                reason: 'User cancelled'
            });
            localStorage.setItem('cancelledTransactions', JSON.stringify(cancelledTransactions));
            
            appointments.splice(index, 1);
            
            if (appointments.length === 0) {
                delete this.appointments[dateString];
            } else {
                this.appointments[dateString] = appointments;
            }

            localStorage.setItem('appointmentsByDate', JSON.stringify(this.appointments));
            this.updateBillingDisplay();
            
            if (typeof updateAdminCalendar === 'function') {
                updateAdminCalendar();
            }
        }
    }
}

// Initialize the billing system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const billingSystem = new BillingSystem();
});