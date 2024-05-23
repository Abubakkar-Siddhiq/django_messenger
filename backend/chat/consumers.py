import json
from datetime import datetime, timezone
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from .models import ChatRoom, Message  
from user.models import User

class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        self.username = self.user.username
        print(self.username)
        self.user_channel_group = f'user_{self.username}'

        # Join user-specific group
        async_to_sync(self.channel_layer.group_add)(
            self.user_channel_group,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave user-specific group
        async_to_sync(self.channel_layer.group_discard)(
            self.user_channel_group,
            self.channel_name
        )

    def receive(self, text_data):
        pass

    def notify_message(self, event):
        self.send(text_data=json.dumps({
            'type': 'notify_message',
            'message': event['message'],
        }))



# Chat Consumer 

connected_users = {}

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
                self.close()
                return
        except ChatRoom.DoesNotExist:
            # Chat room doesn't exist
            self.close()
            return
        
        connected_users[self.user.username] = self.chatroom_id
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Remove user from Connected users
        if self.user.username in connected_users:
            del connected_users[self.user.username]
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )


    def receive(self, text_data):
        # Handle incoming messages
        json_data = json.loads(text_data)
        action = json_data['action']

        if action == 'type':
            value = json_data['typing']
            # Broadcast the typing status to the room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'typing_status',
                    'data': {
                        'action': action,
                        'typing': value,
                        'user': self.user.username
                    }
                }
            )

        if action == 'message':
            content = json_data['content']
            receiver_name = json_data['receiver']
            receiver = User.objects.get(username=receiver_name)
            my_date = datetime.now(timezone.utc)

            is_read = connected_users.get(receiver_name) == self.chatroom_id

            message = Message.objects.create(
                content=content,
                sender=self.user,
                receiver=receiver,
                room=self.chatroom,
                created_at=my_date,
                is_read=is_read,
            )

            event = {
                'action': action,
                'message_id': message.id,
                'content': message.content,
                'sender': self.user.username,
                'reviever': receiver.username,
                'sender_avatar': self.user.avatar,
                'created_at': message.created_at.isoformat(),
                'is_read': is_read,
            }
            # Broadcast the message to the room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'data': event
                }
            )

            # Send Notifications
            async_to_sync(self.channel_layer.group_send)(
                f'user_{receiver.username}',
                {
                    'type': 'notify_message',
                    'message': event,
                    'sender': receiver,
                }
            )


    def typing_status(self, event):
        self.send(text_data=json.dumps(event['data']))

    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'data': event['data']
        }))
