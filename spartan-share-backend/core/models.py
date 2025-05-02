from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

# Create your models here.
class User(AbstractUser):
  email = models.EmailField(unique=True)
  display_name = models.CharField(max_length=100)
  biography = models.TextField(blank=True)
  major = models.CharField(max_length=255)
  # minor = models.CharField(max_length=255, blank=True)
  level = models.CharField(
    max_length=20,
    choices=[('Undergrad', 'Undergrad'), ('Graduate', 'Graduate')]
  )
  # profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username']

  def __str__(self):
    return self.email
  
class Project(models.Model):
  title = models.CharField(max_length=255)
  # uid = models.CharField(max_length = 100, unique=True)
  description = models.TextField()
  # creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
  creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
  start_date = models.DateField()
  end_date = models.DateField()
  skills = models.JSONField(default=list)
  majors = models.JSONField(default=list)
  graduate_levels = models.JSONField(default=list)
  saved_by = models.ManyToManyField(User, related_name='saved_projects', blank=True)

  def __str__(self):
    return self.title
  
class Application(models.Model):
  STATUS_CHOICES = [
    ('reviewing', 'Reviewing'),
    ('accepted', 'Accepted'),
    ('rejected', 'Rejected'),
  ]

  user = models.ForeignKey(User, on_delete=models.CASCADE)
  project = models.ForeignKey(Project, on_delete=models.CASCADE)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='reviewing')

  class Meta:
    unique_together = ('user', 'project')

  def __str__(self):
    return f"{self.user.email} -> {self.project.title} [{self.status}]"