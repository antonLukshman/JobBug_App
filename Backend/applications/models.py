from django.db import models
from users.models import UserProfile
from jobs.models import Job

class Application(models.Model):
    """
    Job application model
    """
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('reviewed', 'Reviewed'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    applicant = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    cover_letter = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    application_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tracking_id = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return f"{self.applicant.email} - {self.job.title} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Generate a tracking ID if not set
        if not self.tracking_id:
            import random
            import string
            self.tracking_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        
        # If this is a new application, increment the job's applicants count
        if not self.pk:
            self.job.increment_applicants()
        
        super().save(*args, **kwargs)

class ApplicationNote(models.Model):
    """
    Notes added to applications
    """
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='notes')
    text = models.TextField()
    created_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='application_notes')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Note on {self.application} by {self.created_by.email}"

class StatusUpdate(models.Model):
    """
    History of status updates for applications
    """
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='status_history')
    previous_status = models.CharField(max_length=20, choices=Application.STATUS_CHOICES, null=True, blank=True)
    new_status = models.CharField(max_length=20, choices=Application.STATUS_CHOICES)
    note = models.TextField(blank=True, null=True)
    updated_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='status_updates')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.application.tracking_id} - {self.new_status}"
