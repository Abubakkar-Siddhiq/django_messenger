from django.db.models import Q, F, Max
from django.db.models.functions import Coalesce
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, PermissionDenied
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from user.serializers import UserProfileSerializer

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ChatView(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    
    if request.user not in chatroom.members.all():
        raise PermissionDenied('You don\'t have permission to access this chat room')
    
    Message.objects.filter(receiver=request.user, room=chatroom, is_read=False).update(is_read=True)
    messages = Message.objects.filter(room=chatroom)
    serializer = MessageSerializer(messages, many=True)
    
    return Response(serializer.data)

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
            members_data = UserProfileSerializer(chatroom.members.all(), many=True, context={'request': request}).data
            return Response({'chatroom': chatroom.id, 'members': members_data})
    
    # Create a new chatroom if none exists
    chatroom = ChatRoom.objects.create()
    user = User.objects.get(username=username)
    chatroom.members.add(other_user, request.user)
    user.friends.add(other_user, request.user)
    members_data = UserProfileSerializer(chatroom.members.all(), many=True, context={'request': request}).data
    return Response({'chatroom': chatroom.id, 'members': members_data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ListFriends(request):
    user = request.user
    serializer = FriendsSerializer(user)
    return Response(serializer.data)

class ListFriendsProfile(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        current_user = self.request.user
        return current_user.friends.annotate(
            last_message_date = Coalesce(
                Max('sent_message__created_at', filter=Q(sent_message__receiver=current_user)),
                Max('received_message__created_at', filter=Q(received_message__sender=current_user))
            )).order_by('-last_message_date')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def MarkAsRead(request):
    msg_id = request.data.get('msg_id')
    try:
        message = Message.objects.get(id=msg_id)
        message.is_read = True
        message.save()
        return Response({'status': 'success', 'message': 'Message marked as read'}, status=status.HTTP_200_OK)
    except Message.DoesNotExist:
        return Response({'status': 'error', 'message': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)