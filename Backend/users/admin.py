from django.contrib import admin
from users.models import UserProfile, SocialProfile, JobPreference, SavedSearch

class SocialProfileInline(admin.TabularInline):
    model = SocialProfile
    extra = 0

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'firebase_uid', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'firebase_uid')
    list_filter = ('created_at',)
    readonly_fields = ('created_at', 'updated_at')
    inlines = [SocialProfileInline]

@admin.register(JobPreference)
class JobPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'min_salary', 'remote_only', 'willing_to_relocate')
    list_filter = ('remote_only', 'willing_to_relocate')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')

@admin.register(SavedSearch)
class SavedSearchAdmin(admin.ModelAdmin):
    list_display = ('user', 'query', 'location', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'query', 'location')
