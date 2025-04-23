from django.contrib import admin
from applications.models import Application, ApplicationNote, StatusUpdate

class ApplicationNoteInline(admin.TabularInline):
    model = ApplicationNote
    extra = 0

class StatusUpdateInline(admin.TabularInline):
    model = StatusUpdate
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('tracking_id', 'applicant', 'job', 'status', 'application_date', 'updated_at')
    list_filter = ('status', 'application_date', 'updated_at')
    search_fields = ('tracking_id', 'applicant__email', 'job__title', 'job__company__name')
    readonly_fields = ('tracking_id', 'application_date', 'updated_at')
    inlines = [StatusUpdateInline, ApplicationNoteInline]
    fieldsets = (
        (None, {
            'fields': ('tracking_id', 'applicant', 'job', 'status')
        }),
        ('Application Details', {
            'fields': ('resume', 'cover_letter')
        }),
        ('Dates', {
            'fields': ('application_date', 'updated_at')
        }),
    )

@admin.register(ApplicationNote)
class ApplicationNoteAdmin(admin.ModelAdmin):
    list_display = ('application', 'created_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('application__tracking_id', 'text', 'created_by__email')
    readonly_fields = ('created_at',)

@admin.register(StatusUpdate)
class StatusUpdateAdmin(admin.ModelAdmin):
    list_display = ('application', 'previous_status', 'new_status', 'updated_by', 'created_at')
    list_filter = ('new_status', 'created_at')
    search_fields = ('application__tracking_id', 'note', 'updated_by__email')
    readonly_fields = ('created_at',)
