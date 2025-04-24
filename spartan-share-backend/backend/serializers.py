from rest_framework import serializers
from .models import User, Project, ProjectApplication

'''
- converts the model instances to JSON (send data to frontend)
- validates and saves the incoming JSON (receive data from frontend)
'''

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectApplication
        fields = '__all__'
