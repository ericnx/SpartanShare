from rest_framework import serializers
from .models import User, Project, ProjectApplication
# from django.contrib.auth.models import User

'''
- converts the model instances to JSON (send data to frontend)
- validates and saves the incoming JSON (receive data from frontend)
'''

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'display_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectApplication
        fields = '__all__'
