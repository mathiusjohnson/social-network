
export default function timeSince(date, dbQuery) {

  date = new Date(date);

  let seconds = Math.floor((new Date() - date) / 1000);

  // for converting GMT to MDT
  if (dbQuery) {
    seconds -= 54000;
  }
  // else {
  //   seconds += 21600;
  // }


  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ` year${Math.floor(interval) > 1 ? 's' : ''} ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ` month${Math.floor(interval) > 1 ? 's' : ''} ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ` day${Math.floor(interval) > 1 ? 's' : ''} ago`;
  }
  interval = seconds / 3600;
  if (interval > 1 && dbQuery) {
    return "Today";
  }
  if (interval > 1) {
    return Math.floor(interval) + ` hour${Math.floor(interval) > 1 ? 's' : ''} ago`;
  }
  interval = seconds / 60;
  if (interval > 1 && dbQuery) {
    return "Today";
  }
  if (interval > 1) {
    return Math.floor(interval) + ` minute${Math.floor(interval) > 1 ? 's' : ''} ago`;
  }
  if (dbQuery) {
    return "Today"
  }
  return Math.floor(seconds) + " seconds ago";

};