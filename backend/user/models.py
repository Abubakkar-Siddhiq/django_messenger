from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
import shortuuid

class User(AbstractUser):
    id = models.CharField(primary_key=True, default=shortuuid.uuid, editable=False, max_length=22)
    name = models.CharField(max_length=30, default="Jack Sparrow")
    username = models.CharField(max_length=20, unique=True)
    bio = models.CharField(max_length=150, default="Hey there! I'm using Django Messenger")
    email = models.EmailField(_("email"), unique=True)
    avatar = models.TextField(null=True, default="https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg")
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
    
    @property
    def friends_list(self):
        return self.friends.all()

    def __str__(self):
        return self.email