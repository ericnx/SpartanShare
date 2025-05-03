from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, get_user_model
from .models import User, Project, Application
from .serializers import UserSerializer, ProjectSerializer, ApplicationSerializer, CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_save(self, request, pk=None):
        project = self.get_object()
        user = request.user

        if project in user.saved_projects.all():
            user.saved_projects.remove(project)
        else:
            user.saved_projects.add(project)

        serializer = ProjectSerializer(project, context={'request': request})
        return Response(serializer.data)

class MyProjectsView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(creator=self.request.user)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            return Response({
                'access_token': str(access_token),
                'refresh_token': str(refresh),
            })
        else:
            return Response({"detail": "Invalid credentials"}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_saved_projects(request):
    projects = request.user.saved_projects.all()
    serializer = ProjectSerializer(projects, many=True, context={'request': request})
    return Response(serializer.data)

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def toggle_save_project(request, project_id):
#     user = request.user
#     try:
#         project = Project.objects.get(id=project_id)
#         if project in user.saved_projects.all():
#             user.saved_projects.remove(project)
#             return Response({'status': 'unsaved'})
#         else:
#             user.saved_projects.add(project)
#             return Response({'status': 'saved'})
#     except Project.DoesNotExist:
#         return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)