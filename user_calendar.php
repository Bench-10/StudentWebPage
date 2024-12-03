<?php
require_once 'includes/db_connect.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student Appointment</title>
    <link rel="icon" type="image/png" href="Assets\Header Icons\SPC Logo.png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles\User_schedule-sidebar.css">
    <link rel="stylesheet" href="styles\header.css">
    <link rel="stylesheet" href="styles/documents-sidebar.css">
    <link rel="stylesheet" href="styles/user-announcements.css">
    
</head>
<body>
    <header class="HEADER">
            <div class="drop-down" id="drop-down-down">
                <img src="Assets\Header Icons\caret-down.png">
                <div class="drop-down-elements">

                    <div class="announcement" data-content="contents1" onclick="openAnnouncement()">
                        <img src="Assets\sideBarIcons\announcement.png">
                        <p>Announcements</p>
        
                    </div>

                    <div class="calendar-popup" data-content="contents2" onclick="openCalendar()">
                        <img src="Assets\sideBarIcons\calendar.png">
                        <p>Calendar</p>
        
                    </div>

                    <div class="documents" data-content="contents3" onclick="openDocuments()">
                        <img src="Assets\sideBarIcons\document.png">
                        <p>Documents</p>
        
                    </div>
        
                   
            
                </div>
        </div>


        <img class="spc-logo" src="Assets\Header Icons\SPC Logo.png">
        <h1>SAN PABLO COLLEGES</h1>
         
    </header>



    <div class="feedback" id="feeedback">
        <a href="https://docs.google.com/forms/d/e/1FAIpQLScGOz71-x4qRvciwgSZZSL2pcx0W_XESYHq-9x1nwnY2mFwCg/alreadyresponded">
          <img src="Assets\feedback\feedback.png">
        </a>

        <p>Feedback</p>
    </div>



    <div class="popup-starter-container"  id="close-tab">
        <div class="popup-starter">
            <div class="popup-student">
                <img src="Assets\Login\student.png">
                <button onclick="closePopup()">Enter as Student</button>
            </div>
    
            <div class="popup-employee">
                <img src="Assets\Login\businessman.png">
                <a href="login.html" target="_self"><button>Enter as Employee</button></a>
            </div>
        </div>
    </div>


    <div id="contents1" class="content-items">
        <h2>Announcements</h2>
        <div class="content1-container">
            <div class="main-announcement-container" id="user-announcements-container">
                <p class="no-announcements">No announcements</p>
            </div>
        </div>
    </div>




    <div id="contents2" class="content-items">
        <h2>Appointment Calendar</h2>
        <div class="main-container">
            <div class="calendar-container">
                <div class="header">
                    <button class="button" id="prev-month">Previous</button>
                    <div class="month-year" id="month-year"></div>
                    <button class="button" id="next-month">Next</button>
                </div>
                <div class="calendar" id="calendar"></div>
                <div class="summary">
                    Selected Date: <span id="selected-date">None</span>
                </div>
                <button class="proceed-button" id="proceed-button">Proceed</button>
            </div>

            <div class="status-box">
                <div class="status-title">Scheduled Status</div>
                <div id="appointment-info" class="appointment-info">No appointments scheduled.</div>
                <div id="working-hours" class="working-hours">
                    Working Hours: 7:00 AM - 12:00 PM, 1:00 PM - 5:00 PM
                </div>
                <div id="holiday-info" class="holiday-info"></div>
                <button class="button" id="next-button" style="display: none;">Next</button>
            </div>

            <div class="appointments-list-container">
                <h3>Scheduled Appointments</h3>
                <ul id="appointments-list">
                </ul>
            </div>
        </div>

        <div class="popup-container" id="popup-container">
            <div class="popup-header">
                Scheduled Appointments
                <button class="close-popup" id="close-popup">X</button>
            </div>
            <div class="popup-body">
                <form id="appointment-form">
                    <div class="form-group">
                        <label for="full-name">Full Name (Surname, First Name, Middle Initial)</label>
                        <input type="text" id="full-name" name="full-name" placeholder="Enter Full Name" required />
                    </div>

                    <div class="form-group">
                        <label for="program">Program</label>
                        <input type="text" id="program" name="program" placeholder="Enter Full Program Name" required />
                    </div>

                    <div class="form-group">
                        <label for="contact-number">Contact Number</label>
                        <input type="text" id="contact-number" name="contact-number" placeholder="Enter Contact Number" required pattern="\d{11}" />
                        <small>Format: 11 digits</small>
                    </div>

                    <div class="form-group">
                        <label for="year-level">Year Level</label>
                        <select id="year-level" name="year-level" required>
                            <option value="1st year">1st Year</option>
                            <option value="2nd year">2nd Year</option>
                            <option value="3rd year">3rd Year</option>
                            <option value="4th year">4th Year</option>
                            <option value="5th year">5th Year</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Type of Documentation</label>
                        <div class="checkbox-options">
                            <label><input type="checkbox" name="documentation" value="Diploma (₱400.00)" /> Diploma (₱400.00)</label>
                            <label><input type="checkbox" name="documentation" value="Certificate of Transfer Credentials (₱100.00)" /> Certificate of Transfer Credentials (₱100.00)</label>
                            <label><input type="checkbox" name="documentation" value="Form 137 (₱100.00)" /> Form 137 (₱100.00)</label>
                            <label><input type="checkbox" name="documentation" value="Certification (₱30.00)" /> Certification (₱30.00)</label>
                            <label><input type="checkbox" name="documentation" value="Transcript of Records (₱50.00 per page)" /> Transcript of Records (₱50.00 per page)</label>
                            <label><input type="checkbox" name="documentation" value="Authentication (₱20.00 per page)" /> Authentication (₱20.00 per page)</label>
                            <label><input type="checkbox" name="documentation" value="Send Copy of Registration Form (₱15.00)" /> Send Copy of Registration Form (₱15.00)</label>
                            <label><input type="checkbox" name="documentation" value="Graduation Fee (₱1,000.00)" /> Graduation Fee (₱1,000.00)</label>
                            <label><input type="checkbox" name="documentation" value="Others, Please Specify" /> Others, Please Specify</label>
                        </div>
                    </div>

                    <button type="submit" class="submit-btn">Submit</button>
                </form>
            
            </div>
        </div>
    </div>


    <div id="contents3" class="content-items">
        <h2>Documents/Files</h2>
        <div class="documents-container">

            <div class="individual-documment">
                <h2>Application Form for Humanitarian Scholarship</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-HS-01_Application Form for Humanitarian Scholarship_Rev. 01.pdf" download="Application Form for Humanitarian Scholarship">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-HS-01_Application Form for Humanitarian Scholarship_Rev. 01.docx" download="Application Form for Humanitarian Scholarship">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-HS-01_Application Form for Humanitarian Scholarship_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>

            
            <div class="individual-documment">
                <h2>Scholarship Requisition Slip</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-HS-04_Scholarship Requisition Slip_Rev. 01.pdf" download="Scholarship Requisition Slip">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-HS-04_Scholarship Requisition Slip_Rev. 01.docx" download="Scholarship Requisition Slip">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-HS-04_Scholarship Requisition Slip_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>


            <div class="individual-documment">
                <h2>Student Information Updating Form</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-OGC-01_Student Information Updating Form_Rev. 01.pdf" download="Student Information Updating Form">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-OGC-01_Student Information Updating Form_Rev. 01.docx" download="Student Information Updating Form">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-OGC-01_Student Information Updating Form_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>

            
            <div class="individual-documment">
                <h2>Student Information Sheet</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-OGC-02_Student Information Sheet_Rev. 01.pdf" download="Student Information Sheet">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-OGC-02_Student Information Sheet_Rev. 01.docx" download="Student Information Sheet">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-OGC-02_Student Information Sheet_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>


            <div class="individual-documment">
                <h2>Request for New  ID</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-OSD-10_Request for New  ID Rev 01.pdf" download="Request for New  ID">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-OSD-10_Request for New  ID Rev 01.docx" download="Request for New  ID">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-OSD-10_Request for New  ID Rev 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>


            <div class="individual-documment">
                <h2>Adding, Changing, Dropping of Courses Form</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-REG-04_Adding, Changing, Dropping of Courses Form_Rev. 01.pdf" download="Adding, Changing, Dropping of Courses Form">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-REG-04_Adding, Changing, Dropping of Courses Form_Rev. 01.docx" download="Adding, Changing, Dropping of Courses Form">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-REG-04_Adding, Changing, Dropping of Courses Form_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>


            <div class="individual-documment">
                <h2>Consent Form for the Evaluation of Academic Records</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-REG-09_Consent Form for the Evaluation of Academic Records_Rev. 01.pdf" download="Consent Form for the Evaluation of Academic Records">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-REG-09_Consent Form for the Evaluation of Academic Records_Rev. 01.docx" download="Consent Form for the Evaluation of Academic Records">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-REG-09_Consent Form for the Evaluation of Academic Records_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>


            <div class="individual-documment">
                <h2>Request and Claim Slip Form</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-REG-11_Request and Claim Slip Form_Rev. 01.pdf" download="Request and Claim Slip Form">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-REG-11_Request and Claim Slip Form_Rev. 01.docx" download="Request and Claim Slip Form">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-REG-11_Request and Claim Slip Form_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>


            <div class="individual-documment">
                <h2>Evaluation Form for Returnee</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-REG-17_Evaluation Form for Returnee_Rev. 01.pdf" download="Evaluation Form for Returnee">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-REG-17_Evaluation Form for Returnee_Rev. 01.docx" download="Evaluation Form for Returnee">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-REG-17_Evaluation Form for Returnee_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>

            <div class="individual-documment">
                <h2>Leave of Absence Form</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-REG-18_Leave of Absence Form_Rev. 01.pdf" download="Leave of Absence Form">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-REG-18_Leave of Absence Form_Rev. 01.docx" download="Leave of Absence Form">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-REG-18_Leave of Absence Form_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>


            <div class="individual-documment">
                <h2>Cancellation of Enrollment</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-REG-21_Cancellation of Enrollment_Rev. 01.pdf" download="Cancellation of Enrollment">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-REG-21_Cancellation of Enrollment_Rev. 01.docx" download="Cancellation of Enrollment">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-REG-21_Cancellation of Enrollment_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>


            <div class="individual-documment">
                <h2>Application Form for Shifter and Transferee</h2>
                <div class="download-buttons">
                  <a class="pdf-download" href="Assets\PDF files\SPC-FO-REG-12_Application Form for Shifter, Transferee_Rev. 01.pdf" download="Application Form for Shifter and Transferee">
                    PDF
                  </a>

                  <a class="document-download" href="Assets\Document files\SPC-FO-REG-12_Application Form for Shifter, Transferee_Rev. 01.docx" download="Application Form for Shifter and Transferee">
                    DOC
                  </a>
                </div>
                <div class="file-preview-container">
                    <object data="Assets\PDF files\SPC-FO-REG-12_Application Form for Shifter, Transferee_Rev. 01.pdf" width="100%" height="100%" ></object>
                </div>
            </div>

        </div>

    </div>


    

    <script>
         function closePopup() {
            document.getElementById("feeedback").style.visibility = "Visible";
            document.getElementById("feeedback").style.animation = "feedback-popup 0.8s ease forwards";
            document.getElementById("drop-down-down").style.visibility = "Visible";
            let closePopupAnimation = document.getElementById("close-tab");
            closePopupAnimation.style.animation = "popup-transition-close 0.5s ease backwards";
            setTimeout(function() {
                closePopupAnimation.style.visibility = "hidden";
            }, 500);
        }

        function openAnnouncement(){
            document.getElementById("contents1").style.visibility = "visible";
            document.getElementById("contents2").style.visibility = "hidden";
            document.getElementById("contents3").style.visibility = "hidden";

        }

        function openCalendar(){
            document.getElementById("contents1").style.visibility = "hidden";
            document.getElementById("contents2").style.visibility = "visible";
            document.getElementById("contents3").style.visibility = "hidden";

        }

        function openDocuments(){
            document.getElementById("contents1").style.visibility = "hidden";
            document.getElementById("contents2").style.visibility = "hidden";
            document.getElementById("contents3").style.visibility = "visible";

        }
        
        function fetchAppointments() {
            fetch('api/get_appointments.php')
                .then(response => response.json())
                .then(data => {
                    updateCalendarDisplay(data);
                })
                .catch(error => console.error('Error:', error));
        }

        function updateCalendar() {
            // ... existing calendar rendering code ...
            fetchAppointments();
        }

        setInterval(fetchAppointments, 30000); // Update every 30 seconds
    </script>

    <script src="scripts/user_announcements.js"></script>
    <script src="scripts\User_calendar.js"></script>
</body>
</html> 