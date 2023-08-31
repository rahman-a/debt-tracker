export const getUnreadMessages = async (chatClient, id) => {
  const channels = await chatClient.queryChannels(
    {
      type: 'messaging',
      members: { $in: [id] },
    },
    { last_message_at: -1 },
    {
      watch: true,
      state: true,
      presence: true,
    }
  )
  const nonReadMessages = channels.reduce((acc, channel) => {
    const unreadCount = channel.countUnread()
    return acc + unreadCount
  }, 0)
  return nonReadMessages
}
