from django.db import models
from user.models import User
import shortuuid

# Create your models here.

class ChatRoom(models.Model):
    id =  models.CharField(primary_key=True ,max_length=128, unique=True, default=shortuuid.uuid)
    members = models.ManyToManyField(User, related_name="chat_rooms", blank=True)
    
class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, to_field='username', on_delete=models.CASCADE, related_name='sent_message')
    receiver = models.ForeignKey(User, to_field='username', on_delete=models.CASCADE, related_name='received_message', default=None)
    content = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)