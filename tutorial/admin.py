from django.contrib import admin

from .models import Level, Challenge

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('number', 'title')

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('__unicode__', 'level', 'number', 'title', 'output_is_error', 'output_condition')
