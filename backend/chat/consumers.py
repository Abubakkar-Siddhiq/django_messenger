import json
from datetime import datetime, timezone
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import ChatRoom, Message  
# from user.models import User

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        self.chatroom_id = self.scope['url_route']['kwargs']['room_id']
        self.chatroom = ChatRoom.objects.get(id=self.chatroom_id)
        self.room_group_name = f'chat_{self.chatroom_id}'

        # Check if the chat room exists and if the user has permission to access it
        try:
            chatroom = ChatRoom.objects.get(id=self.chatroom_id)
            if self.scope['user'] not in chatroom.members.all():
                # User doesn't have permission to access this chat room
                print('NO brooo')
                self.close()
                return
        except ChatRoom.DoesNotExist:
            # Chat room doesn't exist
            self.close()
            return

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )


    def receive(self, text_data):
        # Handle incoming messages
        content = json.loads(text_data)

        my_date = datetime.now(timezone.utc)

        message = Message.objects.create(
            content = content,
            sender = self.user,
            room = self.chatroom,
            created_at = my_date.astimezone().isoformat()
        )

        event = {
                'message_id': message.id,
                'content': message.content,
                'sender': self.user.username,
                'sender_avatar': self.user.avatar,
                'created_at': message.created_at.isoformat(),
            }
        # Broadcast the message to the room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'data': event
            }
        )

    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'data': event['data']
        }))
