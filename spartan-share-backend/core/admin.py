from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Project, Application

class UserAdmin(BaseUserAdmin):
  fieldsets = BaseUserAdmin.fieldsets + (
    (None, {'fields': ('display_name', 'biography', 'major', 'level')}),
  )

admin.site.register(User, UserAdmin)
admin.site.register(Project)
admin.site.register(Application)