// HIDE AND RE-APEAR SIDEBAR

document.querySelector('.hamburger-menu').addEventListener('click', function() {
    const sidebar = document.querySelector('.SIDEBAR');
    const body = document.querySelector('body');
    sidebar.classList.toggle('hidden');

    if ( window.innerWidth <= 1024 ){
        body.style.paddingLeft = '25px';
    }
    else if (window.innerWidth > 500) {
        if (sidebar.classList.contains('hidden')) {
            body.style.paddingLeft = '25px';
        } else {
            body.style.paddingLeft = '95px';
        }
    }
});

window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.SIDEBAR');
    const body = document.querySelector('body');
    if (window.innerWidth <= 492) {
        sidebar.classList.add('hidden');
        body.style.paddingLeft = '20px';
    } else if (!sidebar.classList.contains('hidden')) {
        body.style.paddingLeft = '95px';
    } else if (window.innerWidth >= 492) {
        sidebar.classList.remove('hidden');
        body.style.paddingLeft = '95px';
    }
});




// FOR SIDE BAR NAVIGATION

document.addEventListener('DOMContentLoaded', () => {
  const sidebarItems = document.querySelectorAll('.sideBarItem');
  const contentItems = document.querySelectorAll('.content-item');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {

      sidebarItems.forEach(i => i.classList.remove('active'));

    
      item.classList.add('active');
      
      contentItems.forEach(content => content.classList.remove('active'));

      const contentId = item.getAttribute('data-content');
      document.getElementById(contentId).classList.add('active');
    });
  });
  
  // Optionally: Trigger click on the first item to display the initial content
  sidebarItems[0].click();
});