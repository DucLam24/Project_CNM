export const filterListParticipants = (conversation, userId) => {
  return conversation?.participants?.filter(
    (participant) => participant?.id !== userId
  );
};

export const formatConversationName = (conversation, userId) => {
  if (conversation.isGroup && conversation?.groupName)
    return conversation?.groupName;

  const listParticipants = filterListParticipants(conversation, userId);

  const conversationName = listParticipants
    ?.map((participant) => participant?.displayName)
    ?.join(", ");

  return conversationName;
};

export const getConversationAvatar = (conversation, userId) => {
  const participants = filterListParticipants(conversation, userId);

  if (conversation.isGroup) {
    if (conversation?.groupImage) return conversation.groupImage;

    return participants?.map((item) => item?.photoUrl || "");
  }

  return participants?.[0]?.photoUrl;
};

export const convertTime = (isoString) => {
  const date = new Date(isoString);
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();

    const customFormat = `${hours}:${minutes} - ${day}/${month}/${year}`;

    return customFormat;
}