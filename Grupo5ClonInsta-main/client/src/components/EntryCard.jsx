import React from "react";

const EntryCard = ({ avatar, username, entryImage, description, comments }) => {
  return (
    <div className="border rounded-md shadow-md p-4">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10">
          <img
            src={avatar}
            alt={`${username}'s Avatar`}
            className="w-full h-full rounded-full"
          />
        </div>
        <div className="ml-2">
          <p className="text-gray-700 font-semibold">@{username}</p>
        </div>
      </div>
      <img src={entryImage} alt="Entry" className="w-full rounded-md" />

      <div className="mt-4">
        <div className="flex justify-between">
          <div>
            <button className="text-blue-500 hover:underline">Like</button>
          </div>
          <div>
            <button className="text-blue-500 hover:underline">Comment</button>
          </div>
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>

      {comments && comments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Comments:</h3>
          <ul className="list-disc ml-4">
            {comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EntryCard;
