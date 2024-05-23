from rest_framework import serializers
from django.db.models import Q
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import User
from chat.models import Message

# Authentication and Authorization Serializers
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('name', 'username', 'email', 'password', 'confirm_password')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            name=validated_data['name'],
            username=validated_data['username'],
            email=validated_data['email'],
        )

        
        user.set_password(validated_data['password'])
        user.save()

        return user
    
class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'confirm_password')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user

        if user.pk != instance.pk:
            raise serializers.ValidationError({"authorize": "You dont have permission for this user."})

        instance.set_password(validated_data['password'])
        instance.save()

        return instance

class UpdateUserSerializer(serializers.ModelSerializer):
    # email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'name', 'avatar', 'bio')

    # def validate_email(self, value):
    #     user = self.context['request'].user
    #     if User.objects.exclude(pk=user.pk).filter(email=value).exists():
    #         raise serializers.ValidationError({"email": "This email is already in use."})
    #     return value

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user

        if user.pk != instance.pk:
            raise serializers.ValidationError({"authorize": "You dont have permission for this user."})
        
        instance.name = validated_data['name']
        # instance.email = validated_data['email']
        instance.username = validated_data['username']
        instance.avatar = validated_data['avatar']
        instance.bio = validated_data['bio']
        instance.save()
        return instance

# Other Serializers
class UserProfileSerializer(serializers.ModelSerializer):    
    is_friend = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'name', 'avatar', 'bio', 'is_friend', 'last_message', 'unread_count']

    def get_is_friend(self, obj):
        request_user = self.context['request'].user
        return request_user.friends.filter(id=obj.id).exists()

    def get_last_message(self, obj):
        request_user = self.context['request'].user
        last_message = Message.objects.filter(
            Q(sender=request_user, receiver=obj) | Q(sender=obj, receiver=request_user)
        ).order_by('-created_at').first()
        
        if last_message:
            return {
                'content': last_message.content,
                'sender': last_message.sender.username,
                'receiver': last_message.receiver.username,
                'created_at': last_message.created_at.isoformat(),
            }
        return None

    def get_unread_count(self, obj):
        request_user = self.context['request'].user
        return Message.objects.filter(sender=obj, receiver=request_user, is_read=False).count()