from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
import uuid

# models that mirror the SQL tables inside the database

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, display_name='', **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not display_name:
            raise ValueError('Display name is required')
        email = self.normalize_email(email)
        user = self.model(email=email, display_name=display_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, display_name='', **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, display_name, **extra_fields)

class Major(models.Model):
    name = models.CharField(max_length=100, unique=True)

class Minor(models.Model):
    name = models.CharField(max_length=100, unique=True)

class GraduateLevel(models.Model):
    LEVELS = [('Undergraduate', 'Undergraduate'), ('Graduate', 'Graduate')]
    name = models.CharField(max_length=20, choices=LEVELS, unique=True)

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    # password = models.CharField(max_length=255)
    display_name = models.CharField(max_length=100)
    biography = models.TextField(blank=True)
    major = models.ForeignKey(Major, on_delete=models.SET_NULL, null=True)
    minor = models.ForeignKey(Minor, on_delete=models.SET_NULL, null=True)
    graduate_level = models.ForeignKey(GraduateLevel, on_delete=models.SET_NULL, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    
    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["display_name"]

    groups = models.ManyToManyField(
        Group, 
        related_name='backend_user_set', 
        blank=True, 
        help_text='The groups this user belongs to.'
    )

    user_permissions = models.ManyToManyField(
        Permission, 
        related_name='backend_user_permissions_set', 
        blank=True, 
        help_text='Specific permissions for this user.'
    )

    def __str__(self):
        return self.email
    
    class Meta:
        db_table = "User"

class Project(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    skills_wanted = models.JSONField(default=list)

class ProjectApplication(models.Model):
    STATUSES = [('reviewing', 'Reviewing'), ('accepted', 'Accepted'), ('rejected', 'Rejected')]
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUSES, default='reviewing')
