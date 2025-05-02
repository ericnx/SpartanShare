from rest_framework import serializers
from .models import User, Project, Application

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = '__all__'
    extra_kwargs = {
            'email': {'read_only': True},
        }

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