from rest_framework import serializers
from .models import *
from user.models import *

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'

# class MessageThreadSerializer(serializers.ModelField):
#     class Meta:
#         model = Message
#         fields = '__all__'

class FriendsSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'friends']

    def get_friends(self, obj):
            return obj.friends.values_list('username', flat=True)