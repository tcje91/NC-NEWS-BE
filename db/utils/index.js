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
    const articleCopy = { ...article };
    articleCopy.created_at = formatTimestamp(article.created_at);
    articleCopy.username = article.created_by;
    delete articleCopy.created_by;
    return articleCopy;
  });
};

exports.formatComments = function (comments, articleLookup) {
  return comments.map((comment) => {
    const commentCopy = { ...comment };
    commentCopy.created_at = formatTimestamp(comment.created_at);
    commentCopy.username = comment.created_by;
    commentCopy.article_id = articleLookup[comment.belongs_to];
    delete commentCopy.created_by;
    delete commentCopy.belongs_to;
    return commentCopy;
  });
};
