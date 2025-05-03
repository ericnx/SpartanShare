"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/dev/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.shortcuts import redirect
from .views import LoginView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from backend.views import ProfileView, ProjectViewSet, ProjectApplicationViewSet, SignupView

# routes the user to different view sets depending on the URL/endpoint
router = DefaultRouter()
# router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'applications', ProjectApplicationViewSet)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path("signup/", SignupView.as_view(), name="signup"),
    path("profile/update/", ProfileView.as_view(), name="profile-update"),
    path("profile/details/", ProfileView.as_view(), name="profile-details"),
]
