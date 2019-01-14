function formatTimestamp(timeNum) {
  const date = new Date(timeNum);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (String(month).length === 1) month = `0${month}`;
  let day = date.getDate();
  if (String(day).length === 1) day = `0${day}`;
  let hours = date.getHours();
  if (String(hours).length === 1) hours = `0${hours}`;
  let minutes = date.getMinutes();
  if (String(minutes).length === 1) minutes = `0${minutes}`;
  let seconds = date.getSeconds();
  if (String(seconds).length === 1) seconds = `0${seconds}`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

exports.formatArticles = function (articles) {
  return articles.map((article) => {
    article.created_at = formatTimestamp(article.created_at);
    article.username = article.created_by;
    delete article.created_by;
    return article;
  });
};
