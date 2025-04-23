from django.contrib import admin
from jobs.models import Category, Company, Job, SavedJob
from django.utils.html import format_html

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'jobs_count', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    
    def jobs_count(self, obj):
        return obj.jobs.count()
    jobs_count.short_description = 'Jobs Count'

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_logo', 'industry', 'location', 'size', 'jobs_count', 'created_at')
    list_filter = ('industry', 'size', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description', 'industry', 'location')
    readonly_fields = ('created_at', 'updated_at')
    
    def display_logo(self, obj):
        if obj.logo:
            return format_html('<img src="{}" width="50" height="50" />', obj.logo.url)
        return "No Logo"
    display_logo.short_description = 'Logo'
    
    def jobs_count(self, obj):
        return obj.jobs.count()
    jobs_count.short_description = 'Jobs Count'

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'category', 'location', 'is_remote', 'job_type', 
                   'experience_level', 'is_active', 'is_featured', 'views_count', 
                   'applicants_count', 'created_at')
    list_filter = ('is_active', 'is_featured', 'is_remote', 'job_type', 
                  'experience_level', 'created_at', 'company', 'category')
    search_fields = ('title', 'description', 'company__name', 'location')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('views_count', 'applicants_count', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'company', 'category', 'posted_by')
        }),
        ('Job Details', {
            'fields': ('location', 'is_remote', 'description', 'requirements', 
                      'responsibilities', 'benefits', 'skills')
        }),
        ('Salary Information', {
            'fields': ('salary_min', 'salary_max', 'salary_currency')
        }),
        ('Job Attributes', {
            'fields': ('job_type', 'experience_level', 'is_active', 'is_featured', 'is_urgent')
        }),
        ('Application Details', {
            'fields': ('application_link', 'application_email', 'application_deadline')
        }),
        ('Statistics', {
            'fields': ('views_count', 'applicants_count', 'created_at', 'updated_at')
        }),
    )

@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'job__title', 'job__company__name')
