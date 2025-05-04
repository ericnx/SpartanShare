from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProjectViewSet, ApplicationViewSet, MyProjectsView, AppliedProjectsView, list_saved_projects, apply_to_project

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'applications', ApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('my-projects/', MyProjectsView.as_view(), name='my-projects'),
    # path('save-project/<int:project_id>/', toggle_save_project),
    path('saved-projects/', list_saved_projects),
    path('applied-projects', AppliedProjectsView.as_view(), name='applied-projects' ),
    path('projects/<int:project_id>/apply/', apply_to_project, name='apply-to-project'),
]
