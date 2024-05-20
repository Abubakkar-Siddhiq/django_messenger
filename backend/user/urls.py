from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *
from django_channels_jwt.views import AsgiValidateTokenView

auth_urlpatterns = [
    # Auth Based Urls
    path('login/', MyTokenObtainPairView.as_view()),
    path('login/refresh/', TokenRefreshView.as_view()),
    path('register/', RegisterView.as_view()),
    path('change_password/<int:pk>/', ChangePasswordView.as_view()),
    path('logout/', LogoutView.as_view()),

    # UUID
    path("auth_for_ws_connection/", AsgiValidateTokenView.as_view())
]

user_urlpatterns = [
    # User Urls
    path('user/<str:username>/', UserProfile.as_view()),
    path('users/', SearchUser.as_view()),
    path('edit/user/<str:pk>', UpdateProfileView.as_view())
]