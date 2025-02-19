from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "confirm_password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data): 
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)
    
    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError('This field must not be blank')
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Email already exists.")
        return value.lower()
    
    def validate(self, data):
        if not data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'This field must not be blank'})
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': "Password's don't match!"})
        return data

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "author", "content"]
        extra_kwargs = {"author": {"read_only": True}}
        
    

    
        