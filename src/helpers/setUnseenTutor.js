

export default function setUnseenTutor(notifNum) {

  const allMenuTitles = typeof document !== 'undefined' && document.querySelectorAll('.menu-title');
  if (allMenuTitles) {

    for (let title of allMenuTitles) {
      if (title.textContent === 'Tutor Sessions') {

        title.parentElement.style.position = 'relative';

        if (document.querySelector('.tutor-notification-num')) {
          document.querySelector('.tutor-notification-num').remove();
        }

        const notificationHTML = `
        <div class='tutor-notification-num'>${notifNum}</div>
        `;

        if (Number(notifNum)) {
          title.insertAdjacentHTML('afterend', notificationHTML);
        }
      }
    }
  }

}