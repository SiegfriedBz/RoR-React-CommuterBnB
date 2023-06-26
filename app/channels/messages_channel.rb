class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stream_from messages_channel_name
  end

  def unsubscribed
    # Any cleanup needed when the channel is unsubscribed
  end

  private

  def messages_channel_name
    channel_key = params[:channelKey]
    "MessagesChannel-#{channel_key}"
  end


  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end