from django.db import models
import uuid

# models that mirror the SQL tables inside the database

class Major(models.Model):
    name = models.CharField(max_length=100, unique=True)

class Minor(models.Model):
    name = models.CharField(max_length=100, unique=True)

class GraduateLevel(models.Model):
    LEVELS = [('Undergraduate', 'Undergraduate'), ('Graduate', 'Graduate')]
    name = models.CharField(max_length=20, choices=LEVELS, unique=True)

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    display_name = models.CharField(max_length=100)
    biography = models.TextField(blank=True)
    major = models.ForeignKey(Major, on_delete=models.SET_NULL, null=True)
    minor = models.ForeignKey(Minor, on_delete=models.SET_NULL, null=True)
    graduate_level = models.ForeignKey(GraduateLevel, on_delete=models.SET_NULL, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

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
