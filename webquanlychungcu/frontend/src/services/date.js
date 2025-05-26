function formatTimestamp(isoString) {
  const date = new Date(isoString);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

function formatTime(time){
  var arr = time.split(":")

  return arr[0]+":"+arr[1];
}

export {formatTimestamp,formatTime}