from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
  username = None
  email = models.EmailField(unique=True)
  display_name = models.CharField(max_length=100)
  biography = models.TextField(blank=True)
  major = models.CharField(max_length=100, blank=True)
  # minor = models.CharField(max_length=255, blank=True)
  level = models.CharField(
    max_length=20,
    choices=[('Undergrad', 'Undergrad'), ('Graduate', 'Graduate')],
    blank=True
  )
  # profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = []

  # def __str__(self):
  #   return self.email
  objects = UserManager()
  
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