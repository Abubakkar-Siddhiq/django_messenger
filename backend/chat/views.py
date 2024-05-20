from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, PermissionDenied

from .models import *
from .serializers import *
from user.serializers import UserProfileSerializer

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ChatView(request, room_id):
    chatroom = ChatRoom.objects.filter(id=room_id).first()
    messages = Message.objects.filter(room=room_id)
    serializer = MessageSerializer(messages, many=True)
    other_user = None

    if not chatroom:
        raise NotFound('Chat room not found')

    if request.user.is_authenticated:
        if request.user in chatroom.members.all():
            for member in chatroom.members.all():
                if member != request.user:
                    other_user = member
                    break
            return Response(serializer.data)  # Return the response here
        else:
            raise PermissionDenied('You dont have permission to this')  
    else:
        raise PermissionDenied('You dont have permission to this')  
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetOrCreateChatroom(request, username):
    if request.user.username == username:
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE, data={"message": "Cannot chat with yourself."})

    other_user = User.objects.filter(username=username).first()
    if not other_user:
        return Response(status=status.HTTP_404_NOT_FOUND, data={"message": "User not found."})

    # Check if a chatroom with the other user already exists
    my_chatrooms = request.user.chat_rooms.all()
    for chatroom in my_chatrooms:
        if other_user in chatroom.members.all():
            members_data = UserProfileSerializer(chatroom.members.all(), many=True).data
            return Response({'chatroom': chatroom.id, 'members': members_data})
    
    # Create a new chatroom if none exists
    chatroom = ChatRoom.objects.create()
    user = User.objects.get(username=username)
    chatroom.members.add(other_user, request.user)
    user.friends.add(other_user, request.user)
    members_data = UserProfileSerializer(chatroom.members.all(), many=True).data
    return Response({'chatroom': chatroom.id, 'members': members_data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ListFriends(request):
    user = request.user
    serializer = FriendsSerializer(user)
    return Response(serializer.data)