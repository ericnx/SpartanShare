from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Project, Application

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','display_name','biography','major','level','password']
        extra_kwargs = {
            'password': {'write_only': True},
            'major': {'required': False, 'allow_blank': True},
            'level': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        # use create_user so password gets hashed
        return User.objects.create_user(**validated_data)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

class ProjectSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('creator',)

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'