from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Project, Application

class UserSerializer(serializers.ModelSerializer):
    saved_projects = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Project.objects.all(), required=False
    )
    class Meta:
        model = User
        fields = ['id','email','display_name','biography','major','level','password', 'saved_projects']
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
    favorited = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('creator',)

    def get_favorited(self, obj):
        request = self.context.get("request")
        return request and request.user.is_authenticated and obj.saved_by.filter(id=request.user.id).exists()


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'