from django.urls import path
from .views import *



urlpatterns = [
    path('user/<str:username>/', GetOrCreateChatroom),
    path('room/<str:room_id>/', ChatView),
    path('friends/', ListFriends),
    path('friend/remove/<str:username>', RemoveFriend),
    path('friends/all', ListFriendsProfile.as_view()),
    path('mark_message_as_read/', MarkAsRead),
]