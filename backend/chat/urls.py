from django.urls import path
from django_channels_jwt.views import AsgiValidateTokenView
from .views import *



urlpatterns = [
    path('user/<str:username>/', GetOrCreateChatroom),
    path('room/<str:room_id>/', ChatView),
    path('friends/', ListFriends)
]