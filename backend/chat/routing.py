from django.urls import path
from .  import consumers

# Here, "" is routing to the URL ChatConsumer which 
# will handle the chat functionality.

# application = get_asgi_application()

websocket_urlpatterns = [
    path("ws/chatroom/<str:room_id>" , consumers.ChatConsumer.as_asgi()) ,
    path('ws/notifications/', consumers.NotificationConsumer.as_asgi()), 
] 