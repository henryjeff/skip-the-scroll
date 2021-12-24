let comments: CommentData[] = [];

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === "loadComments") {
    const _comments = parseComments();
    comments = _comments;
    sendResponse(comments);
    return true;
  }
  if (msg.type === "scrollTo") {
    const commentData = comments[Number(msg.index)];
    if (commentData) {
      commentData.comment.scrollIntoView();
      window.scrollBy(0, -128);
      comments.forEach((comment) => {
        // @ts-ignore
        comment.comment.style = "box-shadow: 0px 0px 0px 0px";
      });
      // @ts-ignore
      commentData.comment.style = "box-shadow: 0px 0px 0px 1.5px #2BA44E;";
      sendResponse(commentData);
      return true;
    }
  }
  return true;
});

type CommentData = {
  comment: Element;
  upvotes: number;
  timestamp: number;
};

const parseComments = () => {
  const comments: CommentData[] = [];

  // Get all posts on the page
  const commentElements = document.getElementsByClassName(
    "timeline-comment comment"
  );

  // All upvote emojis
  const upvoteEmojis = ["👍", "😄", "🎉", "🚀", "❤️"];

  Array.from(commentElements).forEach((comment) => {
    const reactions = comment.getElementsByClassName(
      "social-reaction-summary-item"
    );
    let totalUpvotes = 0;
    Array.from(reactions).forEach((reaction) => {
      // @ts-ignore
      let splitText: string[] = reaction.innerText.split("\n");

      let emoji = splitText[0];
      let numReactions = Number(splitText[1]);

      // Increase totalUpvotes if there are upvote emojis in the reaction
      if (upvoteEmojis.includes(emoji)) {
        totalUpvotes += numReactions;
      }
    });
    const timestamp = Date.parse(
      comment
        .getElementsByClassName("js-timestamp")[0]
        .children[0].getAttribute("datetime")!
    );
    comments.push({ comment, upvotes: totalUpvotes, timestamp: timestamp });
  });

  sortComments(comments);

  return comments;
};

const sortComments = (comments: CommentData[]) => {
  comments
    .sort(function (x: CommentData, y: CommentData) {
      var n = x.upvotes - y.upvotes;
      if (n !== 0) {
        return n;
      }

      return x.timestamp - y.timestamp;
    })
    .reverse();
};
