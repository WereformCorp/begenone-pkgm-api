// const calculateTimeAgo = timestamp => {
//   const timeDiff = Date.now() - new Date(timestamp).getTime();
//   const minutes = Math.floor(timeDiff / 60000);
//   if (minutes < 60) return `${minutes} minute(s) ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours} hour(s) ago`;
//   const days = Math.floor(hours / 24);
//   return `${days} day(s) ago`;
// };

// export default calculateTimeAgo;

const calculateTimeAgo = timestamp => {
  const diff = Date.now() - new Date(timestamp).getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} minute(s) ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour(s) ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day(s) ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week(s) ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month(s) ago`;

  const years = Math.floor(days / 365);
  return `${years} year(s) ago`;
};

export default calculateTimeAgo;
